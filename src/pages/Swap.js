import React, { useState, useEffect } from 'react';
import '../main.css';
import SwapTokens from "../components/SwapTokens";

  
function Swap (props) {
    const url = window.location.pathname

    useEffect(() => {
        document.body.className = 'swap';
        let x = document.getElementsByClassName("main-layout");
        let x1 = document.getElementsByClassName("teams");

        if(x.length > 0) { 
            x[0].classList.add("hide"); 
        }

        if(x1.length > 0) { 
            x1[0].classList.add("hide"); 
        }

        // make sure swap shows
        let y = document.getElementsByClassName("swap-flex");
        if(y.length > 0) { 
            y[0].classList.remove("hide"); 
        }
        
    }, []);

    return (
        <div>
        </div>
    )
}


export default Swap