import React from 'react';
import './Input.css';

function App() {
    return (
        <div className="input-div">
            <form action="/action_page.php">
                <label for="fname">Function : </label>
                <input type="text" id="fname" name="firstname" placeholder="Enter Function"/>

                <br/><label for="fname">X Left : </label>
                <input type="text" id="fname" name="firstname" placeholder="Enter XL"/>

                <br/><label for="fname">X Right : </label>
                <input type="text" id="fname" name="firstname" placeholder="Enter XR"/>
                
                <br/>
                <br/><input type="submit" value="Submit"/>
                <br/><input type="submit" value="Test Case"/>
            </form>
        </div>  

    );
}
export default App;
