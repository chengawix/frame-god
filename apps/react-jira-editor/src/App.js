import React, { Component } from "react";
import JiraEditor from "react-jira-editor";
import {storage} from "./wix-api";
import './App.scss';

// var initialContent = ;
let jiraEditor = null;
function onJiraEditor_Loaded(editor) {
  jiraEditor = editor;
}


class App extends Component {
  constructor(){
    super()
    storage.onValue("markup",(data,key)=>{
      this.setState({
        test: data,
        initialContent:data.toString()
      })
    })
  }
  state = {
    initialContent:null
  }
  render() {
    let {initialContent,test} = this.state
    return (
      <JiraEditor 
        html={initialContent}
        onChange={({text,html,markup})=>storage.setItem("markup",markup)}
        ref={onJiraEditor_Loaded}
        />
      
      
      )
}
}

export default App;
