// Load the necessary libraries and models
const faceapi = require('face-api.js');
const detectionModel = faceapi.SsdMobilenetv1;
const expressionModel = faceapi.nets.ssdMobilenetv1;

// Load the models
Promise.all([
  detectionModel.loadFromUri('/models'),
  expressionModel.loadFromUri('/models'),
]).then(() => {
  // Start capturing the video feed
  const video = document.getElementById('video');
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
    video.play();
  });

  // Detect faces and expressions
  video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.appendChild(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new detectionModel()).withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100);
  });
});
