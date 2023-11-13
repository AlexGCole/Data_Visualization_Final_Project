import './barGraph.js';
import './pieGraph.js';

//URL for Shopping Trends dataset
const csvURL = "https://gist.githubusercontent.com/AlexGCole/8f7f7a222f3b47b9f62196e06e5cec42/raw/shopping_trends.csv";

// Initial visualization with all data
d3.csv(csvURL).then((csvData) => {

  // Assign variables to buttons
  const ageValueLowButton = document.getElementById('ageValueLow');
  const ageValueHighButton = document.getElementById('ageValueHigh');
  const genderSelector = document.getElementById('gender');
  const shippingTypeSelector = document.getElementById('shippingType');
  const frequencyofPurchasesSelector = document.getElementById('frequencyofPurchases');
  const seasonSelector = document.getElementById('season');
  
  // Function to handle the value change event and return the input value
  function handleValueChange(event) {
    const inputValue = parseInt(event.target.value, 10);
    return inputValue;
  }
  
  // Function to filter and append data frames based on the age range
  function filterAndAppendDataFrames() {
    const ageValueLow = handleValueChange({ target: ageValueLowButton });
    const ageValueHigh = handleValueChange({ target: ageValueHighButton });
    const selectedGender = genderSelector.value;
    const selectedShipping = shippingTypeSelector.value;
    const selectedPurchase = frequencyofPurchasesSelector.value;
    const selectedSeason = seasonSelector.value;
  
    // Filter the dataset based on the Age and Gender columns
    let filteredData;

      // If a specific gender is selected, apply age filters along with gender filter
      filteredData = csvData.filter((row) => row.Age >= ageValueLow && row.Age <= ageValueHigh &&
      (selectedGender === 'All' || row.Gender === selectedGender) &&
      (selectedShipping === 'All' || row.ShippingType === selectedShipping) &&
      (selectedPurchase === 'All' || row.FrequencyofPurchases === selectedPurchase) &&
      (selectedSeason === 'All' || row.Season === selectedSeason))
  
    // Log or do something with the filtered data
    updateBarVisualization(filteredData);
    updatePieVizualization(filteredData);
    updatePiePaymentVizualization(filteredData);
  }

  // Add event listeners to the buttons
  ageValueLowButton.addEventListener('input', filterAndAppendDataFrames);
  ageValueHighButton.addEventListener('input', filterAndAppendDataFrames);
  genderSelector.addEventListener('input', filterAndAppendDataFrames);
  shippingType.addEventListener('input', filterAndAppendDataFrames);
  frequencyofPurchases.addEventListener('input', filterAndAppendDataFrames);
  season.addEventListener('input', filterAndAppendDataFrames);

  // Call the function to trigger the initial visualization
  filterAndAppendDataFrames();

});
