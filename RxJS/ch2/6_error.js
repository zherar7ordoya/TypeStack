import { from } from "rxjs";
import { map } from "rxjs/operators";

function getJSON(arr) {
    return from(arr).pipe(
        map(JSON.parse)
    );
}

getJSON([
    '{"1": 1, "2": 2}',
    '{"success: true}', // Invalid JSON string 
    '{"enabled": true}'
]).subscribe({
    next: json => console.log("Parsed JSON: ", json),
    error: err => console.log(err.message)
});