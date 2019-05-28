import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { wixData } from "./wix-api";
import ReactStickies from 'react-stickies';

class App extends Component {
  constructor () {
    super()
    this.state = {
      data: "This is React In Wix QQ",
      notes:[]
    }
    this.onChange = this.onChange.bind(this)
    // this.onSave = this.onSave.bind(this)
  }
  onChange (notes) {
    this.setState({ // Update the notes state
      notes
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{this.state.data}</p>
          <button
            onClick={()=>wixData.get("apps", "10bf55a5-63c9-43fd-8e19-7bad6128ad37")
              .then((results)=>{
                this.setState({data:JSON.stringify(results) })
                console.log(`res in app ${JSON.stringify(results)}`)
              }).catch((error)=>{
                console.log(`error in app ${JSON.stringify(error)}`)
              })}
          >
            Load Data
          </button>
          <ReactStickies
              notes={this.state.notes}
              onChange={this.onChange}
      />
        </header>
      </div>
    );
  }
}

export default App;
