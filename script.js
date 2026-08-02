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

    document
        .getElementById("add-income-btn")
        .addEventListener("click", addIncomeEntry);

    document
        .getElementById("add-expense-btn")
        .addEventListener("click", addExpenseEntry);

    document
        .getElementById("download-btn")
        .addEventListener("click", downloadPDF);

}


// ==========================================
// Add Income / Expense Rows
// ==========================================

function createEntryRow(defaultLabel) {

    const row = document.createElement("div");
    row.className = "entry-card";

    row.innerHTML = `
        <label>Description</label>
        <input type="text" value="${defaultLabel}">

        <label>Amount</label>
        <input type="number" placeholder="₹0">
    `;

    return row;

}

function addIncomeEntry() {

    document
        .getElementById("income-list")
        .appendChild(createEntryRow("New Income"));

}

function addExpenseEntry() {

    document
        .getElementById("expense-list")
        .appendChild(createEntryRow("New Expense"));

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


function formatCurrencyPlain(amount) {

    return "Rs. " + Number(amount).toLocaleString("en-IN", {

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


function getEntries(containerId) {

    const container = document.getElementById(containerId);

    const rows = container.querySelectorAll(".entry-card");

    const entries = [];

    rows.forEach(row => {

        const desc =
            row.querySelector('input[type="text"]').value.trim() || "-";

        const amount =
            Number(row.querySelector('input[type="number"]').value) || 0;

        entries.push({ desc, amount });

    });

    return entries;

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
// Download PDF
// ==========================================

function downloadPDF() {

    if (!window.jspdf) {

        alert("PDF library did not load. Check your internet connection and try again.");
        return;

    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const businessName =
        document.getElementById("businessName").value.trim() || "Unnamed Business";

    const financialYear =
        document.getElementById("financialYear").value || "-";

    const month =
        document.getElementById("month").value || "-";

    const opening =
        Number(document.getElementById("openingBalance").value) || 0;

    const income = getEntries("income-list");
    const expense = getEntries("expense-list");

    const totalInflow = income.reduce((sum, e) => sum + e.amount, 0);
    const totalOutflow = expense.reduce((sum, e) => sum + e.amount, 0);
    const net = totalInflow - totalOutflow;
    const closing = opening + net;

    let y = 20;

    doc.setFontSize(18);
    doc.text("Cash Flow Report", 14, y);

    y += 10;
    doc.setFontSize(11);
    doc.text(`Business: ${businessName}`, 14, y);

    y += 7;
    doc.text(`Financial Year: ${financialYear}   Month: ${month}`, 14, y);

    y += 7;
    doc.text(`Opening Balance: ${formatCurrencyPlain(opening)}`, 14, y);

    y += 12;
    doc.setFontSize(14);
    doc.text("Cash Inflow", 14, y);
    y += 8;
    doc.setFontSize(11);

    income.forEach(e => {

        doc.text(e.desc, 14, y);
        doc.text(formatCurrencyPlain(e.amount), 150, y);
        y += 7;

        if (y > 270) { doc.addPage(); y = 20; }

    });

    y += 5;
    doc.setFontSize(14);
    doc.text("Cash Outflow", 14, y);
    y += 8;
    doc.setFontSize(11);

    expense.forEach(e => {

        doc.text(e.desc, 14, y);
        doc.text(formatCurrencyPlain(e.amount), 150, y);
        y += 7;

        if (y > 270) { doc.addPage(); y = 20; }

    });

    if (y > 250) { doc.addPage(); y = 20; }

    y += 8;
    doc.setFontSize(14);
    doc.text("Summary", 14, y);
    y += 8;
    doc.setFontSize(11);

    doc.text(`Total Cash Inflow: ${formatCurrencyPlain(totalInflow)}`, 14, y);
    y += 7;
    doc.text(`Total Cash Outflow: ${formatCurrencyPlain(totalOutflow)}`, 14, y);
    y += 7;
    doc.text(`Net Cash Flow: ${formatCurrencyPlain(net)}`, 14, y);
    y += 7;
    doc.text(`Closing Balance: ${formatCurrencyPlain(closing)}`, 14, y);

    const safeName = businessName.replace(/[^a-z0-9]/gi, "_");

    doc.save(`CashFlow_${safeName}_${month}.pdf`);

}


// ==========================================
// Reset
// ==========================================

function resetPlanner() {

    if (!confirm("Reset all values?")) return;

    location.reload();

}
