import React from "react";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import { convertNameToTradingviewSybmol } from "../utils/nametoSymbol.js";
import "./Widget.css";

const Widget = React.memo((props) => {
  return (
    <div>
      <div className="widget-class">
        <TradingViewWidget
          symbol={convertNameToTradingviewSybmol(props.coinSelectedName)}
          width={950}
          height={550}
          timezone="Asia/Kolkata"
          locale="in"
          style="2"
          theme={Themes.DARK}
          range="12m"
          // toolbar_bg = "#f1f3f6"
          allow_symbol_change={false}
          details={true}
          studies={["MASimple@tv-basicstudies"]}
          // hotlist = {true}
          // calendar = {true}
        />
      </div>
    </div>
  );
});

export default Widget;
