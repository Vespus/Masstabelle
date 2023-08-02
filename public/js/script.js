import measurementData from './data.js';

function updateSliderValues() {
  console.log("Updating slider values..."); // Debugging output
  document.getElementById('body-height-value').textContent = document.getElementById('body-height').value;
  document.getElementById('chest-circumference-value').textContent = document.getElementById('chest-circumference').value;
  document.getElementById('hip-width-value').textContent = document.getElementById('hip-width').value;
  document.getElementById('waist-width-value').textContent = document.getElementById('waist-width').value;
}

function interpolate(value, values, sizes) {
  const closestIndex = values.findIndex(v => v >= value);
  const closestValue = values[closestIndex];
  const nextClosestValue = values[closestIndex + 1] || closestValue;
  const weight = (value - closestValue) / (nextClosestValue - closestValue);
  return sizes[closestIndex] * (1 - weight) + sizes[closestIndex + 1] * weight;
}

function calculateSuitSize() {
  const bodyHeight = parseInt(document.getElementById('body-height').value);
  const chestCircumference = parseInt(document.getElementById('chest-circumference').value);
  const hipWidth = parseInt(document.getElementById('hip-width').value);
  const waistWidth = parseInt(document.getElementById('waist-width').value);

  const bodyHeights = measurementData["Anzüge"]["Körpergröße"]["values"];
  const chestCircumferences = measurementData["Anzüge"]["Brustumfang"]["values"];
  const hipWidths = measurementData["Anzüge"]["Gesässweite"]["values"];
  const waistWidths = measurementData["Anzüge"]["Bundweite"]["values"];
  const suitSizes = measurementData["Anzüge"]["Sizes"]["values"];

  const interpolatedHeightSize = interpolate(bodyHeight, bodyHeights, suitSizes);
  const interpolatedChestSize = interpolate(chestCircumference, chestCircumferences, suitSizes);
  const interpolatedHipSize = interpolate(hipWidth, hipWidths, suitSizes);
  const interpolatedWaistSize = interpolate(waistWidth, waistWidths, suitSizes);

  const averageSuitSize = (interpolatedHeightSize + interpolatedChestSize + interpolatedHipSize + interpolatedWaistSize) / 4;

  // Find the nearest existing suit size
  const nearestSuitSize = suitSizes.reduce((prev, curr) =>
    Math.abs(curr - averageSuitSize) < Math.abs(prev - averageSuitSize) ? curr : prev
  );

  document.getElementById('suit-size').textContent = nearestSuitSize || "Keine Anzuggröße";
}



document.getElementById('body-height').addEventListener('input', () => { updateSliderValues(); calculateSuitSize(); });
document.getElementById('chest-circumference').addEventListener('input', () => { updateSliderValues(); calculateSuitSize(); });
document.getElementById('hip-width').addEventListener('input', () => { updateSliderValues(); calculateSuitSize(); });
document.getElementById('waist-width').addEventListener('input', () => { updateSliderValues(); calculateSuitSize(); });

updateSliderValues();
calculateSuitSize();

const swiper = new Swiper('.swiper-container', {
  slidesPerView: 3,
  spaceBetween: 30,
  freeMode: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});
