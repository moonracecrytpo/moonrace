import React, { useState, useEffect } from 'react';
import '../main.css';

  
function Presale (props) {
    const url = window.location.pathname

    useEffect(() => {
        document.body.className = 'presale';
        let x = document.getElementsByClassName("main-layout");
        let x1 = document.getElementsByClassName("teams");
        let x2 = document.getElementsByClassName("swap-flex");

        if (x.length > 0) { 
            x[0].classList.add("hide"); 
        }

        if (x1.length > 0) { 
            x1[0].classList.add("hide"); 
            if (x1.length > 1) { 
                x1[1].classList.add("hide"); 
            }
            if (x1.length > 2) { 
                x1[2].classList.add("hide"); 
            }
        }


        console.log(x2)
        if(x2.length > 0) { 
            console.log("PRESALE")
            x2[0].classList.add("hide"); 
        }

        // make sure swap shows
        let y = document.getElementsByClassName("buy-flex");
        if(y.length > 0) { 
            y[0].classList.remove("hide"); 
        }
        
    }, []);

    return (
        <div>
        </div>
    )
}


export default Presale