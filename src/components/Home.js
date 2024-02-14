import React, { Component } from "react";
import axios from "axios";
import {
  getUpdatedTotalAssetAmt,
  executePrevCompletedOrders,
} from "../utils/orderUtil";
import "./BuySell.css";
import Widget from "./Widget";
import BuySell from "./BuySell";
import OrderTable from "./OrderTable";

import {
  handleBuyNow,
  handleBuyAt,
  handleSellNow,
  handleSellAt,
} from "./handleOrder";

import {
  showToastSuccess,
  showToastError,
  showToastWarn,
} from "../utils/toast";

import { numberWithCommas } from "../utils/miscUtil";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.lastTotalAssetChangeTimeout = null;

    // default value of the state
    this.state = {
      userId: null, // random alpha numeric string of len 10
      email: null,
      name: null,

      lastTotalAssetChange: "none",

      totalAssetAmt: "",
      balance: 10000,

      holding: {},

      allOrders: [],

      coinSelectedName: "bitcoin", // default

      currentPrice: {
        bitcoin: null,
        ethereum: null,
        dogecoin: null,
        tesla: null,
      },
    };
  }

  async componentDidMount() {
    this.quickUpdateCurrentPriceUsingApi();
    this.startUpdatingCurrentPriceUsingWebsocket();
    await this.updateUserDataFromLocalStorage(); // update the state if present in local storage else create a userId and save state to local storage
    this.updatePrevCompletedOrders();
  }

  componentDidUpdate(prevProps, prevState) {
    let newTotalAssetAmt = getUpdatedTotalAssetAmt(
      this.state.balance,
      this.state.holding,
      this.state.currentPrice
    );
    if (newTotalAssetAmt && this.state.totalAssetAmt !== newTotalAssetAmt) {
      this.state.totalAssetAmt = newTotalAssetAmt; // no setState() so as to avoid re render
    }

    // update this.state.lastTotalAssetChange
    if (prevState.totalAssetAmt !== "") {
      // handle case for first time totalAssetAmt updation
      if (prevState.totalAssetAmt < this.state.totalAssetAmt) {
        // console.log("total asset increased ;) green");
        clearTimeout(this.lastTotalAssetChangeTimeout);
        this.setState({ lastTotalAssetChange: "positive" });
        // this.lastTotalAssetChange = 'positive';
        this.lastTotalAssetChangeTimeout = setTimeout(() => {
          this.setState({ lastTotalAssetChange: "none" });
        }, 1500);
      } else if (prevState.totalAssetAmt > this.state.totalAssetAmt) {
        // console.log("total asset increased ;( red");
        clearTimeout(this.lastTotalAssetChangeTimeout);
        this.setState({ lastTotalAssetChange: "negative" });
        // this.lastTotalAssetChange = 'negative';
        this.lastTotalAssetChangeTimeout = setTimeout(() => {
          this.setState({ lastTotalAssetChange: "none" });
        }, 1500);
      }
    }

    // only update the userData in the localStorage if any newOrder was placed i.e allOrders was changed
    let userData = { ...this.state }; // all property of this.state except coinSelectedName, currentPrice
    delete userData.coinSelectedName;
    delete userData.currentPrice;
    delete userData.totalAssetAmt;

    window.localStorage.setItem("userData", JSON.stringify(userData));

    if (prevState.balance != this.state.balance)
      this.updateDbFromLocalStorage();
  }

  async updateUserDataFromLocalStorage() {
    try {
      let userDataLocalStorage = JSON.parse(
        window.localStorage.getItem("userData")
      );
      console.log("userdata in localStorage", userDataLocalStorage);

      if (userDataLocalStorage) {
        const { userId, email, name, balance, holding, allOrders } =
          userDataLocalStorage;
        this.setState({
          userId,
          email,
          name,
          balance,
          holding,
          allOrders,
        });
      }
    } catch (err) {
      console.log("cant read userData from local storage", err);
    }
  }

  async updateDbFromLocalStorage() {
    try {
      const headers = {
        "Content-Type": "application/json",
        charset: "UTF-8",
      };

      let user = JSON.parse(window.localStorage.getItem("userData"));
      console.log("THis is uid" + JSON.stringify(user));

      var data = {
        email: user.email,
        userId: user.userId,
        holding: user.holding,
        balance: user.balance,
        allOrders: user.allOrders,
      };
      const res = await axios({
        method: "POST",
        data: data,
        headers: { headers },
        withCredentials: true,
        url: "/user/updateUserData",
      });

      if (res.data.success) {
        console.log("Data Update in Db from Local Success: ", res.data);
      }
    } catch (err) {
      console.log("Data Update in Db from Local Failed", err);
    }
  }

  quickUpdateCurrentPriceUsingApi() {
    // bitcoin
    var config = {
      method: "get",
      url: "https://api.coincap.io/v2/rates/bitcoin",
      headers: {},
      raxConfig: {
        retry: 3,
        retryDelay: 500,
      },
    };
    axios(config)
      .then(
        function (response) {
          console.log(
            "\n\n\n got bitcoin price from api",
            response.data.data.rateUsd
          );
          const price = response.data.data.rateUsd;
          let updatedCurrentPrice = { ...this.state.currentPrice };
          updatedCurrentPrice.bitcoin = price;
          this.setState({ currentPrice: updatedCurrentPrice });
        }.bind(this)
      )
      .catch(function (error) {
        console.log("error updating currentPrice of bitcoin by API", error);
      });

    // ethereum
    var config = {
      method: "get",
      url: "https://api.coincap.io/v2/rates/ethereum",
      headers: {},
      raxConfig: {
        retry: 3,
        retryDelay: 500,
      },
    };
    axios(config)
      .then(
        function (response) {
          console.log(
            "\n\n\n got ethereum price from api",
            response.data.data.rateUsd
          );
          const price = response.data.data.rateUsd;
          let updatedCurrentPrice = { ...this.state.currentPrice };
          updatedCurrentPrice.ethereum = price;
          this.setState({ currentPrice: updatedCurrentPrice });
        }.bind(this)
      )
      .catch(function (error) {
        console.log("error updating ethereum currentPrice by API", error);
      });

    // dogecoin
    var config = {
      method: "get",
      url: "https://api.coincap.io/v2/rates/dogecoin",
      headers: {},
      raxConfig: {
        retry: 3,
        retryDelay: 500,
      },
    };
    axios(config)
      .then(
        function (response) {
          // console.log('\n\n\n dogecoin price got from api:', response.data.data.rateUsd);
          const price = response.data.data.rateUsd;
          let updatedCurrentPrice = { ...this.state.currentPrice };
          updatedCurrentPrice.dogecoin = price;
          this.setState({ currentPrice: updatedCurrentPrice });
        }.bind(this)
      )
      .catch(function (error) {
        console.log("error updating currentPrice by API", error);
      });
  }

  // updated the this.state.currentPrice, user details whenever we get a new current price
  startUpdatingCurrentPriceUsingWebsocket() {
    // 1. websocket listener for bitcoin, etherium, dogecoin

    const pricesWs = new WebSocket(
      "wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin"
    );
    pricesWs.onmessage = function (msg) {
      msg = JSON.parse(msg.data);

      let newCurrentPrice = { ...this.state.currentPrice };

      if (msg.bitcoin) newCurrentPrice.bitcoin = msg.bitcoin;
      if (msg.ethereum) newCurrentPrice.ethereum = msg.ethereum;
      if (msg.dogecoin) newCurrentPrice.dogecoin = msg.dogecoin;

      this.setState({ currentPrice: newCurrentPrice });
    }.bind(this);
  }

  getCurrentPrice = () => {
    return this.state.currentPrice;
  };

  updatePrevCompletedOrders = async () => {
    const { newBalance, newHolding, updatedAllOrders } =
      await executePrevCompletedOrders(
        this.state.allOrders,
        this.state.balance,
        this.state.holding,
        this.getCurrentPrice
      );

    console.log(newBalance, newHolding, updatedAllOrders);
    this.setState({
      balance: newBalance,
      holding: newHolding,
      allOrders: updatedAllOrders,
    });
  };

  // called by the child class BuySell whenever user clicks on buy or sell
  placeOrder = (order) => {
    // update totalAsset, holding, allOrders
    console.log("order got at Home.js", order);

    if (this.state.currentPrice[order.coinSelectedName] === null) {
      showToastError(
        `Order can't be placed websocket is not ready yet for the stock: ${order.coinSelectedName}`
      );
      return;
    }

    order.priceWhenOrderWasPlaced = Number(
      this.state.currentPrice[order.coinSelectedName]
    );
    switch (order.type) {
      case "buyNow": {
        order.coinBought =
          order.amount / this.state.currentPrice[order.coinSelectedName];
        const { success, newBalance, newHolding } = handleBuyNow(
          this.state.balance,
          this.state.holding,
          order,
          this.state.currentPrice
        );
        if (!success) return;
        this.setState({ balance: newBalance, holding: newHolding });
        break;
      }

      case "sellNow": {
        const { success, newBalance, newHolding } = handleSellNow(
          this.state.balance,
          this.state.holding,
          order,
          this.state.currentPrice
        );
        if (!success) return;
        this.setState({ balance: newBalance, holding: newHolding });
        break;
      }

      case "buyAt":
        showToastSuccess(
          `Your buy order has been placed, it will be automatically executed when the price will reach $${numberWithCommas(
            order.executeWhenPriceAt
          )}`
        );
        break;

      case "sellAt":
        showToastSuccess(
          `Your sell order has been placed, it will be automatically executed when the price will reach $${numberWithCommas(
            order.executeWhenPriceAt
          )}`
        );
        break;
    }

    let newAllOrders = this.state.allOrders.slice();
    let tempOrder = { ...order };
    console.log("tempORder", tempOrder);
    tempOrder.time = Date.now();
    newAllOrders.push(tempOrder);
    // console.log("new orer", newAllOrders);
    this.setState({ allOrders: newAllOrders });

    console.log("order that was added: ", tempOrder);
  };

  remove = () => {
    console.log("pressed reset");
    localStorage.clear();
    this.setState({
      lastTotalAssetChange: "none",
      totalAssetAmt: 10000,
      balance: 10000,
      holding: {},
      allOrders: [],
    });
    showToastSuccess(`All orders has been cleared`);
  };

  render() {
    return (
      <div className="Home">
        <div className="Content">
          <Widget coinSelectedName={this.state.coinSelectedName} />
          <BuySell
            totalAssetAmt={this.state.totalAssetAmt}
            balance={this.state.balance}
            holding={this.state.holding}
            lastTotalAssetChange={this.state.lastTotalAssetChange}
            placeOrder={this.placeOrder}
            currentPrice={this.state.currentPrice}
            coinSelectedName={this.state.coinSelectedName}
            onChange={(value) => this.setState({ coinSelectedName: value })}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "20px",
            paddingRight: "30px",
          }}
        >
          <h1 style={{ textAlign: "center", paddingRight: "500px" }}>
            Order Table
          </h1>
          <button className="button" onClick={this.remove}>
            <span>Reset</span>
          </button>
        </div>
        <div className="Content">
          <OrderTable
            allOrders={this.state.allOrders}
            getCurrentPrice={this.getCurrentPrice}
          />
        </div>
      </div>
    );
  }
}
