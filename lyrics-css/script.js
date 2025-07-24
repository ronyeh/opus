document.addEventListener('DOMContentLoaded', () => {
    const lyricsContainer = document.getElementById('lyrics');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const animationSelect = document.getElementById('animation-select');

    const verses = Array.from(lyricsContainer.getElementsByClassName('verse'));
    let currentVerseIndex = 0;
    let currentLineIndex = 0;
    let isPlaying = false;
    let animationTimer;
    let animationStyle = 'word'; // 'word', 'line', or 'verse'
    const animationStyleSelect = document.createElement('select');
    ['word', 'line', 'verse'].forEach(style => {
        const option = document.createElement('option');
        option.value = style;
        option.textContent = style.charAt(0).toUpperCase() + style.slice(1);
        animationStyleSelect.appendChild(option);
    });
    animationStyleSelect.addEventListener('change', (e) => {
        animationStyle = e.target.value;
        currentVerseIndex = 0;
        currentIndex = 0;
        elements = getElementsToAnimate();
        resetAnimations();
    });
    document.querySelector('.controls').appendChild(animationStyleSelect);
    let currentAnimation = 'fade-in';

    const animations = [
        "fade-in", "grow", "slide-in-left", "bounce-in", "slide-in-top", "rotate-in",
        "flip-in-x", "flip-in-y", "zoom-in", "pulse", "shake", "swing", "tada",
        "light-speed-in", "roll-in", "flash", "rubber-band", "wobble", "jello",
        "text-pop-up-top", "blur-in", "tracking-in-expand", "shadow-drop-center",
        "shadow-pop-tr", "ken-burns-top", "slit-in-vertical", "heartbeat",
        "slide-in-blurred-top", "drop-in-2", "jump-in", "swirl-in-fwd", "puff-in-center",
        "flicker-in-1", "font-size-in", "color-fill-in", "rotate-in-2", "fade-in-fwd",
        "slide-in-elliptic-top-fwd", "bounce-in-top",
        // Pairs
        "fade-in/fade-out", "grow/shrink", "slide-in-left/slide-out-right",
        "bounce-in/bounce-out-bottom", "slide-in-top/slide-out-bottom", "rotate-in/rotate-out",
        "flip-in-x/flip-out-x", "flip-in-y/flip-out-y", "zoom-in/zoom-out",
        "light-speed-in/light-speed-out", "roll-in/roll-out",
        "text-pop-up-top/text-pop-up-bottom", "blur-in/blur-out",
        "tracking-in-expand/tracking-out-contract",
        "ken-burns-top/ken-burns-bottom", "slit-in-vertical/slit-out-vertical",
        "slide-in-blurred-top/slide-out-blurred-bottom", "swirl-in-fwd/swirl-out-bck",
        "puff-in-center/puff-out-center", "flicker-in-1/flicker-out-1",
        "font-size-in/font-size-out", "color-fill-in/color-fill-out",
        "rotate-in-2/rotate-out-2", "fade-in-fwd/fade-out-bck",
        "slide-in-elliptic-top-fwd/slide-out-elliptic-bottom-bck",
        "bounce-in-top/bounce-out-bottom"
    ];

    function populateAnimations() {
        animations.forEach(anim => {
            const option = document.createElement('option');
            option.value = anim;
            option.textContent = anim.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            animationSelect.appendChild(option);
        });
    }

    function prepareLyrics() {
        verses.forEach(verse => {
            const lines = Array.from(verse.getElementsByClassName('line'));
            lines.forEach(line => {
                const words = line.textContent.split(' ');
                line.innerHTML = '';
                words.forEach(word => {
                    const wordSpan = document.createElement('span');
                    wordSpan.className = 'word';
                    wordSpan.textContent = word + ' ';
                    line.appendChild(wordSpan);
                });
            });
        });
    }

    function getElementsToAnimate() {
        const verse = verses[currentVerseIndex];
        if (!verse) return [];
        if (animationStyle === 'verse') {
            return [verse];
        }
        const lines = Array.from(verse.getElementsByClassName('line'));
        if (animationStyle === 'line') {
            return lines;
        }
        const words = Array.from(verse.getElementsByClassName('word'));
        return words;
    }

    let elements = getElementsToAnimate();
    let currentIndex = 0;

    function resetAnimations() {
        elements.forEach(el => {
            el.classList.remove(...animations);
            el.style.opacity = 0;
        });
    }

    function playNext() {
        if (currentIndex < elements.length) {
            const el = elements[currentIndex];
            const [inAnim, outAnim] = currentAnimation.split('/');

            el.classList.remove(...animations.flatMap(a => a.split('/')));
            void el.offsetWidth; // Trigger reflow
            el.classList.add(inAnim);
            el.style.opacity = 1;

            const animationDuration = parseFloat(getComputedStyle(el).animationDuration) * 1000;

            if (outAnim) {
                setTimeout(() => {
                    el.classList.remove(inAnim);
                    el.classList.add(outAnim);
                }, animationDuration);
            }

            currentIndex++;
            if (isPlaying) {
                animationTimer = setTimeout(playNext, animationDuration);
            }
        } else if (isPlaying) {
            // Move to next verse or loop
            currentVerseIndex = (currentVerseIndex + 1) % verses.length;
            currentIndex = 0;
            elements = getElementsToAnimate();
            resetAnimations();
            playNext();
        }
    }

    function playPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            const el = elements[currentIndex];
            el.classList.remove(...animations);
            el.style.opacity = 0;
        }
    }

    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playPauseBtn.textContent = isPlaying ? 'Pause' : 'Play';
        if (isPlaying) {
            playNext();
        } else {
            clearTimeout(animationTimer);
        }
    });

    nextBtn.addEventListener('click', () => {
        playNext();
    });

    prevBtn.addEventListener('click', () => {
        playPrev();
    });

    animationSelect.addEventListener('change', (e) => {
        currentAnimation = e.target.value;
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            playNext();
        } else if (e.key === 'ArrowLeft') {
            playPrev();
        } else if (e.key === 'ArrowUp') {
            animationSelect.selectedIndex = (animationSelect.selectedIndex - 1 + animationSelect.options.length) % animationSelect.options.length;
            currentAnimation = animationSelect.value;
        } else if (e.key === 'ArrowDown') {
            animationSelect.selectedIndex = (animationSelect.selectedIndex + 1) % animationSelect.options.length;
            currentAnimation = animationSelect.value;
        }
    });

    populateAnimations();
    prepareLyrics();
});
