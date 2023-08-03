import measurementData from './data.js';

function updateSliderValues() {
  const selectedCategory = document.getElementById('selected-category').textContent;
  const categoryData = measurementData[selectedCategory];
  
  for (const key of Object.keys(categoryData)) {
    if (key !== "Sizes") { // Exclude the "Sizes" key
      document.getElementById(`${key}-value`).textContent = document.getElementById(key).value;
    }
  }
}

function interpolate(value, values, sizes) {
  const closestIndex = values.findIndex(v => v >= value);
  const closestValue = values[closestIndex];
  const nextClosestValue = values[closestIndex + 1] || closestValue;
  const weight = (value - closestValue) / (nextClosestValue - closestValue);
  return sizes[closestIndex] * (1 - weight) + sizes[closestIndex + 1] * weight;
}

function calculateSize() {
  const selectedCategory = document.getElementById('selected-category').textContent;
  const categoryData = measurementData[selectedCategory];

  const sizes = categoryData["Sizes"]["values"];
  const interpolatedSizes = [];
  for (const [key, value] of Object.entries(categoryData)) {
    if (key !== "Sizes") { // Exclude the "Sizes" key
      const inputValue = parseInt(document.getElementById(key).value);
      interpolatedSizes.push(interpolate(inputValue, value.values, sizes));
    }
  }

  const averageSize = interpolatedSizes.reduce((sum, size) => sum + size, 0) / interpolatedSizes.length;

  // Find the nearest existing size
  const nearestSize = sizes.reduce((prev, curr) =>
    Math.abs(curr - averageSize) < Math.abs(prev - averageSize) ? curr : prev
  );

  document.getElementById('size').textContent = nearestSize || "Keine Größe";
}

function selectCategory(category) {
  const categoryData = measurementData[category];
  if (!categoryData) return;

  // Update the selected category and headline
  document.getElementById('selected-category').textContent = category;
  document.getElementById('category-headline').textContent = `Finden Sie Ihre perfekte ${category}-Größe:`;

  // Get the container for the sliders
  const slidersContainer = document.getElementById('sliders-container');
  slidersContainer.innerHTML = ''; // Clear existing sliders

  // Iterate through the category data and create sliders
  for (const [key, value] of Object.entries(categoryData)) {
    if (key !== "Sizes") { // Exclude the "Sizes" key
      const sliderDiv = document.createElement('div');
      sliderDiv.className = 'slider-container form-group'; // Added form-group class

      const label = document.createElement('label');
      label.htmlFor = key;
      label.id = `${key}-label`;
      label.innerHTML = `${key} (${value.unit}): <span id="${key}-value">${value.values[0]}</span>`;
      sliderDiv.appendChild(label);

      const input = document.createElement('input');
      input.type = 'range';
      input.id = key;
      input.className = 'custom-range'; // Added custom-range class
      input.min = Math.min(...value.values);
      input.max = Math.max(...value.values);
      input.step = '1';
      input.value = value.values[0];
      input.addEventListener('input', () => { updateSliderValues(); calculateSize(); });
      sliderDiv.appendChild(input);

      slidersContainer.appendChild(sliderDiv);
    }
  }

  updateSliderValues();
  calculateSize();
}

// Event listeners for sliders are now added dynamically
document.getElementById('anzuege-slide').addEventListener('click', () => selectCategory('Anzüge'));
document.getElementById('jacken-slide').addEventListener('click', () => selectCategory('Jacken'));

// Add more event listeners for other categories

// Set default category
selectCategory('Anzüge');

const swiper = new Swiper('.swiper-container', {
  slidesPerView: 3,
  spaceBetween: 30,
  freeMode: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});
