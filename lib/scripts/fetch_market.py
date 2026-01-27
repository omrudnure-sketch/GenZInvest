import json
import sys
import yfinance as yf

def fetch_data():
    try:
        # Fetch Real-time Data using Yahoo Finance
        # ^NSEI = Nifty 50, ^NSEBANK = Nifty Bank, ^BSESN = Sensex
        tickers = {
            "NIFTY 50": "^NSEI",
            "SENSEX": "^BSESN",
            "BANK NIFTY": "^NSEBANK"
        }
        
        indices_data = []
        
        for name, ticker_symbol in tickers.items():
            try:
                ticker = yf.Ticker(ticker_symbol)
                
                # 1. Try to get data from ticker.info (Most reliable for Real-time/Delayed)
                info = ticker.info
                
                # Get Current Price
                current_price = info.get('currentPrice') or info.get('regularMarketPrice')
                
                # Get Previous Close
                prev_close = info.get('previousClose') or info.get('regularMarketPreviousClose')
                
                # 2. Fallback to history if info is missing crucial data
                if current_price is None or prev_close is None:
                     hist = ticker.history(period="5d")
                     if not hist.empty:
                          current_price = hist['Close'].iloc[-1]
                          # If only 1 row, we can't calc change from history alone, 
                          # but we might have grabbed prev_close from info even if current_price was missing (unlikely)
                          # So we default prev_close to current_price (0% change) if still missing.
                          if prev_close is None:
                               prev_close = hist['Close'].iloc[-2] if len(hist) > 1 else current_price
                
                # 3. Calculate Change
                if current_price is not None and prev_close is not None and prev_close != 0:
                    price = float(current_price)
                    prev = float(prev_close)
                    
                    change_val = price - prev
                    change_pct = (change_val / prev) * 100
                    
                    sign = "+" if change_pct >= 0 else ""
                    change_str = f"{sign}{change_pct:.2f}%"
                    
                    indices_data.append({
                        "name": name,
                        "value": round(price, 2),
                        "change": change_str
                    })
                else:
                    # Data unavailable
                     indices_data.append({
                         "name": name,
                         "value": 0.00,
                         "change": "N/A"
                     })

            except Exception as e:
                 # print(f"Error fetching {name}: {e}", file=sys.stderr)
                 indices_data.append({
                     "name": name,
                     "value": 0.00,
                     "change": "Error"
                 })

        # Check if we got valid data
        if not indices_data:
             raise Exception("No data collected")

        data = {
            "indices": indices_data,
            "status": "success",
            "source": "Yahoo Finance (Real-time)"
        }
        
        print(json.dumps(data))

    except Exception as e:
        # If API fails, return error instead of fake data
        error_response = {
            "status": "error",
            "message": f"Failed to fetch market data: {str(e)}",
            "indices": []
        }
        print(json.dumps(error_response))

if __name__ == "__main__":
    fetch_data()
