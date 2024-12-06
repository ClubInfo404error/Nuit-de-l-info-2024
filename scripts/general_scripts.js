function narrateText(input) {
    // Arrêter toute lecture en cours
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel(); // Stoppe immédiatement la lecture
        narrateText(input); // Relancer la lecture du nouvel élément
        return;
    }

    // Identifier le texte à lire
    let textToRead;
    const element = document.getElementById(input);

    if (element) {
        textToRead = element.innerText || element.textContent;
    } else {
        textToRead = input; // Utiliser directement l'entrée comme texte
    }

    // Vérifier si du texte est disponible pour la narration
    if (textToRead) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = textToRead;
        speech.lang = 'fr-FR'; // Langue française
        speech.pitch = 1; // Hauteur normale
        speech.rate = 1; // Vitesse normale
        speechSynthesis.speak(speech);
    } else {
        console.error(`Aucun texte à lire pour l'entrée : "${input}".`);
    }
}