interface MyIteratorResult<T> {
    value: T | undefined;
    done: boolean;
}

class ArrayIterator<T> {

    private cursor = 0;

    constructor(private array: T[]) { }

    next(): MyIteratorResult<T> {

        if (this.cursor < this.array.length) {
            const value = this.array[this.cursor++];
            return { value, done: false };
        }

        return { value: undefined, done: true };
    }
}

const names = ["Simon", "Jen", "Sergi"];

const iterator = new ArrayIterator<string>(names);

let result = iterator.next();

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
