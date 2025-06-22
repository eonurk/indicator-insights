import yfinance as yf
import pandas as pd

print("Testing yfinance version:", yf.__version__)

print("\n--- Single Ticker Basic Info ---")
try:
    dat = yf.Ticker("MSFT")
    print("Successfully created ticker object")
except Exception as e:
    print(f"Error creating ticker: {e}")

print("\n--- Ticker Info ---")
try:
    info = dat.info
    print(f"Info available: {list(info.keys())[:5]}...")
except Exception as e:
    print(f"Error getting info: {e}")

print("\n--- Calendar ---")
try:
    cal = dat.calendar
    print("Calendar available:", cal is not None)
except Exception as e:
    print(f"Error getting calendar: {e}")

print("\n--- Analyst Price Targets ---")
try:
    targets = dat.analyst_price_targets
    print("Price targets available:", not targets.empty if hasattr(targets, 'empty') else targets is not None)
except Exception as e:
    print(f"Error getting price targets: {e}")

print("\n--- Quarterly Income Statement ---")
try:
    income = dat.quarterly_income_stmt
    print("Income statement available:", not income.empty if hasattr(income, 'empty') else income is not None)
except Exception as e:
    print(f"Error getting income statement: {e}")

print("\n--- History ---")
try:
    hist = dat.history(period='1mo')
    print("History available:", not hist.empty)
    print(f"History shape: {hist.shape}")
except Exception as e:
    print(f"Error getting history: {e}")

print("\n--- Option Chain ---")
try:
    options = dat.options
    if options:
        chain = dat.option_chain(options[0])
        print("Option chain available:", not chain.calls.empty)
    else:
        print("No options available")
except Exception as e:
    print(f"Error getting options: {e}")

print("\n--- Multiple Tickers ---")
try:
    tickers = yf.Tickers('MSFT AAPL GOOG')
    print("Successfully created multiple ticker objects")
    print("MSFT info available:", bool(tickers.tickers['MSFT'].info))
except Exception as e:
    print(f"Error with multiple tickers: {e}")

print("\n--- Download ---")
try:
    data = yf.download(['MSFT', 'AAPL', 'GOOG'], period='1mo')
    print("Download available:", not data.empty)
    print(f"Download shape: {data.shape}")
except Exception as e:
    print(f"Error downloading: {e}")

print("\n--- Funds Data ---")
try:
    spy = yf.Ticker('SPY').funds_data
    print("Funds data available:", spy is not None)
    if spy:
        print("Description available:", bool(spy.description))
        print("Top holdings available:", bool(spy.top_holdings))
except Exception as e:
    print(f"Error getting funds data: {e}")

def test_stock(symbol, period, interval):
    print(f"Testing {symbol} with period={period}, interval={interval}")
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval)
        if hist.empty:
            print(f"No data returned for {symbol}")
        else:
            print(f"Successfully fetched data for {symbol}")
            print(f"Data shape: {hist.shape}")
            print(f"Date range: {hist.index[0]} to {hist.index[-1]}")
        return hist
    except Exception as e:
        print(f"Error fetching {symbol}: {str(e)}")
        return None

# Test different period/interval combinations
test_stock("AAPL", "1d", "1m")
test_stock("AAPL", "5d", "5m")
test_stock("AAPL", "1mo", "1h")
test_stock("AAPL", "3mo", "1d")
test_stock("AAPL", "max", "1mo")

# Test common stock with the problematic settings
test_stock("AAPL", "1mo", "1h")  # This is your default '1m' setting

# Try a different stock with the same settings
test_stock("MSFT", "1mo", "1h")