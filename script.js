// ======================================
// SME Finance Toolkit
// Cash Flow Planner
// Version 1.0
// ======================================

console.log("SME Finance Toolkit Loaded Successfully");

// ===========================
// Get Buttons
// ===========================

const calculateBtn = document.getElementById("calculate-btn");
const resetBtn = document.getElementById("reset-btn");

// ===========================
// Summary Fields
// ===========================

const totalInflow = document.getElementById("totalInflow");
const totalOutflow = document.getElementById("totalOutflow");
const netCashFlow = document.getElementById("netCashFlow");
const closingBalance = document.getElementById("closingBalance");

// ===========================
// Opening Balance
// ===========================

const openingBalance = document.getElementById("openingBalance");

// ===========================
// Calculate Button
// ===========================

calculateBtn.addEventListener("click", calculateCashFlow);

// ===========================
// Reset Button
// ===========================

resetBtn.addEventListener("click", function () {

    alert("Reset function coming soon.");

});

// ===========================
// Main Function
// ===========================

function calculateCashFlow() {

    // Opening Balance
    const opening = Number(openingBalance.value) || 0;

    // Cash Inflow
    const sales = Number(document.getElementById("salesAmount").value) || 0;

    const collection = Number(document.getElementById("collectionAmount").value) || 0;

    const otherIncome = Number(document.getElementById("otherIncomeAmount").value) || 0;

    // Total Inflow
    const inflow = sales + collection + otherIncome;

    // Display Result
    totalInflow.textContent = "₹" + inflow;

}
