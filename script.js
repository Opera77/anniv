// pour trouver le chemin de la video faites CTRL + F et rechercher video.mp4
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// DOM elements
const audioElement = document.getElementById('background-music');
const audioToggle = document.getElementById('audio-toggle');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const floatingHeartsContainer = document.querySelector('.floating-hearts');
const messageText = document.querySelector('.message-text');
const lyricsText = document.getElementById('lyrics-text');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselIndicators = document.querySelectorAll('.carousel-indicator');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const romanticSection = document.getElementById('romantic-section');
const musicNotification = document.getElementById('music-notification');
const memoryItems = document.querySelectorAll('.memory-item');
const rosePetalsContainer = document.querySelector('.rose-petals');
const videoElement = document.getElementById('milodie-video');

// Variables
let isPlaying = false;
let currentSlide = 0;
let carouselInterval;
let currentLyricIndex = 0;
let hasInteracted = false;

// Paroles Romantique
const romanticLyrics = [
    "Dans tes yeux, j'ai trouvé le reflet de tous mes rêves.",
    "Ton amour est la lumière qui me guide à travers les nuits les plus sombres.",
    "Avec toi, chaque jour est une célébration de l'amour.",
    "Tu es la poésie qui coule dans mon cœur.",
    "Mon amour pour toi se renforce chaque jour qui passe.",
    "Ton sourire est le soleil qui illumine mon monde.",
    "L'éternité ne suffirait pas à te montrer combien je t'aime.",
    "Ton sourire est comme une douce mélodie qui apaise l'âme, un éclat de lumière qui fait danser les cœurs."
];

// Initialiser la page
function init() {
    createFloatingHearts();
    createParticles();
    createRosePetals();
    setupAnimations();
    setupEventListeners();
    startCarouselAutoplay();
    startLyricsTypewriter();
    
    // S music 
    setTimeout(() => {
        musicNotification.classList.add('show');
    }, 2000);
    
 
    memoryItems.forEach(item => {
        item.style.display = 'block';
        item.style.visibility = 'visible';
        item.style.opacity = '1';
    });
    
    // remplacer par le nom de votre video ainsi que son extention
    videoElement.src = "images/video.mp4"; 
}


function createFloatingHearts() {
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${Math.random() * 25 + 15}" height="${Math.random() * 25 + 15}" viewBox="0 0 24 24" fill="#f9a8d4" stroke="#f9a8d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        `;
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.opacity = '0.5';
        heart.style.transform = `rotate(${Math.random() * 45}deg)`;
        floatingHeartsContainer.appendChild(heart);
    }
}

function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 15 + 15}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesContainer.appendChild(particle);
    }
}

function createRosePetals() {
    const petalImages = [
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Y5YThkNCIgc3Ryb2tlPSIjZjlhOGQ0IiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIxLjM1bC0xLjQ1LTEuMzJDNS40IDE1LjM2IDIgMTIuMjggMiA4LjUgMiA1LjQyIDQuNDIgMyA3LjUgM2MxLjc0IDAgMy40MS44MSA0LjUgMi4wOUMxMy4wOSAzLjgxIDE0Ljc2IDMgMTYuNSAzIDE5LjU4IDMgMjIgNS40MiAyMiA4LjVjMCAzLjc4LTMuNCA2Ljg2LTguNTUgMTEuNTRMMTIgMjEuMzV6Ii8+PC9zdmc+",
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Y5YThkNCIgc3Ryb2tlPSIjZjlhOGQ0IiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwLjg0IDQuNjFhNS41IDUuNSAwIDAgMC03Ljc4IDBMMTI1LjY3bC0xLjA2LTEuMDZhNS41IDUuNSAwIDAgMC03Ljc4IDcuNzhsMS4wNiAxLjA2TDEyIDIxLjIzbDcuNzgtNy43OCAxLjA2LTEuMDZhNS41IDUuNSAwIDAgMCAwLTcuNzh6Ii8+PC9zdmc+"
    ];

    for (let i = 0; i < 15; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.top = `-50px`;
        petal.style.backgroundImage = `url(${petalImages[Math.floor(Math.random() * petalImages.length)]})`;
        petal.style.transform = `rotate(${Math.random() * 360}deg)`;
        petal.style.animationDuration = `${Math.random() * 10 + 10}s`;
        petal.style.animationDelay = `${Math.random() * 5}s`;
        rosePetalsContainer.appendChild(petal);
    }
}

