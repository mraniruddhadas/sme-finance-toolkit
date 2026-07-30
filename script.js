/* ==========================================
   SME Finance Toolkit
   Cash Flow Planner v1.0
   Part 1 - Foundation & Setup
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});


// ==========================================
// Initialize Application
// ==========================================

function initializeApp() {

    setFinancialYear();

    setCurrentMonth();

    registerEvents();

}


// ==========================================
// Register Events
// ==========================================

function registerEvents() {

    document
        .getElementById("calculate-btn")
        .addEventListener("click", calculateCashFlow);

    document
        .getElementById("reset-btn")
        .addEventListener("click", resetPlanner);

    document
        .getElementById("print-btn")
        .addEventListener("click", () => window.print());

}


// ==========================================
// Financial Year
// ==========================================

function setFinancialYear() {

    const today = new Date();

    let year = today.getFullYear();

    let fy;

    if (today.getMonth() >= 3) {

        fy = year + "-" + String(year + 1).slice(-2);

    } else {

        fy = (year - 1) + "-" + String(year).slice(-2);

    }

    document.getElementById("financialYear").value = fy;

}


// ==========================================
// Current Month
// ==========================================

function setCurrentMonth() {

    const months = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];

    document.getElementById("month").value =
        months[new Date().getMonth()];

}


// ==========================================
// Currency Formatter
// ==========================================

function formatCurrency(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN", {

        minimumFractionDigits: 2,
        maximumFractionDigits: 2

    });

}


// ==========================================
// Read Amount Inputs
// ==========================================

function getAmounts(containerId) {

    const container = document.getElementById(containerId);

    const inputs =
        container.querySelectorAll('input[type="number"]');

    let total = 0;

    inputs.forEach(input => {

        total += Number(input.value) || 0;

    });

    return total;

}


// ==========================================
// Update Summary
// ==========================================

function updateSummary(inflow, outflow, opening) {

    const net = inflow - outflow;

    const closing = opening + net;

    document.getElementById("totalInflow").textContent =
        formatCurrency(inflow);

    document.getElementById("totalOutflow").textContent =
        formatCurrency(outflow);

    document.getElementById("netCashFlow").textContent =
        formatCurrency(net);

    document.getElementById("closingBalance").textContent =
        formatCurrency(closing);

}


// ==========================================
// Placeholder
// ==========================================

// ==========================================
// Cash Flow Calculation Engine
// ==========================================

function calculateCashFlow() {

    // Opening Balance
    const opening =
        Number(document.getElementById("openingBalance").value) || 0;

    // Calculate Totals
    const inflow = getAmounts("income-list");
    const outflow = getAmounts("expense-list");

    // Update Summary
    updateSummary(inflow, outflow, opening);

    // Net & Closing
    const net = inflow - outflow;
    const closing = opening + net;

    // Health Elements
    const healthStatus =
        document.getElementById("healthStatus");

    const healthAdvice =
        document.getElementById("healthAdvice");

    // ==========================
    // Business Health Logic
    // ==========================

    if (closing < 0) {

        healthStatus.textContent =
            "🔴 Critical";

        healthAdvice.textContent =
            "Your business may face a cash shortage. Reduce expenses, improve collections and avoid unnecessary spending.";

    }

    else if (closing < opening) {

        healthStatus.textContent =
            "🟡 Moderate";

        healthAdvice.textContent =
            "Cash flow is positive but weaker than your opening balance. Monitor expenses carefully.";

    }

    else {

        healthStatus.textContent =
            "🟢 Healthy";

        healthAdvice.textContent =
            "Excellent! Your business is generating positive cash flow. Continue maintaining this performance.";

    }

    // ==========================
    // Console Log
    // ==========================

    console.log({

        OpeningBalance: opening,

        TotalInflow: inflow,

        TotalOutflow: outflow,

        NetCashFlow: net,

        ClosingBalance: closing

    });

}


// ==========================================
// Reset
// ==========================================

function resetPlanner() {

    if (!confirm("Reset all values?")) return;

    location.reload();

}
