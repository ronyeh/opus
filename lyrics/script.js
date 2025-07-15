const lyrics = [
    "Twinkle,", "twinkle,", "little", "star,",
    "How", "I", "wonder", "what", "you", "are.",
    "Up", "above", "the", "world", "so", "high,",
    "Like", "a", "diamond", "in", "the", "sky.",
    "Twinkle,", "twinkle,", "little", "star,",
    "How", "I", "wonder", "what", "you", "are."
];

const lyricsContainer = document.getElementById('lyrics');
const startButton = document.getElementById('startButton');

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

lyrics.forEach(word => {
    const span = document.createElement('span');
    span.textContent = word + ' ';
    span.style.fontSize = `${getRandom(18, 32)}pt`;
    span.style.color = getRandomColor();
    span.style.webkitTextStroke = `1px ${getRandomColor()}`;
    span.style.transform = `rotate(${getRandom(-45, 45)}deg)`;
    lyricsContainer.appendChild(span);
});

startButton.addEventListener('click', () => {
    const words = lyricsContainer.querySelectorAll('span');
    let delay = 0;
    words.forEach(word => {
        setTimeout(() => {
            word.classList.add('fade-out');
        }, delay);
        delay += 1000;
    });
});
