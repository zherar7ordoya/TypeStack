const QUAKE_URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp`;

// L.map("map"): busca el <div id="map"> en el HTML y lo convierte en un mapa interactivo.
// .setView([lat, lng], zoom): define el punto inicial y el nivel de zoom (7 es provincial/regional).
const map = L.map("map").setView([33.858631, -118.279602], 7); // Centered in Los Angeles

// Un “tile layer” son imágenes cuadradas que se van cargando como mosaicos a medida que hacés zoom o te movés.
/*
La URL tiene placeholders:
    {s} → subdominio (a, b, c),
    {z} → nivel de zoom,
    {x}/{y} → coordenadas de cada tile.
El servidor de OpenStreetMap devuelve el mapa base.
.addTo(map) monta esta capa en tu mapa.
*/
L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);

function loadJSONP(settings) {

    const url = settings.url;
    const callbackName = settings.callbackName;
    const script = document.createElement("script");

    script.type = "text/javascript";
    script.src = url;

    window[callbackName] = data => {
        window[callbackName].data = data;
    };

    return new rxjs.Observable(observer => {

        // "e" lo da el navegador cuando el <script> termina de cargar o falla.
        const handler = e => {

            const status = e.type === "error" ? 400 : 200;
            const response = window[callbackName].data;

            if (status === 200) {
                observer.next({
                    status,
                    responseType: "jsonp",
                    response,
                    originalEvent: e
                });
                observer.complete();
            }
            else {
                observer.error({
                    type: "error",
                    status,
                    originalEvent: e
                });
            }
        };

        script.onload = script.onreadystatechange = script.onerror = handler;
        const head = document.getElementsByTagName("head")[0];
        head.insertBefore(script, head.firstChild);
    });

}

const quakes$ = rxjs.interval(5000).pipe(
    rxjs.operators.mergeMap(() =>
        loadJSONP({
            url: QUAKE_URL,
            callbackName: "eqfeed_callback"
        }).pipe(rxjs.operators.retry(3))
    ),
    rxjs.operators.mergeMap(result => rxjs.from(result.response.features)),
    rxjs.operators.distinct(quake => quake.properties.code)
);

/*
Esto se hace cada vez que llega un evento nuevo:
* L.circle([lat, lng], { radius }) crea un círculo geográfico. El radio se da en
metros, por eso multiplicás la magnitud del sismo para que se vea.
* .addTo(map) lo pone sobre el mapa.
* bindPopup asocia una ventana de información al círculo.
* Al hacer clic sobre él, se abre mostrando magnitud, lugar y hora.
*/
quakes$.subscribe({

    next: quake => {
        const coords = quake.geometry.coordinates;
        const size = quake.properties.mag * 10000;

        const circle = L.circle([coords[1], coords[0]], { radius: size }).addTo(map);

        const popupContent =
            `<strong>Magnitude:</strong> ${quake.properties.mag}<br>
        <strong>Location:</strong> ${quake.properties.place}<br>
        <strong>Time:</strong> ${new Date(quake.properties.time).toLocaleString()}`;

        circle.bindPopup(popupContent);
    }
});


const counter$ = quakes$.pipe(

    // Filtra solo los sismos ocurridos "hoy"
    rxjs.operators.filter(quake => {
        const quakeDate = new Date(quake.properties.time).toDateString();
        const todayString = new Date().toDateString();
        return quakeDate === todayString;
    }),
    // Acumula el total de sismos de hoy
    rxjs.operators.scan(count => count + 1, 0)
);

const counterDiv = document.getElementById("quake-counter");

counter$.subscribe({

    next: count => {
        counterDiv.textContent = `Earthquakes today: ${count}`;
        counterDiv.classList.add("flash");
        setTimeout(() => counterDiv.classList.remove("flash"), 500);
    }
});
