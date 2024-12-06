// Écouteur de l'événement pour le changement de température
document.getElementById("ocean-temperature").addEventListener("input", (e) => {
    const value = e.target.value;
    const waveHeight = value / 10;
    const waveSpeed = value / 100;
    const heartScale = 1 + (value / 200);

    // Mise à jour de l'animation des vagues
    gsap.to("#ocean-waves path", {
        y: `+=${waveHeight}`, 
        duration: waveSpeed, 
        ease: "sine.inOut"
    });

    // Mise à jour de l'animation du cœur
    gsap.to("#human-heart", {
        scale: heartScale,
        duration: 0.5,
        ease: "power1.inOut"
    });

    // Mise à jour de l'explication en temps réel
    let explanationText = "";

    if (value < 30) {
        explanationText = "<p><strong>Température trop basse :</strong> Les courants océaniques sont ralentis, ce qui perturbe l'écosystème global. Le cœur humain peut également souffrir d'une baisse de circulation sanguine.</p>";
    } else if (value >= 30 && value <= 70) {
        explanationText = "<p><strong>Température optimale :</strong> Le système climatique fonctionne normalement, et le cœur humain est dans un état optimal de circulation et de pression.</p>";
    } else if (value > 70 && value <= 95) {
        explanationText = "<p><strong>Température élevée :</strong> La température élevée perturbe les courants océaniques, ce qui entraîne une accélération du réchauffement climatique. Le cœur humain subit un stress, entraînant une hypertension.</p>";
    } else {
        explanationText = "<p><strong>Température trop élevée :</strong> La température extrêmement élevée cause des perturbations sévères dans les courants océaniques et un stress intense sur le cœur humain, pouvant mener à une crise cardiaque.</p>";
        // Si la température est trop élevée, on charge un son d'explosion et change l'image du cœur
        playExplosionSound();
        changeHeartToExplosion();
    }

    // Afficher l'explication
    document.getElementById("explanation").innerHTML = explanationText;
});

