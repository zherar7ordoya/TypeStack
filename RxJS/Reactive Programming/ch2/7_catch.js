import { from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

function getJSON(arr) {
    return from(arr)        // from(arr) → emite cada string del array uno por uno.
        .pipe(
            map(JSON.parse) // map(JSON.parse) → intenta parsear cada string como JSON.
        );
}

const caught$ = getJSON(
    [
        '{"1": 1, "2": 2}',
        '{"1: 1}'

    ])
    .pipe(
        // catchError intercepta errores de la secuencia observable
        // (errores asincrónicos o generados durante la emisión).
        catchError(() =>
            // En vez de dejar que el error "rompa" el observable, lo reemplaza
            // por un nuevo Observable que vos le des.
            // En este caso, reemplaza toda la secuencia fallida por un
            // of({ error: ... }), o sea, emite un objeto de error amigable.
            of({
                error: "There was an error parsing JSON"
            }))
    );

caught$.subscribe({
    next: json => console.log("Parsed JSON: ", json),
    error: err => console.log(err.message)
});
