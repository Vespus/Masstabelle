import measurementData from './data.js';

function updateSliderValues() {
  const selectedCategory = document.getElementById('selected-category').textContent;
  if (selectedCategory === 'Schuhe') return; // Skip for "Schuhe" category

  const categoryData = measurementData[selectedCategory];
  for (const key of Object.keys(categoryData)) {
    if (key !== "Sizes" && !categoryData[key].isResult) {
      const element = document.getElementById(key);
      if (element) {
        document.getElementById(`${key}-value`).textContent = element.value;
      }
    }
  }
}


function calculateSize() {
  const selectedCategory = document.getElementById('selected-category').textContent;
  const categoryData = measurementData[selectedCategory];

  if (selectedCategory === 'Schuhe') {
    const selectedSizeIndex = document.getElementById('Dt. Größe').value - 1; // 0-based index
    const dtSize = categoryData["Dt. Größe"].values[selectedSizeIndex];
    const usSize = categoryData["US-Größe"].values[selectedSizeIndex];
    const footLength = categoryData["Fußlänge"].values[selectedSizeIndex];
    document.getElementById('size').innerHTML = `Dt. Größe: ${dtSize}<br>US-Größe: ${usSize}<br>Fußlänge: ${footLength} cm`;
    return;
  }

  const sizes = categoryData["Sizes"]["values"];
  const interpolatedSizes = [];
  for (const [key, value] of Object.entries(categoryData)) {
    if (key !== "Sizes" && !value.isResult) {
      const inputValue = parseInt(document.getElementById(key).value);
      interpolatedSizes.push(interpolate(inputValue, value.values, sizes));
    }
  }

  const averageSize = interpolatedSizes.reduce((sum, size) => sum + size, 0) / interpolatedSizes.length;

  const nearestSize = sizes.reduce((prev, curr) =>
    Math.abs(curr - averageSize) < Math.abs(prev - averageSize) ? curr : prev
  );

  // Set the size result
  document.getElementById('size').textContent = nearestSize || "Keine Größe";

  // Handle the special case for Jeans Width/Length
  if (selectedCategory === 'Jeans') {
    const jeansWidthLengthData = categoryData["Jeans Width/Length"]["values"];
    const nearestJeansWidthLength = jeansWidthLengthData[sizes.indexOf(nearestSize)];

    // Display the Jeans Width/Length result
    document.getElementById('size').innerHTML += `<br><font size="4">(In inch: ${nearestJeansWidthLength})`;
  }
}

function selectCategory(category) {
  // Clear previous selection
  const allSlides = document.querySelectorAll('.swiper-slide');
  allSlides.forEach(slide => slide.classList.remove('swiper-slide-selected'));

  const categoryData = measurementData[category];
  if (!categoryData) return;

  // Update the selected category and headline
  document.getElementById('selected-category').textContent = category;
  document.getElementById('category-headline').textContent = `Finden Sie Ihre perfekte ${category}-Größe:`;

  // Get the container for the sliders
  const slidersContainer = document.getElementById('sliders-container');
  slidersContainer.innerHTML = ''; // Clear existing sliders

  if (category === 'Schuhe') {
    // Special handling for "Schuhe" category
    const sliderDiv = document.createElement('div');
    sliderDiv.className = 'slider-container form-group';
  
    const input = document.createElement('input');
    input.type = 'range';
    input.id = 'Dt. Größe';
    input.className = 'custom-range';
    input.min = 1; // Minimum value
    input.max = 19; // Maximum value
    input.step = '1'; // Step value
    input.value = 10; // Initial value, positioned in the center
    input.addEventListener('input', () => { calculateSize(); });
    sliderDiv.appendChild(input);
  
    slidersContainer.appendChild(sliderDiv);
    updateSliderValues();
    calculateSize();
  } else {
    for (const [key, value] of Object.entries(categoryData)) {
      // Exclude the "Sizes" key and values marked as results
      if (key !== "Sizes" && !value.isResult) {
        const sliderDiv = document.createElement('div');
        sliderDiv.className = 'slider-container form-group';

        const label = document.createElement('label');
        label.htmlFor = key;
        label.id = `${key}-label`;
        label.innerHTML = `${key} (${value.unit}): <span id="${key}-value">${value.values[0]}</span>`;
        sliderDiv.appendChild(label);

        const input = document.createElement('input');
        input.type = 'range';
        input.id = key;
        input.className = 'custom-range';
        input.min = Math.min(...value.values);
        input.max = Math.max(...value.values);
        input.step = '1';
        input.value = value.values[0];
        input.addEventListener('input', () => { updateSliderValues(); calculateSize(); });
        sliderDiv.appendChild(input);

        slidersContainer.appendChild(sliderDiv);
      }
    }
console.log("Updating slider values for Schuhe...");
updateSliderValues();
console.log("Calculating size for Schuhe...");
calculateSize();

  }

  // Convert category to ID by lowercasing and replacing special characters
  const categoryId = category.toLowerCase().replace('ü', 'ue') + '-slide';

  // Mark the selected category
  document.getElementById(categoryId).classList.add('swiper-slide-selected');
}

function interpolate(value, values, sizes) {
  const closestIndex = values.findIndex(v => v >= value);
  const closestValue = values[closestIndex];
  const nextClosestValue = values[closestIndex + 1] || closestValue;
  const weight = (value - closestValue) / (nextClosestValue - closestValue);
  return sizes[closestIndex] * (1 - weight) + sizes[closestIndex + 1] * weight;
}

document.getElementById('jeans-slide').addEventListener('click', () => selectCategory('Jeans'));
document.getElementById('anzuege-slide').addEventListener('click', () => selectCategory('Anzüge'));
document.getElementById('jacken-slide').addEventListener('click', () => selectCategory('Jacken'));
document.getElementById('schuhe-slide').addEventListener('click', () => selectCategory('Schuhe')); // Add event listener for "Schuhe"

selectCategory('Anzüge');

const swiper = new Swiper('.swiper-container', {
  slidesPerView: 2.5,
  spaceBetween: 10,
  freeMode: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});
