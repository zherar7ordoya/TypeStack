import { Observable } from "rxjs";

const button = document.getElementById("retrieveDataBtn");
const source1 = Observable.ajax.getJSON("/resource1").pluck("name");
const source2 = Observable.ajax.getJSON("/resource2").pluck("props", "name");

const getResults = amount =>
    source1
        .merge(source2)
        .pluck("names")
        .flatMap(array => Observable.from(array))
        .distinct()
        .take(amount);

const clicks = Observable.fromEvent(button, "click");

clicks
    .debounceTime(1000)
    .flatMap(getResults(5))
    .subscribe(
        value => console.log("Received value", value),
        err => console.error(err),
        () => console.log("All values retrieved!")
    );