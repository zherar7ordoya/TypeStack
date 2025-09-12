import { of } from 'rxjs';

of(1, 2, 3).subscribe(value => {
    console.log(value);
});
