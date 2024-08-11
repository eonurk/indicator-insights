from flask import Flask, jsonify, request
import yfinance as yf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mapping user selection to yfinance's period and interval
period_interval_map = {
    "1d": ("1d", "1m"),
    "1w": ("5d", "5m"),
    "1m": ("1mo", "1h"),
    "3m": ("3mo", "1d"),
    "ytd": ("ytd", "1d"),
    "1y": ("1y", "1d"),
    "all": ("max", "1mo")
}

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    try:
        # Get the user-specified period from the query string
        period_key = request.args.get('period', '1m')  # Default to '1m' if not provided

        if period_key not in period_interval_map:
            return jsonify({"error": "Invalid period specified"}), 400

        period, interval = period_interval_map[period_key]

        stock = yf.Ticker(symbol)
        hist = stock.history(period=period, interval=interval)
        
        # Convert the DataFrame index (Timestamps) to strings
        hist.index = hist.index.strftime('%Y-%m-%d %H:%M:%S')

        data = {
            "symbol": symbol,
            "history": hist.to_dict(orient="index")
        }
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
