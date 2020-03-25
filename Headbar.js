import React from 'react';
import './Headbar.css';

function App() {
    return (
        <div>
        <ul>
            <li><a href="/">H O M E</a></li>
            <li class="dropdown">
                <a href="javascript:void(0)" class="dropbtn">ROOTS OF EQUATION</a>
                <div class="dropdown-content">
                <a href="/Bisection">Bisection</a>                                                            
                <a href="/False">False-Position</a>
                <a href="/OnePoint">One point</a>
                <a href="/Newton">Newton </a>
                <a href="/Secant">Secant</a>

                </div>
            </li>

            <li class="dropdown">
                <a href="javascript:void(0)" class="dropbtn"><s>RINEAR ALGEBRALIC</s></a>
                <div class="dropdown-content">
                <a href="#">Cramer's Rule</a>                                                            
                <a href="#">Gauss Elimination</a>
                <a href="#">Gauss Jordan</a>
                <a href="#">LU Composition</a>
                <a href="#">Cholesky Decomposition</a>
                </div>
            </li>
        </ul> 

        </div>

    );
}
export default App;
