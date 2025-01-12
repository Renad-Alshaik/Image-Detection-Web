let model;
let detectionCounter = 0;

// Initialize the model
async function init() {
    const modelURL = 'Image-detection/model/model.json';
    model = await tmImage.load(modelURL);
    console.log('Model loaded');
}

init();

// Handle image upload
async function handleImageUpload(event) {
    if (!model) {
        console.error('Model is not loaded yet');
        return;
    }

    const imageElement = document.createElement('img');
    imageElement.src = URL.createObjectURL(event.target.files[0]);

    imageElement.onload = async function () {
        const prediction = await model.predict(imageElement);
        handlePrediction(prediction);
    };
}

// Handle prediction
function handlePrediction(prediction) {
    console.log('Predictions:', prediction);

    let detectedClass = '';
    prediction.forEach((pred) => {
        if (pred.probability > 0.7) {
            detectedClass = pred.className;
        }
    });

    if (detectedClass) {
        document.getElementById('status').innerText = `Detected: ${detectedClass}`;
        detectionCounter++;
        updateCounter();
        saveCounterToDatabase(detectionCounter);
    } else {
        document.getElementById('status').innerText = 'No detection made. Try again!';
    }
}

// Update the counter display
function updateCounter() {
    document.getElementById('counter').innerText = `Detections: ${detectionCounter}`;
}

// Save the counter to local storage
function saveCounterToDatabase(counter) {
    localStorage.setItem('detectionCounter', counter);
}

// Load the counter from local storage on page load
window.onload = function () {
    const savedCounter = localStorage.getItem('detectionCounter');
    if (savedCounter !== null) {
        detectionCounter = parseInt(savedCounter);
        updateCounter();
    }
};
