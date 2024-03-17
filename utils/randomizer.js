import { phrases } from "./phrases";


export default function RandomPhrase() {
    const index = Math.floor(Math.random() * phrases.length);
    return phrases[index];

}