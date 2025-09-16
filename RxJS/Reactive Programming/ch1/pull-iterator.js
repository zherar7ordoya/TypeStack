var ArrayIterator = /** @class */ (function () {
    function ArrayIterator(array) {
        this.array = array;
        this.cursor = 0;
    }
    ArrayIterator.prototype.next = function () {
        if (this.cursor < this.array.length) {
            var value = this.array[this.cursor++];
            return { value: value, done: false };
        }
        return { value: undefined, done: true };
    };
    return ArrayIterator;
}());
var names = ["Simon", "Jen", "Sergi"];
var iterator = new ArrayIterator(names);
var result = iterator.next();
while (!result.done) {
    console.log(result.value);
    result = iterator.next();
}
/*
Output:
Simon
Jen
Sergi
*/
