# To run:

- python app.py

This will start a simple Flask server.

Then, you need to start the front-end:

- npm install
- npm run dev

# TO-DO

- [x] Implement buy/sell logic. eg. RSI 30/70
- [x] Show possible profit/loss with each indicator
- [ ] Display stock info per stock

```{python}
    # Preparing the data for frontend
    data = {
        "history": history.to_dict(),
        "open": history['Open'].iloc[-1],
        "volume": history['Volume'].iloc[-1],
        "high": history['High'].iloc[-1],
        "low": history['Low'].iloc[-1],
        "avgVolume": info.get("averageVolume"),
        "marketCap": info.get("marketCap"),
        "week52High": info.get("fiftyTwoWeekHigh"),
        "week52Low": info.get("fiftyTwoWeekLow"),
        "peRatio": info.get("trailingPE"),
        "dividendYield": info.get("dividendYield"),
    }
```

- [ ] Find/add all stocks from NASDAQ
- [ ] Add other indicators
- [ ] Interval within period might be set
- [ ] Customized indicators for paid users
- [ ] Allow users to select indicator periods

# Current Status
