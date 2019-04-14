import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { wixData } from "./wix-api";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>React with Wix!!</p>
          <button
            onClick={()=>wixData.get("myCollection", "test")
              .then(console.log).catch((error)=>{
                console.log(`error in app ${error}`)
              })}
          >
            request
          </button>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
