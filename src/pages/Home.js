import React, { useState, useEffect } from 'react';
import '../home.css';
import MoonLogo from '../images/moon_logo.png';
import { Airdrop } from '../Airdrop';


function Home (props) {
    const url = window.location.pathname

    useEffect(() => {
        document.body.className = 'no-swap';
        let x = document.getElementsByClassName("main-layout");
        let x1 = document.getElementsByClassName("teams");

        if(x.length > 0) { 
            x[0].classList.remove("hide"); 
        }
        
        if(x1.length > 0) { 
            x1[0].classList.remove("hide"); 
        }

        // make sure swap shows
        let y = document.getElementsByClassName("swap-flex");
        if(y.length > 0) { 
            y[0].classList.add("hide"); 
        }

        
    
    }, []);

    return (
        <div></div>
    )
}

export default Home