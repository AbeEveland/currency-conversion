import React, { useState, useEffect } from 'react'
//import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import CurrencyRow from './CurrencyRow'

//const currencyApi = 'https://api.exchangeratesapi.io/latest?base=USD'
const currencyApi = 'https://api.ratesapi.io/api/latest'

//GET https://api.exchangeratesapi.io/latest?base=USD HTTP/1.1

function App() {
  const [currency, setCurrency] = useState([])
  const [fromCurrency, setFromCurrency] = useState([])
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }
  useEffect(() => {
    fetch(currencyApi)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0]
        const usd = Object.keys(data.rates)[29]

        setCurrency([data.base, ...Object.keys(data.rates)])
        setFromCurrency(usd)
        setToCurrency(firstCurrency)
        setExchangeRate(data.rates[firstCurrency])
      })
  }, [])
  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${currencyApi}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(event) {
    setAmount(event.target.value)
    setAmountInFromCurrency(true)
  }
  function handleToAmountChange(event) {
    setAmount(event.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <h1>Convert </h1>
      <CurrencyRow
        currency={currency}
        selectedCurrency={fromCurrency}
        onChangeCurrency={event => setFromCurrency(event.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />

      <div className="equals">=</div>
      <CurrencyRow
        currency={currency}
        selectedCurrency={toCurrency}
        onChangeCurrency={event => setToCurrency(event.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  )
}

export default App
