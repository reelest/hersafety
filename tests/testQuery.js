import { parseQuery } from "./utils/createQuery";

const m = "Abcdefghijklmnopqrstuvwxyzyxwvutsrqponmlkjihgfedcba".repeat(5);

for (let i = 0; i <= m.length; i++) {
    console.log(i + ":" + parseQuery(m.slice(0, i)).flat().length, JSON.stringify( parseQuery(m.slice(0, i)).flat()).length);
}
