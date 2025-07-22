import "./main.css"
import React from 'react';
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom"
import airline_changes from "./data/airline_changes.json"
import airport_changes from "./data/airport_changes.json"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from "leaflet"

//custom icon for a default pin
const defaultIcon = new L.DivIcon({
  className: '', // Remove default styles
  html: `<svg width="15" height="15" viewBox="0 0 24 24" fill="#114fd3ff" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#114fd3ff" />
  </svg>`,
  iconSize: [15, 15],
  iconAnchor: [1, 1],
});
//function to get a colored icon based on the change amount
const getIcon =(change) => {
  let color = ""
  if (change < -25) {
    color = "#3c0001ff"
  } else if (change >= -25 && change < -15){
    color = "#850d0fff"
  } else if (change >= -15 && change < -10){
    color = "#ac2f31ff"
  } else if (change >= -10 && change < -5){
    color = "#e77678ff"
  } else if (change >= -5 && change <0) {
    color = "#905b0bff"
  } else if (change === 0) {
    color = "#ffffff"
  } else if (change > 0 && change <5) {
    color = "#90a531ff"
  } else if (change >= 5 && change <10) {
    color = "#97fcb8ff"
  } else if (change >= 10 && change <15) {
    color = "#2dcf63ff"
  } else if (change >= 15 && change <25) {
    color = "#116c2bff"
  } else if (change >= 25) {
    color = "#012c0dff"
  } 

  const defaultIcon = new L.DivIcon({
    className: '', // Remove default styles
    html: `<svg width="12" height="12" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="${color}" />
    </svg>`,
    iconSize: [12, 12],
    iconAnchor: [1, 1],
  });
  return defaultIcon;
}

export function Entry() { //entry function allowing more information to be found out
  //display world map with leaflet
  useEffect(() => {
  }, [])
  
  return (
    <div className="about_main" style={styles.about_main}> 
      <h1 className='stats-title'>Wikipedia Flights Data Explorer</h1>
      <h3>Explore wikipedia flight routes data and COVID-19 trends from wikipedia data</h3>

      {/*leaflet map */}
      <div id="map-box">
      <MapContainer id="map" center={[0, 0]} zoom={1} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {airport_changes.map((json, index) => (
          <Marker icon={defaultIcon} position={[json["current_source_airports_details.latitude"], json["current_source_airports_details.longitude"]]}>
            <Popup id="preview-pin">
              <h3>{json["iata_source"]} :</h3>  {json["current_source_airports_details.wiki_name"].replaceAll("_"," ")}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      </div>
      <h4 className="map-caption">Map of all 978 airports in the trend data and their IATA codes</h4>
      <div className="essay">
        <p>
          Explore webscrapped route data (data current as of July 19th 2025) for the top 959 airports in the world. 
        </p>
        <p>
        Also, compare trends in the number of routes per airport according to wikipedia data from the top 978 airports. View changes in routes for these airports by three year ranges: <br></br> 
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
//component to show text for current_vs_pre2020_routes. there are three other components 
function CurrToPre2020 () {
  return (
    <div className="essay">
      <h3>Summary</h3>
      <p>
        COVID-19 had a massive impact on the aviation industry. Many routes stopped operating.
        Looking at this data allows use to see the the recovery progress of certain airports over time,
        from now to before the start of the pandemic. 
      </p>
      <p>
      Also, compare trends in the number of routes per airport according to wikipedia data from the top 979 airports. View changes in routes for these airports by three year ranges: <br></br> 
      </p>
    </div>
  );
}



//main component to show flight trends 
export function Trends() {
  const [currTime, setCurrTime] = useState("current_vs_pre2020_routes")//find the current selected value of time range (default)
  //function to get text to show 
  const getCaption = () => {
    switch (currTime) {
      case "current_vs_pre2020_routes": 
        return "start of 2020 to now"
      case "pre2022_vs_pre2020_routes": 
        return "start of 2020 to the start of 2022"
      case "current_vs_pre2022_routes":
        return "start of 2022 to now"
      default:
        return ""
    }
  }

  return (
    <div className="about_main" style={styles.about_main}> 
      <h1 className='stats-title'>Wikipedia Flights Trend Explorer and Analysis</h1>
      <h3>Explore COVID-19 trends from wikipedia airport data and see how routes changed</h3>
      <div id="time-options-box">
        <p id="time-select-text">Select a time period: </p>
        <select id="time-select" onChange={(e)=>setCurrTime(e.target.value)}> 
          <option value="current_vs_pre2020_routes">start of 2020 to now</option>
          <option value="pre2022_vs_pre2020_routes">start of 2020 to the start of 2022</option>
          <option value="current_vs_pre2022_routes">start of 2022 to now</option>
        </select>
      </div>

      {/*leaflet map */}
      <div id="map-box">
        <div id="map-legend">
          <h2>Legend:</h2>
          <h3>Route change by airport</h3>
          <p><svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#3c0001ff" />
          </svg>{"< -25"}</p>
          <p><svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#850d0fff" />
          </svg>{"-25 to -16"}</p>
          <p><svg width="12" height="12" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#ac2f31ff" />
          </svg>{"-15 to -11"}</p>
          <p><svg width="12" height="12" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#e77678ff" />
          </svg>{"-10 to -4"}</p>
          <p><svg width="12" height="12" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#905b0bff" />
          </svg>{"-5 to -1"}</p>
          <p><svg width="12" height="12" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#ffffff" />
          </svg>{"no change"}</p>
          <p><svg width="12" height="12" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#90a531ff" />
          </svg>{"+1 to +4"}</p>
          <p><svg width="12" height="12" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#97fcb8ff" />
          </svg>{"+5 to +9"}</p>
          <p><svg width="12" height="12" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#2dcf63ff" />
          </svg>{"+10 to +14"}</p>
          <p><svg width="12" height="12" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#116c2bff" />
          </svg>{"+15 to +24"}</p>
          <p><svg width="12" height="12" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#012c0dff" />
          </svg>{"> 25"}</p>
          <p>ranges are inclusive</p>
        </div>
      <MapContainer id="map" center={[0, 0]} zoom={1} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {airport_changes.map((json, index) => (
          <Marker icon={getIcon(json[currTime])} position={[json["current_source_airports_details.latitude"], json["current_source_airports_details.longitude"]]}>
            <Popup id="preview-pin">
              <h3>{json["iata_source"]} :</h3>  {json["current_source_airports_details.wiki_name"].replaceAll("_"," ")}
              <h3>Route change : {json[currTime]}</h3>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      </div>
        <h4 className="map-caption">Route trends from the {getCaption()}</h4>
        <div id="display-graphs">
          <img src="./media/num_airport_routes.png"/>        
          <img src="./media/mean_airport_routes.png"/>      
          <img src="./media/sd_airport_routes.png"/>      
        </div>
        <div className="essay">
          <h3>Summary</h3>
          <p>
            COVID-19 had a massive impact on the aviation industry. Many routes stopped operating.
            Looking at this data allows use to see the the recovery progress of certain airports over time,
            from now to before the start of the pandemic. 
          </p>
        </div>
    </div>
  );
}

//main page about how the data was collected
export function Resources() {
  return (
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