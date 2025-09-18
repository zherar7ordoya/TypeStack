import { from, of } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

const values$ = from([
    of(1, 2, 3),
    of(4, 5, 6),
    of(7, 8, 9)
]);

// values$ is an Observable that emits three Observables.

/*
flatMap is not a method on RxJS Observables in v6 and later.
Instead, use the mergeAll or mergeMap operator with pipe.
*/
values$
.pipe(
    mergeAll()
)
.subscribe(value => console.log(value));
