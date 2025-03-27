"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import ApexCharts dynamically to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const TradingChart = ({ symbol, tradeType }) => {
  const [series, setSeries] = useState([{
    data: []
  }]);
  
  const [options, setOptions] = useState({
    chart: {
      type: 'candlestick',
      height: 500,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        },
        autoSelected: 'zoom'
      },
      background: 'transparent'
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        formatter: function(value) {
          return '$' + value.toFixed(2);
        }
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#26a69a',
          downward: '#ef5350'
        },
        wick: {
          useFillColor: true,
        }
      }
    },
    tooltip: {
      x: {
        format: 'MMM dd HH:mm'
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      }
    },
    theme: {
      mode: 'light'
    }
  });

  // Generate initial data
  useEffect(() => {
    const basePrice = getBasePrice(symbol);
    const candleData = generateCandleData(basePrice, 50);
    
    setSeries([{
      data: candleData
    }]);
    
    // Set Y-axis min and max range based on price
    setOptions(prevOptions => ({
      ...prevOptions,
      yaxis: {
        ...prevOptions.yaxis,
        min: basePrice * 0.95,
        max: basePrice * 1.05
      },
      title: {
        text: symbol + ' Price Chart',
        align: 'left'
      }
    }));
  }, [symbol]);

  // Update data periodically
  useEffect(() => {
    if (series[0].data.length === 0) return;
    
    const interval = setInterval(() => {
      setSeries(prevSeries => {
        const lastCandle = prevSeries[0].data[prevSeries[0].data.length - 1];
        const newCandle = generateNextCandle(lastCandle, tradeType);
        
        return [{
          data: [...prevSeries[0].data.slice(-49), newCandle]
        }];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [series, tradeType]);

  return (
    <div className="apex-charts">
      {typeof window !== 'undefined' && (
        <ReactApexChart 
          options={options} 
          series={series} 
          type="candlestick" 
          height={500} 
        />
      )}
    </div>
  );
};

// Helper function to get base price for different symbols
function getBasePrice(symbol) {
  switch(symbol) {
    case 'BTCUSDT': return 42000;
    case 'ETHUSDT': return 2200;
    case 'BNBUSDT': return 380;
    case 'ADAUSDT': return 0.5;
    case 'SOLUSDT': return 100;
    default: return 1000;
  }
}

// Helper function to generate sample candle data
function generateCandleData(basePrice, count) {
  const data = [];
  let lastClose = basePrice;
  
  // Create data for the past "count" periods
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const time = new Date(now);
    time.setMinutes(now.getMinutes() - (count - i) * 15);
    
    // Random price movements
    const volatility = basePrice * 0.02;
    const change = (Math.random() * volatility) - (volatility / 2);
    
    const open = lastClose;
    const close = open + change;
    const high = Math.max(open, close) + (Math.random() * volatility * 0.5);
    const low = Math.min(open, close) - (Math.random() * volatility * 0.5);
    
    data.push({
      x: time.getTime(), // Timestamp
      y: [open, high, low, close]
    });
    
    lastClose = close;
  }
  
  return data;
}

// Helper function to generate the next candle
function generateNextCandle(lastCandle, tradeType) {
  const timestamp = new Date().getTime(); // Current time as timestamp
  
  // Get the last close price
  const lastClose = lastCandle.y[3];
  
  // Bias the price movement based on trade type
  const bias = tradeType === 'buy' ? 0.6 : 0.4; // 60% chance of price going up for buy signals
  const isUp = Math.random() < bias;
  
  const volatility = lastClose * 0.01;
  const change = isUp ? 
    Math.random() * volatility : 
    -Math.random() * volatility;
  
  const open = lastClose;
  const close = open + change;
  const high = Math.max(open, close) + (Math.random() * volatility * 0.3);
  const low = Math.min(open, close) - (Math.random() * volatility * 0.3);
  
  return {
    x: timestamp,
    y: [open, high, low, close]
  };
}

export default TradingChart; 