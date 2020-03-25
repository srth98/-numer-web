import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Router,Route,browserHistory} from 'react-router'
import Bisection from './Bisection'
import False from './False'
import OnePoint from './OnePoint'
import Newton from './Newton'
import Secant from './Secant'

ReactDOM.render(
    <Router history={browserHistory}>

        <Route path="/" component={App}/>
        <Route path="/Bisection" component={Bisection}/>
        <Route path="/False" component={False}/>
        <Route path="/OnePoint" component={OnePoint}/>
        <Route path="/Newton" component={Newton}/>
        <Route path="/Secant" component={Secant}/>

    </Router>,document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
