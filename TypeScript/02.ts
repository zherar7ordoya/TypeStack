function add(a: number, b: number) {
    return a + b;
}

const x: number | null = null;

const statusEl = document.getElementById('status');

if (statusEl) {
    statusEl.textContent = 'Ready';  // OK, null has been excluded
}
statusEl!.textContent = 'Ready';  // OK, we've asserted that el is non-null

const tenses = ['past', 'present', 'future']; 
tenses[3]?.toUpperCase(); // OK, short-circuits if index 3 doesn't exist

