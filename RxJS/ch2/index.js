const QUAKE_URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp`;

const map = L.map("map").setView([33.858631, -118.279602], 7); // Centered in Los Angeles

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
            } else {
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


quakes$.subscribe(quake => {
    const coords = quake.geometry.coordinates;
    const size = quake.properties.mag * 10000;

    const circle = L.circle([coords[1], coords[0]], { radius: size }).addTo(map);

    const popupContent = `
        <strong>Magnitude:</strong> ${quake.properties.mag}<br>
        <strong>Location:</strong> ${quake.properties.place}<br>
        <strong>Time:</strong> ${new Date(quake.properties.time).toLocaleString()}
    `;

    circle.bindPopup(popupContent);
});
