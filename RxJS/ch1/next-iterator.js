// Iterator (pull)

const arr = ["Simon", "Jen", "Sergi"];

// Iterador manual
let cursor = 0;

const iterator = {
    next: () => {
        if (cursor < arr.length) return { value: arr[cursor++], done: false };
        return { done: true }; // else return { done: true };
    }
};

// Consumidor (pide valores)
let result;

while (!(result = iterator.next()).done) {
    console.log(result.value);
}

/*
Output:
Simon
Jen
Sergi
*/