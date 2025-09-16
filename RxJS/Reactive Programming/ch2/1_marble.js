import { range } from 'rxjs';
import { reduce, map } from 'rxjs/operators';

const average$ = range(0, 25)
    .pipe(
        // *
        reduce((previous, current) =>
        ({
            sum: previous.sum + current,
            count: previous.count + 1
        }),
            { sum: 0, count: 0 }),
        // *
        map(result => result.sum / result.count)
    );

average$.subscribe(x => console.log("Average is: ", x));
