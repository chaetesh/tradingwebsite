import React from "react";

const About = () => {
  return (
    <div
      className="text-white"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "50px 150px",
        gap: "20px",
        fontSize: "1.2rem",
        fontFamily: "Platypi",
      }}
    >
      <h1 style={{ fontSize: "50px", color: "white", fontFamily: "Oswald" }}>
        About Us
      </h1>
      <h1>
        <span style={{ fontWeight: "600" }}>Simulated Trading:</span> Buy and
        sell virtual stocks with virtual currency, mirroring real-world trading
        mechanics.
      </h1>
      <p>
        <span style={{ fontWeight: "600" }}>Supported Assets:</span> Initially
        focus on Cryptocurrencies and few Stocks, with potential expansion to
        more stocks, options and futures based on user demand.
      </p>
      <p>
        <span style={{ fontWeight: "600" }}>Order Types:</span> Implement basic
        order types market, limit and potentially include advanced options
        stop-loss.
      </p>

      <p>
        <span style={{ fontWeight: "600" }}>Real-time Market Data:</span>{" "}
        Integrate with a reliable data feed to provide accurate and up-to-date
        market information. Portfolio Tracking: View virtual portfolio
        performance, track holdings, and analyze past trades for insightful
        learning.
      </p>
    </div>
  );
};

export default About;
