class MultipleIterator {

    constructor(arr, divisor = 1) {
        this.cursor = 0;
        this.array = arr;
        this.divisor = divisor;
    }

    next() {
        while (this.cursor < this.array.length) {
            const value = this.array[this.cursor++];
            if (value % this.divisor === 0) return value;
        }
    }

    hasNext() {
        let cur = this.cursor;

        while (cur < this.array.length) {
            if (this.array[cur++] % this.divisor === 0) return true;
        }

        return false;
    }
}

const consumer = new MultipleIterator(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    3
);

console.log(consumer.next(), consumer.hasNext()); // 3 true 
console.log(consumer.next(), consumer.hasNext()); // 6 true 
console.log(consumer.next(), consumer.hasNext()); // 9 false