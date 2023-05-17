// the link to the machine learning model
const URL = "https://teachablemachine.withgoogle.com/models/e8mr-2TXK/";

let model, webcam, labelContainer, maxPredictions;

let btn = document.querySelector("button");
let loading = document.querySelector(".loading");

// load the image model and setup the webcam
function showImage() {
  loading.style.display = "block";

  setTimeout(function() {
    loading.style.display = "none";
  }, 7200);
}

async function init() {



  
  
    
  
  loading.style.display = "block";
  btn.style.display = "none";

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Rrfer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) { // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
  async function predict() {
  // predict
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    const labelElement = labelContainer.childNodes[i];
    
    labelElement.innerHTML = classPrediction;
    

     // add blue color when over 85%
if (prediction[i].probability > 0.85) {
labelElement.classList.add("high-confidence");
labelElement.classList.remove("middle-confidence");
labelElement.classList.remove("low-confidence");
} 
// add orange color when over 50%
else if (prediction[i].probability > 0.50) {
labelElement.classList.remove("high-confidence");
labelElement.classList.add("middle-confidence");
labelElement.classList.remove("low-confidence");
} 
// add red color when over 0%
else {
labelElement.classList.remove("high-confidence");
labelElement.classList.remove("middle-confidence");
labelElement.classList.add("low-confidence");
}

    
  }
}