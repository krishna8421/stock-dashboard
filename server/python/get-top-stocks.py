import json
from pandas_datareader import data as pdr
from yahoo_fin import stock_info as si
import yfinance as yf
import pandas as pd
import datetime
import time
import os

if(os.path.isdir('data')):
    pass
else:
    os.mkdir('data')

yf.pdr_override()

url = "./ind_nifty100list.csv"

tickers = [
  "ACC.NS",
  "ADANIENT.NS",
  "ADANIGREEN.NS",
  "ADANIPORTS.NS",
  "ATGL.NS",
  "ADANITRANS.NS",
  "AMBUJACEM.NS",
  "APOLLOHOSP.NS",
  "ASIANPAINT.NS",
  "DMART.NS",
  "AXISBANK.NS",
  "BAJAJ-AUTO.NS",
  "BAJFINANCE.NS",
  "BAJAJFINSV.NS",
  "BAJAJHLDNG.NS",
  "BANDHANBNK.NS",
  "BANKBARODA.NS",
  "BERGEPAINT.NS",
  "BEL.NS",
  "BPCL.NS",
  "BHARTIARTL.NS",
  "BIOCON.NS",
  "BOSCHLTD.NS",
  "BRITANNIA.NS",
  "CHOLAFIN.NS",
  "CIPLA.NS",
  "COALINDIA.NS",
  "COLPAL.NS",
  "DLF.NS",
  "DABUR.NS",
  "DIVISLAB.NS",
  "DRREDDY.NS",
  "EICHERMOT.NS",
  "NYKAA.NS",
  "GAIL.NS",
  "GLAND.NS",
  "GODREJCP.NS",
  "GRASIM.NS",
  "HCLTECH.NS",
  "HDFCAMC.NS",
  "HDFCBANK.NS",
  "HDFCLIFE.NS",
  "HAVELLS.NS",
  "HEROMOTOCO.NS",
  "HINDALCO.NS",
  "HAL.NS",
  "HINDUNILVR.NS",
  "HDFC.NS",
  "ICICIBANK.NS",
  "ICICIGI.NS",
  "ICICIPRULI.NS",
  "ITC.NS",
  "IOC.NS",
  "IRCTC.NS",
  "INDUSTOWER.NS",
  "INDUSINDBK.NS",
  "NAUKRI.NS",
  "INFY.NS",
  "INDIGO.NS",
  "JSWSTEEL.NS",
  "KOTAKBANK.NS",
  "LTIM.NS",
  "LT.NS",
  "LICI.NS",
  "M&M.NS",
  "MARICO.NS",
  "MARUTI.NS",
  "MPHASIS.NS",
  "MUTHOOTFIN.NS",
  "NTPC.NS",
  "NESTLEIND.NS",
  "ONGC.NS",
  "PAYTM.NS",
  "PIIND.NS",
  "PIDILITIND.NS",
  "POWERGRID.NS",
  "PGHH.NS",
  "RELIANCE.NS",
  "SBICARD.NS",
  "SBILIFE.NS",
  "SRF.NS",
  "MOTHERSON.NS",
  "SHREECEM.NS",
  "SIEMENS.NS",
  "SBIN.NS",
  "SUNPHARMA.NS",
  "TCS.NS",
  "TATACONSUM.NS",
  "TATAMOTORS.NS",
  "TATAPOWER.NS",
  "TATASTEEL.NS",
  "TECHM.NS",
  "TITAN.NS",
  "TORNTPHARM.NS",
  "UPL.NS",
  "ULTRACEMCO.NS",
  "MCDOWELL-N.NS",
  "VEDL.NS",
  "WIPRO.NS",
  "ZOMATO.NS"
]

# tickers.remove('MM.NS')

index_name = '^NSEI'
start_date = datetime.datetime.now() - datetime.timedelta(days=365)
end_date = datetime.date.today()
exportList = pd.DataFrame(columns=['Stock', "RS_Rating", "50 Day MA", "150 Day Ma", "200 Day MA", "52 Week Low", "52 week High"])
returns_multiples = []

