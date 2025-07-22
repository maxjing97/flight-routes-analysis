import "./main.css"
import React, { useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom"
import network_airports from "./data/airports_in_network.json"
import network_graph from "./data/network_graph.json"


export function Entry() { //entry function allowing more information to be found out

  return (
    <div className="about_main" style={styles.about_main}> 
      <h1 className='stats-title'>Wikipedia Flights Data Explorer</h1>
      <h3>Explore wikipedia flight routes data and COVID-19 trends from wikipedia data</h3>
      <div className="essay">
        <p>
          Explore webscrapped route data (data current as of July 19th 2025) for the top 959 airports in the world. 
        </p>
        <p>
        Also, compare trends in the number of routes per airport according to wikipedia data from the top 979 airports. View changes in routes for these airports by three year ranges: <br></br> 
        </p>
          <ul>
            <li>end of 2021 (pre2022) to current</li>
            <li>end of 2019 (pre2020) to current</li>
            <li>end of 2019 to end of 2021</li>
          </ul>
        <p>Note that since wikipedia relies on user contribution, much of the data on routes, especially at the smaller airports on the list, 
        is likely to be not be too accurate, especially immediately after the start of the COVID-19 pandemic in 2020.</p>
        <p>More information about how data was collected is found in flight trends </p>
        <p>A powerBI file with detailed analysis is linked for download here: <a href="./routes.analysis.pbix" download="analysis.pbix">Download File</a>
        </p>
      </div>
    </div>
  );
}

export function Trends() {
  return (
    <div className="about_main" style={styles.about_main}> 
      <h1 className='stats-title'>Wikipedia Flights Data Explorer</h1>
      <h3>Explore wikipedia flight routes data and COVID-19 trends from wikipedia data</h3>
      <div className="essay">
        <p>
          Explore webscrapped route data (data current as of July 19th 2025) for the top 959 airports in the world. 
        </p>
        <p>
        Also, compare trends in the number of routes per airport according to wikipedia data from the top 979 airports. View changes in routes for these airports by three year ranges: <br></br> 
        </p>
          <ul>
            <li>end of 2021 (pre2022) to current</li>
            <li>end of 2019 (pre2020) to current</li>
            <li>end of 2019 to end of 2021</li>
          </ul>
        <p>Note that since wikipedia relies on user contribution, much of the data on routes, especially at the smaller airports on the list, 
        is likely to be not be too accurate, especially immediately after the start of the COVID-19 pandemic in 2020.</p>
        <p>More information about how data was collected is found in flight trends </p>
        <p>A powerBI file with detailed analysis is linked for download here: <a href="./routes.analysis.pbix" download="analysis.pbix">Download File</a>
        </p>
      </div>
    </div>
  );
}

//main page about how the data was collected
export function Resources() {
  return (
    <div className="about_main" style={styles.about_main}> 
      <h1 className='stats-title'>About</h1>
      <p>


      </p>

    </div>
  );
}

const styles = {
  wikidict: {
    width: "100%",       /* full container width */
    height: "700px",     /* or any fixed/relative value */
    position: "relative",/* ensures child 100% height works */
  },
  wikidicttext: {
    fontSize: "20px",
    fontWeight: "bold",
  }
}