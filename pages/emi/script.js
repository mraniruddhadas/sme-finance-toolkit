document.getElementById('calculateBtn').addEventListener('click', calculateEMI);

function calculateEMI() {
    const loan = parseFloat(document.getElementById('loan').value);
    const annualRate = parseFloat(document.getElementById('rate').value);
    const tenureInput = parseFloat(document.getElementById('tenure').value);
    const unit = document.getElementById('unit').value;

    if (isNaN(loan) || loan <= 0) {
        showError('Loan amount must be a number greater than 0.');
        return;
    }
    if (isNaN(annualRate) || annualRate < 0) {
        showError('Interest rate must be 0 or greater.');
        return;
    }
    if (isNaN(tenureInput) || tenureInput <= 0) {
        showError('Loan tenure must be a number greater than 0.');
        return;
    }

    const months = unit === 'years' ? tenureInput * 12 : tenureInput;
    const monthlyRate = annualRate / 12 / 100;

    let emi;
    if (monthlyRate === 0) {
        // 0% interest: avoid division by zero in the standard formula
        emi = loan / months;
    } else {
        const factor = Math.pow(1 + monthlyRate, months);
        emi = (loan * monthlyRate * factor) / (factor - 1);
    }

    const totalPayment = emi * months;
    const totalInterest = totalPayment - loan;

    showResult(emi, totalInterest, totalPayment);
}

function showError(message) {
    const box = document.getElementById('result');
    box.innerHTML = `<p class="error">${message}</p>`;
    box.classList.remove('hidden');
}

function showResult(emi, totalInterest, totalPayment) {
    const box = document.getElementById('result');
    box.innerHTML = `
        <h3>Result</h3>
        <div class="result-row"><span>Monthly EMI</span><strong>₹${formatNumber(emi)}</strong></div>
        <div class="result-row"><span>Total Interest</span><strong>₹${formatNumber(totalInterest)}</strong></div>
        <div class="result-row"><span>Total Payment</span><strong>₹${formatNumber(totalPayment)}</strong></div>
    `;
    box.classList.remove('hidden');
}

function formatNumber(num) {
    return num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