index_df = pdr.get_data_yahoo(index_name, start_date, end_date)
index_df['Percent Change'] = index_df['Adj Close'].pct_change()
index_return = (index_df['Percent Change'] + 1).cumprod()[-1]


for ticker in tickers:
    df = pdr.get_data_yahoo(ticker, start_date, end_date)
    if(os.path.isfile(f'data/{ticker}.csv')):
        os.remove(f'data/{ticker}.csv')
        print(f'{ticker}.csv  is removed')
    df.to_csv(f'data/{ticker}.csv')

    
    df['Percent Change'] = df['Adj Close'].pct_change()
    stock_return = (df['Percent Change'] + 1).cumprod()[-1]
    
    returns_multiple = round((stock_return / index_return), 2)
    returns_multiples.extend([returns_multiple])
    
    print (f'Ticker: {ticker}; Returns Multiple against NIFTY 50: {returns_multiple}\n')
    time.sleep(1)

# Creating dataFrame of only top 30%
rs_df = pd.DataFrame(list(zip(tickers, returns_multiples)), columns=['Ticker', 'Returns_multiple'])
rs_df['RS_Rating'] = rs_df.Returns_multiple.rank(pct=True) * 100
rs_df = rs_df[rs_df.RS_Rating >= rs_df.RS_Rating.quantile(.70)]

# Checking Minervini conditions of top 30% of stocks in given list
rs_stocks = rs_df['Ticker']

topStocks = []

for stock in rs_stocks:    
    try:
        df = pd.read_csv(f'data/{stock}.csv', index_col=0)
        sma = [50, 150, 200]
        for x in sma:
            df["SMA_"+str(x)] = round(df['Adj Close'].rolling(window=x).mean(), 2)
        
        # Storing required values 
        currentClose = df["Adj Close"][-1]
        moving_average_50 = df["SMA_50"][-1]
        moving_average_150 = df["SMA_150"][-1]
        moving_average_200 = df["SMA_200"][-1]
        low_of_52week = round(min(df["Low"][-260:]), 2)
        high_of_52week = round(max(df["High"][-260:]), 2)
        RS_Rating = round(rs_df[rs_df['Ticker']==stock].RS_Rating.tolist()[0])
        
        try:
            moving_average_200_20 = df["SMA_200"][-20]
        except Exception:
            moving_average_200_20 = 0

        # Condition 1: Current Price > 150 SMA and > 200 SMA
        condition_1 = currentClose > moving_average_150 > moving_average_200
        
        # Condition 2: 150 SMA and > 200 SMA
        condition_2 = moving_average_150 > moving_average_200

        # Condition 3: 200 SMA trending up for at least 1 month
        condition_3 = moving_average_200 > moving_average_200_20
        
        # Condition 4: 50 SMA> 150 SMA and 50 SMA> 200 SMA
        condition_4 = moving_average_50 > moving_average_150 > moving_average_200
           
        # Condition 5: Current Price > 50 SMA
        condition_5 = currentClose > moving_average_50
           
        # Condition 6: Current Price is at least 30% above 52 week low
        condition_6 = currentClose >= (1.3*low_of_52week)
           
        # Condition 7: Current Price is within 25% of 52 week high
        condition_7 = currentClose >= (.75*high_of_52week)
        
        # If all conditions above are true, add stock to exportList
        if(condition_1 and condition_2 and condition_3 and condition_4 and condition_5 and condition_6 and condition_7):
            topStocks.append(
                json.dumps(
                    {'stockData': stock, "rsRating": RS_Rating ,"fiftyDayMA": moving_average_50, "oneFiftyDayMA": moving_average_150, "twoHundredDayMA": moving_average_200, "fiftyTwoWeekLow": low_of_52week, "fiftyTwoWeekHigh": high_of_52week}
                )
            )

    except Exception as e:
        print (e)
        print(f"Could not gather data on {stock}")



# save the top stocks in a file
with open('topStocks.json', 'w') as f:
    f.write(json.dumps({
        'topStocks': topStocks
    }))
    f.close()
