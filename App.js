import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [error, setError] = useState(null); 

  const BASE_URL = 'https://api.exchangerate-api.com/v4/latest/'; //Fetching live exchange rates from this website

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (fromCurrency !== toCurrency) {
          const response = await axios.get(`${BASE_URL}${fromCurrency}`);
          setRates(response.data.rates);
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        setError("Error fetching exchange rates. Please try again later.");
      }
    };

    fetchData();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (Object.keys(rates).length > 0) {
      setConvertedAmount((amount * rates[toCurrency]).toFixed(2));
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const handleAmountChange = (e) => {
    const inputAmount = e.target.value;
    // Check if inputAmount is a valid number and not negative
    if (!isNaN(inputAmount) && inputAmount >= 0) {
      setAmount(inputAmount);
      setError(null); // Clear error message when input is valid
    } else {
      // Display error message for invalid input
      setError("Please enter a valid positive number.");
    }
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  return (
    <div className="App">
      <h1>Currency Converter</h1>
      <div className="converter-container">
        <div className="input-group">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="amount-input"
          />
          <select value={fromCurrency} onChange={handleFromCurrencyChange} className="currency-select">
            {Object.keys(rates).length > 0 && Object.keys(rates).map((currency, index) => (
              <option key={index} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <input
            type="text"
            value={convertedAmount}
            readOnly
            className="converted-amount-input"
          />
          <select value={toCurrency} onChange={handleToCurrencyChange} className="currency-select">
            {Object.keys(rates).length > 0 && Object.keys(rates).map((currency, index) => (
              <option key={index} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default App;