// GSAP animations
function setupAnimations() {
    // animations
    const tl = gsap.timeline();
    tl.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: "back.out(1.7)"
    })
    .from(".hero-subtitle", {
        opacity: 0,
        duration: 1,
        delay: 0.3
    })
    .from(".floating-hearts .heart", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "elastic.out(1, 0.3)"
    });

    // animation
    gsap.to(".floating-hearts .heart", {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.1,
        ease: "sine.inOut"
    });

    //section message annimer   
    ScrollTrigger.create({
        trigger: ".message-section",
        start: "top 80%",
        onEnter: () => {
            gsap.to(".message-text", {
                duration: 1,
                opacity: 1,
                ease: "power2.out"
            });
        },
        once: true
    });

    //  section animation parole
    ScrollTrigger.create({
        trigger: "#romantic-section",
        start: "top 70%",
        onEnter: () => {
            tryPlayMusic();
        },
        once: true
    });

    // section Video animation
    ScrollTrigger.create({
        trigger: ".video-section",
        start: "top 70%",
        onEnter: () => {
            gsap.from(".video-container", {
                opacity: 0,
                y: 30,
                duration: 1
            });
            gsap.from(".smile-lyrics", {
                opacity: 0,
                y: 30,
                duration: 1,
                delay: 0.5
            });
        },
        once: true
    });

    //  section animation
    ScrollTrigger.create({
        trigger: ".cake-section",
        start: "top 70%",
        onEnter: () => {
            gsap.from(".cake", {
                opacity: 0,
                y: 30,
                duration: 1
            });
            gsap.from(".cake-wish", {
                opacity: 0,
                y: 20,
                duration: 1,
                delay: 0.5
            });
            
            // Animate flames
            gsap.to(".flame", {
                y: -3,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.2
            });
        },
        once: true
    });

    //section animation Carousel 
    ScrollTrigger.create({
        trigger: ".carousel-section",
        start: "top 70%",
        onEnter: () => {
            gsap.from(".carousel-container", {
                opacity: 0,
                y: 30,
                duration: 1
            });
        },
        once: true
    });

    // Memore animation
    gsap.from(".memory-item", {
        scrollTrigger: {
            trigger: ".memories-section",
            start: "top 70%"
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2
    });

    // animation du Footer
    gsap.from(".footer", {
        scrollTrigger: {
            trigger: ".footer",
            start: "top 90%"
        },
        opacity: 0,
        y: 20,
        duration: 1
    });
}

function setupEventListeners() {

    audioToggle.addEventListener('click', toggleAudio);
    
    // navigation Carousel
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // 
    
    document.addEventListener('click', function() {
        hasInteracted = true;
        tryPlayMusic();
        musicNotification.classList.remove('show');
    });
}


function tryPlayMusic() {
    if (hasInteracted && !isPlaying) {
        toggleAudio();
    }
}


function toggleAudio() {
    if (isPlaying) {
        audioElement.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    } else {
        audioElement.play().catch(e => {
            console.log("Audio play failed:", e);
         
            
        });
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    }
    isPlaying = !isPlaying;
}


function startCarouselAutoplay() {
    carouselInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}


function prevSlide() {
    goToSlide(currentSlide === 0 ? carouselSlides.length - 1 : currentSlide - 1);
}


function nextSlide() {
    goToSlide(currentSlide === carouselSlides.length - 1 ? 0 : currentSlide + 1);
}


function goToSlide(index) {

    carouselSlides[currentSlide].classList.remove('active');
    carouselSlides[index].classList.add('active');
    

    carouselIndicators[currentSlide].classList.remove('active');
    carouselIndicators[index].classList.add('active');
    

    currentSlide = index;
    

    clearInterval(carouselInterval);
    startCarouselAutoplay();
}


function startLyricsTypewriter() {
    showNextLyric();
}


function showNextLyric() {
    const lyric = romanticLyrics[currentLyricIndex];
    

    gsap.to(lyricsText, {
        duration: 1,
        text: "",
        ease: "none"
    });
    

    gsap.to(lyricsText, {
        duration: 3,
        text: lyric,
        ease: "none",
        delay: 1,
        onComplete: () => {

            setTimeout(() => {
                currentLyricIndex = (currentLyricIndex + 1) % romanticLyrics.length;
                showNextLyric();
            }, 4000);
        }
    });
}


document.addEventListener('DOMContentLoaded', init);
