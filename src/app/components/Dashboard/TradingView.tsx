// TradingViewWidget.jsx
import React, { useEffect, useRef, useState, memo } from 'react';

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Detect user's preferred color scheme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load and configure the TradingView widget
  useEffect(() => {
    // Remove any existing script when theme changes
    if (container.current) {
      const existingScript = container.current.querySelector('script');
      if (existingScript) {
        container.current.removeChild(existingScript);
      }
    }

    // Create new script with updated theme
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "width": "100%",
        "height": "100%",
        "symbol": "BINANCE:BTCUSD",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "${theme}",
        "style": "1",
        "locale": "en",
        "backgroundColor": "${theme === 'dark' ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'}",
        "hide_top_toolbar": true,
        "allow_symbol_change": true,
        "save_image": false,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;
    
    if (container.current) {
      container.current.appendChild(script);
    }
  }, [theme]);

  return (
    <div className="w-full h-full border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden">
      <div 
        className="tradingview-widget-container w-full" 
        ref={container}
        style={{ height: "calc(min(70vh, 600px))" }}
      >
        <div className="tradingview-widget-container__widget h-full w-full"></div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
