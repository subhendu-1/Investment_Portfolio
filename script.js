// script.js

let investments = [];
let totalPortfolioValue = 0;

// Get elements
const addNewInvestmentBtn = document.getElementById('add-new-investment-btn');
const addNewInvestmentForm = document.getElementById('add-new-investment-form');
const updateInvestmentForm = document.getElementById('update-investment-form');
const investmentList = document.getElementById('investment-list');
const pieChartContainer = document.getElementById('pie-chart');
const totalPortfolioValueElement = document.getElementById('total-portfolio-value');

// Add event listeners
addNewInvestmentBtn.addEventListener('click', showAddNewInvestmentForm);
addNewInvestmentForm.addEventListener('submit', addNewInvestment);
investmentList.addEventListener('click', handleInvestmentListClick);

// Functions
function showAddNewInvestmentForm() {
  addNewInvestmentForm.classList.add('show');
}

function addNewInvestment(event) {
  event.preventDefault();
  const assetName = document.getElementById('asset-name').value;
  const amountInvested = parseFloat(document.getElementById('amount-invested').value);
  const currentValue = parseFloat(document.getElementById('current-value').value);

  const newInvestment = {
    assetName,
    amountInvested,
    currentValue,
    percentageChange: calculatePercentageChange(amountInvested, currentValue)
  };

  investments.push(newInvestment);
  updateInvestmentList();
  updateTotalPortfolioValue();
  addNewInvestmentForm.classList.remove('show');
}

function calculatePercentageChange(amountInvested, currentValue) {
  return ((currentValue - amountInvested) / amountInvested) * 100;
}

function updateInvestmentList() {
  investmentList.innerHTML = '';
  investments.forEach((investment, index) => {
    const investmentHTML = `
      <li>
        <span>${investment.assetName}</span>
        <span>$${investment.amountInvested.toLocaleString()}</span>
        <span>$${investment.currentValue.toLocaleString()}</span>
        <span>${investment.percentageChange.toFixed(2)}%</span>
        <button class="update-btn" data-index="${index}">Update</button>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </li>
    `;
    investmentList.innerHTML += investmentHTML;
  });
}

function updateTotalPortfolioValue() {
  totalPortfolioValue = investments.reduce((acc, investment) => acc + investment.currentValue, 0);
  totalPortfolioValueElement.textContent = `$${totalPortfolioValue.toLocaleString()}`;
}

function handleInvestmentListClick(event) {
  if (event.target.classList.contains('update-btn')) {
    const index = event.target.dataset.index;
    showUpdateInvestmentForm(index);
  } else if (event.target.classList.contains('remove-btn')) {
    const index = event.target.dataset.index;
    removeInvestment(index);
  }
}

function showUpdateInvestmentForm(index) {
  const investment = investments[index];
  updateInvestmentForm.classList.add('show');
  document.getElementById('asset-name').value = investment.assetName;
  document.getElementById('amount-invested').value = investment.amountInvested;
  document.getElementById('current-value').value = investment.currentValue;
  updateInvestmentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    updateInvestment(index);
  });
}

function updateInvestment(index) {
  const currentValue = parseFloat(document.getElementById('current-value').value);
  investments[index].currentValue = currentValue;
  investments[index].percentageChange = calculatePercentageChange(investments[index].amountInvested, currentValue);
  updateInvestmentList();
  updateTotalPortfolioValue();
  updateInvestmentForm.classList.remove('show');
}

function removeInvestment(index) {
  investments.splice(index, 1);
  updateInvestmentList();
  updateTotalPortfolioValue();
}

// Initialize pie chart
const pieChart = new Chart(pieChartContainer, {
  type: 'pie',
  data: {
    labels: investments.map((investment) => investment.assetName),
    datasets: [{
      data: investments.map((investment) => investment.currentValue),
      backgroundColor: ['#ff69b4', '#33cc33', '#6666ff', '#ffcc00']
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Asset Distribution'
    }
  }
});

// Update pie chart when investments change
function updatePieChart() {
  pieChart.data.labels = investments.map((investment) => investment.assetName);
  pieChart.data.datasets[0].data = investments.map((investment) => investment.currentValue);
  pieChart.update();
}

updatePieChart();

// Local storage
function saveToLocalStorage() {
  localStorage.setItem('investments', JSON.stringify(investments));
}

function loadFromLocalStorage() {
  const storedInvestments = localStorage.getItem('investments');
  if (storedInvestments) {
    investments = JSON.parse(storedInvestments);
    updateInvestmentList

    updateInvestmentList();
    updateTotalPortfolioValue();
    updatePieChart();
  }
}

// Load investments from local storage
loadFromLocalStorage();

// Save investments to local storage when the page is closed
window.addEventListener('beforeunload', saveToLocalStorage);
