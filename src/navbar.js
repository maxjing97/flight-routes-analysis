import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import "./App.css"


const Navbar=()=>{
    return (    
        <div id='navBar'>
            <div className="dropdown">
                <h1 className="main-option"><Link to="/trends">Flight Trends</Link></h1>
                <div className="dropdown-content">
                    <Link to="/trends">Flight Trends</Link>
                    <Link to="/res">About the Data</Link>
                </div>
            </div>
            <div className="dropdown">
                <h1 className="main-option"><Link to="/routefinder">Explore Current Routes</Link></h1>
                <div className="dropdown-content">
                    <Link to="/routefinder">Route Finder</Link>
                    <Link to="/res">More Resources</Link>
                </div>
            </div>
        </div>
    )

}

export default Navbar;