import React, { useState, useEffect } from 'react';
import '../home.css';
import MoonLogo from '../images/moon_logo.svg';
import { Airdrop } from '../Airdrop';


function Home (props) {
    const url = window.location.pathname

    useEffect(() => {
        document.body.className = 'no-swap';
        let x = document.getElementsByClassName("teams");
        let x1 = document.getElementsByClassName("buy-flex");
        let x2 = document.getElementsByClassName("swap-flex");

        if(x.length > 0) { 
            x[0].classList.remove("hide"); 
            if(x.length > 1) { 
                x[1].classList.remove("hide"); 
            }
            if(x.length > 2) { 
                x[2].classList.remove("hide"); 
            }
        }
        
        if(x1.length > 0) { 
            x1[0].classList.add("hide"); 
        }

        if(x2.length > 0) { 
            x2[0].classList.add("hide"); 
        }

        let y = document.getElementsByClassName("main-layout");
        if(y.length > 0) { 
            y[0].classList.remove("hide"); 
        }

        
    
    }, []);

    return (
        <div></div>
    )
}

export default Home