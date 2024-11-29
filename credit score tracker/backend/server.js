const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Starting credit score
let creditScore = 300;

// Sample transaction data (in a real application, this data might come from a database)
let transactions = {
    income: 0,
    expenses: 0,
    debt: 0,
    creditUtilization: 0
};

// Function to calculate the credit score
const calculateCreditScore = () => {
    let score = creditScore;

    // Income: For every $100, increase score by 2 points
    score += (transactions.income / 100) * 2;

    // Expenses: For every $50 spent, reduce score by 1 point
    score -= Math.floor(transactions.expenses / 50);

    // Debt: For every $100 of debt, reduce score by 0.5 points
    score -= (transactions.debt / 100) * 0.5;

    // Credit Utilization: Reduce score for high utilization (>30%)
    if (transactions.creditUtilization > 30) {
        score -= 2; // Deduct for high credit utilization
    } else {
        score += 1; // Increase for responsible credit usage
    }

    // Ensure the score stays within a reasonable range (300 to 850)
    score = Math.max(300, Math.min(score, 850));

    return score;
};

// Route to update transactions and calculate credit score
app.post('/update-transactions', (req, res) => {
    const { income, expenses, debt, creditUtilization } = req.body;

    // Update transactions data from the request body
    transactions.income = income;
    transactions.expenses = expenses;
    transactions.debt = debt;
    transactions.creditUtilization = creditUtilization;

    // Recalculate the credit score based on updated data
    creditScore = calculateCreditScore();

    // Send the updated credit score as a response
    res.json({ creditScore });
});

// Route to get the current credit score (can be used for testing or displaying the score)
app.get('/current-score', (req, res) => {
    res.json({ creditScore });
});

// Set up the server to listen on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
