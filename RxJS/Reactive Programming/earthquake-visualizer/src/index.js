/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/

import { Observable } from "rxjs";
import L from "leaflet";

const QUAKE_URL = `http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp`;

/**
 * Helper function para cargar contenido JSONP.
 *
 * Crea un elemento `<script>` con su propiedad `src` apuntando a un 
 * script de JavaScript en particular. Una vez que se inserta en `<head>`,
 * el contenido de ese script será ejecutado.
 *
 * @param {string} url - La URL del script a cargar.
 * @returns {void}
 */
function loadJSONP(url) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    const head = document.getElementsByTagName("head")[0];
    head.appendChild(script);
}

/**
 * Placeholder `<div>` que la librería Leaflet utilizará
 * como contenedor para renderizar el mapa.
 *
 * @type {HTMLDivElement}
 */
const mapContainer = document.createElement("div");

mapContainer.id = "map";
document.body.appendChild(mapContainer);

/**
 * Inicializa el mapa de Leaflet centrado en Los Ángeles
 * (zona con alta actividad sísmica) con un nivel de zoom razonable.
 *
 * @type {L.Map}
 */
const map = L.map("map").setView([33.858631, -118.279602], 7);

/**
 * Configura la capa de teselas (tiles) por defecto en el mapa Leaflet.
 * 
 * Un *tile set* funciona como un “tema” visual del mapa. En este caso
 * se usan las teselas de OpenStreetMap, a través de la URL de plantilla
 * `{s}.tile.osm.org/{z}/{x}/{y}.png`.
 *
 * @type {L.TileLayer}
 */
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);

function loadJSONP(settings) {
    const url = settings.url; // loadJSONP gets a settings parameter that contains the url and callbackName.
    const callbackName = settings.callbackName;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    window[callbackName] = data => { // Here we create a global function in the browser window object with the name of the JSONP callback.
        window[callbackName].data = data;
    };

    return Observable.create(observer => { // Our Observable is quite specific, so we use the create operator to have total freedom to write our logic.
        const handler = e => { // The handler function receives an event as a parameter. This event is emitted when our JSONP script has been loaded.
            const status = e.type === "error" ? 400 : 200;
            const response = window[callbackName].data;

            if (status === 200) {
                observer.next({ // (Libro p50)
                    status,
                    responseType: "jsonp",
                    response,
                    originalEvent: e
                });

                observer.complete();
            } else {
                observer.error({ // (Libro p50)
                    type: "error",
                    status,
                    originalEvent: e
                });
            }
        };

        // Finally, we assign our handler function to event listeners that
        // listen for remote script events like loading status and errors.
        script.onload = script.onreadystatechanged = script.onerror = handler;

        const head = window.document.getElementsByTagName("head")[0];
        head.insertBefore(script, head.firstChild);
    });
}

//---

/*
const quakes$ = Observable.create(observer => {
  window.eqfeed_callback = response => {
    response.features.forEach(observer.next);
  };

  loadJSONP(QUAKE_URL);
});

quakes$.subscribe(quake => {
  const coords = quake.geometry.coordinates;
  const size = quake.properties.mag * 10000;

  L.circle([coords[1], coords[0]], size).addTo(map);
});
*/

//---

/*
const quakes$ = Observable.create(observer => {
    window.eqfeed_callback = response => {
        observer.next(response); // next only happens once, and it yields the whole JSON response.
        observer.complete(); // Since we’ll yield only one time, we signal completion after next.
    };

    loadJSONP(QUAKE_URL);

}).flatMap(dataset => { // We’re chaining the flatMap call to the result of create.
    //Here we take the features array containing all the earthquakes and create an Observable from it.
    return Observable.from(dataset.features);
});
*/

//---

const quakes$ = Observable.interval(5000)
    .flatMap(() => {
        return loadJSONP({
            url: QUAKE_URL,
            callbackName: "eqfeed_callback"
        }).retry(3);
    })
    .flatMap(result => Observable.from(result.response.features))
    .distinct(quake => quake.properties.code);

quakes$.subscribe(quake => {
    const coords = quake.geometry.coordinates;
    const size = quake.properties.mag * 10000;

    L.circle([coords[1], coords[0]], size).addTo(map);
});
