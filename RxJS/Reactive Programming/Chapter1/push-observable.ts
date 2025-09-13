import { Observable } from "rxjs";

// Definimos que el observable emitirá strings
const observable: Observable<string> = new Observable(observer => {
    observer.next("Simon");
    observer.next("Jen");
    observer.next("Sergi");
    observer.complete(); // señal de que terminó la secuencia
});

// Consumidor (subscriber)
/*
observable.subscribe({
    next: (x: string) => console.log(x),
    complete: () => console.log("done")
});
*/

observable.subscribe({
    next: value => console.log(`Next: ${value}`),
    error: error => console.log(`Error: ${error}`),
    complete: () => console.log("Completed")
});;