// Démarre la crise en fonction de l'entrée de la température
document.getElementById("start-crisis").addEventListener("click", () => {
    gsap.to("#ocean-waves path", {
        duration: 2,
        y: "+=10",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
    });

    gsap.to("#human-heart", {
        scale: 1.2,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
});

// Fonction pour jouer le son d'explosion
function playExplosionSound() {
    const explosionAudio = new Audio('/www/audio/explosion.mp3'); // Remplacez le chemin par celui du fichier son
    explosionAudio.play();
}

// Fonction pour changer l'image du cœur en GIF explosif
function changeHeartToExplosion() {
    const heartImage = document.getElementById("human-heart");
    heartImage.src = "/www/images/circulation/heart_attack.gif"; // Remplacez par le chemin de votre GIF explosif
    heartImage.alt = "Explosion!";
}

// Niveau 1

let heartRate;
let oceanCurrent;

function getRandomHeartRate() {
    // Générer un rythme cardiaque aléatoire en dehors de la zone optimale (60-100 BPM)
    let rate;
    do {
        rate = Math.floor(Math.random() * 150) + 30; // Générer entre 30 et 180 BPM
    } while (rate >= 60 && rate <= 100);
    return rate;
}

function getRandomOceanCurrent() {
    // Générer un courant océanique aléatoire en dehors de la zone optimale ("Stable")
    const currents = ["Rapide", "Lent"];
    return currents[Math.floor(Math.random() * currents.length)];
}

function initializeGame() {
    heartRate = getRandomHeartRate();
    oceanCurrent = getRandomOceanCurrent();
    document.getElementById("heart-rate").innerText = heartRate + " BPM";
    document.getElementById("ocean-current").innerText = oceanCurrent;
    updateButtonAnimations();
}

function increaseHeartRate() {
    heartRate += 5;
    document.getElementById("heart-rate").innerText = heartRate + " BPM";
    checkHeartRate();
}

function decreaseHeartRate() {
    heartRate -= 5;
    document.getElementById("heart-rate").innerText = heartRate + " BPM";
    checkHeartRate();
}

function checkHeartRate() {
    if (heartRate > 100 || heartRate < 60) {
        updateHeartRateButtonAnimations();
    } else {
        stopHeartRateButtonAnimations();
        checkIfNextLevel();
    }
}

function increaseCurrent() {
    if (oceanCurrent === "Lent") {
        oceanCurrent = "Stables";
        document.getElementById("ocean-current").innerText = oceanCurrent;
        stopCurrentButtonAnimations();
    } else {
        oceanCurrent = "Rapide";
        document.getElementById("ocean-current").innerText = oceanCurrent;
        updateCurrentButtonAnimations();
    }
    checkIfNextLevel();
}

function decreaseCurrent() {
    if (oceanCurrent === "Rapide") {
        oceanCurrent = "Stables";
        document.getElementById("ocean-current").innerText = oceanCurrent;
        stopCurrentButtonAnimations();
    } else {
        oceanCurrent = "Lent";
        document.getElementById("ocean-current").innerText = oceanCurrent;
        updateCurrentButtonAnimations();
    }
    checkIfNextLevel();
}

function checkCurrent() {
    if (oceanCurrent === "Rapide" || oceanCurrent === "Lent") {
        updateCurrentButtonAnimations();
    } else {
        stopCurrentButtonAnimations();
    }
}

function updateHeartRateButtonAnimations() {
    const increaseButton = document.querySelector(".btn-danger.increase");
    const decreaseButton = document.querySelector(".btn-danger.decrease");

    if (heartRate > 100) {
        increaseButton.style.animation = "";
        decreaseButton.style.animation = "bounce 1s infinite";
        run_anim_bouton();
    } else if (heartRate < 60) {
        decreaseButton.style.animation = "";
        increaseButton.style.animation = "bounce 1s infinite";
        run_anim_bouton();
    } else {
        stopHeartRateButtonAnimations();
    }
}

function updateCurrentButtonAnimations() {
    const increaseButton = document.querySelector(".btn-primary.increase");
    const decreaseButton = document.querySelector(".btn-primary.decrease");

    if (oceanCurrent === "Rapide") {
        increaseButton.style.animation = "";
        decreaseButton.style.animation = "bounce 1s infinite";
        run_anim_bouton();
    } else if (oceanCurrent === "Lent") {
        decreaseButton.style.animation = "";
        increaseButton.style.animation = "bounce 1s infinite";
        run_anim_bouton();
    } else {
        stopCurrentButtonAnimations();
    }
}

function stopCurrentButtonAnimations() {
    const increaseButton = document.querySelector(".btn-primary.increase");
    const decreaseButton = document.querySelector(".btn-primary.decrease");
    increaseButton.style.animation = "";
    decreaseButton.style.animation = "";
}

function stopHeartRateButtonAnimations() {
    const increaseButton = document.querySelector(".btn-danger.increase");
    const decreaseButton = document.querySelector(".btn-danger.decrease");
    increaseButton.style.animation = "";
    decreaseButton.style.animation = "";
}

function updateButtonAnimations() {
    checkHeartRate();
    checkCurrent();
}

function checkIfNextLevel() {
    if (heartRate >= 60 && heartRate <= 100 && oceanCurrent === "Stables") {
        document.getElementById("next-level").classList.remove("d-none");
    } else {
        document.getElementById("next-level").classList.add("d-none");
    }
}

function startGame() {
    document.getElementById('home').classList.add('d-none');
    document.getElementById('level1').classList.remove('d-none');
    initializeGame();
}

function run_anim_bouton() {
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-10px); }
    }
    `;
    document.head.appendChild(style);
}

function updateCurrentButtonAnimations() {
    const increaseButton = document.querySelector(".btn-primary.increase");
    const decreaseButton = document.querySelector(".btn-primary.decrease");

    if (oceanCurrent === "Rapide") {
        increaseButton.style.animation = "";
        decreaseButton.style.animation = "bounce 1s infinite";
        run_anim_bouton();
    } else if (oceanCurrent === "Lent") {
        decreaseButton.style.animation = "";
        increaseButton.style.animation = "bounce 1s infinite";
        run_anim_bouton();
    } else {
        stopCurrentButtonAnimations();
    }
}

function stopCurrentButtonAnimations() {
    const increaseButton = document.querySelector(".btn-primary.increase");
    const decreaseButton = document.querySelector(".btn-primary.decrease");
    increaseButton.style.animation = "";
    decreaseButton.style.animation = "";
}

function stopHeartRateButtonAnimations() {
    const increaseButton = document.querySelector(".btn-danger.increase");
    const decreaseButton = document.querySelector(".btn-danger.decrease");
    increaseButton.style.animation = "";
    decreaseButton.style.animation = "";
}

function updateButtonAnimations() {
    checkHeartRate();
    checkCurrent();
}

function checkIfNextLevel() {
    if (heartRate >= 60 && heartRate <= 100 && oceanCurrent === "Stables") {
        document.getElementById("finish-level").classList.remove("d-none");
    } else {
        document.getElementById("finish-level").classList.add("d-none");
    }
}

function startGame() {
    document.getElementById('home').classList.add('d-none');
    document.getElementById('level1').classList.remove('d-none');
    initializeGame();
}

function run_anim_bouton() {
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-10px); }
    }
    `;
    document.head.appendChild(style);
}