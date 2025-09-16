import { interval } from 'rxjs';
import { scan, map } from 'rxjs/operators';

const average$ = interval(1000)
    .pipe(
        scan(
            (previous, current) => {
                return {
                    sum: previous.sum + current,
                    count: previous.count + 1
                };
            },
            { sum: 0, count: 0 }
        ),
        map(result => result.sum / result.count)
    );

average$.subscribe(x => console.log("Average is: ", x));