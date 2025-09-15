import { bindNodeCallback } from 'rxjs';
import fs from 'fs';

const readdir$ = bindNodeCallback(fs.readdir);
const source$ = readdir$('api/'); // cambia la ruta

source$.subscribe({
  next: res => console.log(`List of directories: ${res}`),
  error: err => console.log(`Error: ${err}`),
  complete: () => console.log("Done!")
});
