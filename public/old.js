import measurementData from './data.js';

// Function to update the displayed values for the sliders
function updateSliderValues() {
  document.getElementById('body-height-value').textContent = document.getElementById('body-height').value;
  document.getElementById('chest-circumference-value').textContent = document.getElementById('chest-circumference').value;
  document.getElementById('hip-width-value').textContent = document.getElementById('hip-width').value;
  document.getElementById('waist-width-value').textContent = document.getElementById('waist-width').value;
}

// Function to calculate the suitable suit size based on the selected measurements
function calculateSuitSize() {
  // Get the selected measurements
  const bodyHeight = parseInt(document.getElementById('body-height').value);
  const chestCircumference = parseInt(document.getElementById('chest-circumference').value);
  const hipWidth = parseInt(document.getElementById('hip-width').value);
  const waistWidth = parseInt(document.getElementById('waist-width').value);

  // Find the corresponding suit size using the measurementData
  const suitSizes = measurementData["Anzüge"]["Sizes"]["values"];
  const bodyHeights = measurementData["Anzüge"]["Körpergröße"]["values"];
  const chestCircumferences = measurementData["Anzüge"]["Brustumfang"]["values"];
  const hipWidths = measurementData["Anzüge"]["Gesässweite"]["values"];
  const waistWidths = measurementData["Anzüge"]["Bundweite"]["values"];

  // Find the index that matches the selected measurements
  const index = bodyHeights.findIndex((value, idx) =>
    value === bodyHeight &&
    chestCircumferences[idx] === chestCircumference &&
    hipWidths[idx] === hipWidth &&
    waistWidths[idx] === waistWidth
  );

  // Get the corresponding suit size
  const suitSize = suitSizes[index];

  // Display the suitable suit size
  document.getElementById('suit-size').textContent = suitSize;
}

// Event listeners to update the displayed values and calculate the suitable suit size when sliders are changed
document.getElementById('body-height').addEventListener('input', () => { updateSliderValues(); calculateSuitSize(); });
document.getElementById('chest-circumference').addEventListener('input', () => { updateSliderValues(); calculateSuitSize(); });
document.getElementById('hip-width').addEventListener('input', () => { updateSliderValues(); calculateSuitSize(); });
document.getElementById('waist-width').addEventListener('input', () => { updateSliderValues(); calculateSuitSize(); });

// Initialize the slider values and calculate the suit size when the page loads
updateSliderValues();
calculateSuitSize();
