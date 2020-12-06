import React from 'react'
import logo from './logo.svg'
import './App.css';

function App() {
  return (
    <div className="App">
      <head>
        <title> Hokuinet </title>
      </head>
      <h1>北医ネット(作成中) </h1>
      <form name="login-form"> <br/>
        <input type="email" name="email" /><br/>
        <input type="password" name="password" />
      </form>

        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
    </div>
  );
}

export default App;
