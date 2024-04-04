
export default function RandomPhrase(data) {
    const index = Math.floor(Math.random() * data.length);
    return data[index];
}


