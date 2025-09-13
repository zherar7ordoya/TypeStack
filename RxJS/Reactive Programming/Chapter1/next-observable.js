// Observable (push)

import { Observable } from "rxjs";

const observable = new Observable(observer => {
    observer.next("Simon");
    observer.next("Jen");
    observer.next("Sergi");
    observer.complete();
});

// Consumidor (recibe valores cuando llegan)
observable.subscribe({
    next: x => console.log(x),
    complete: () => console.log("done")
});

/*
Output:
Simon
Jen
Sergi
done
*/