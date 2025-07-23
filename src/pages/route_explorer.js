import "./routes.css"
import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from "react-router-dom"
import network_airports from "./data/airports_in_network.json"
import network_graph from "./data/network_graph.json"

//find index by iata code in the airport networks data
const getIdx = (iata) => {
  let i = 0
  for (const obj of network_airports) {
    const curriata = obj["IATA"]
    if (curriata===iata) {
      return i
    }
    i+=1
  }
  return -1
}

function SearchAirports({initialIata = "LHR", setResult=()=>{}}) {  
  const initial_index = getIdx(initialIata)
  const [inputText, setInputText] = useState(`${network_airports[initial_index]["IATA"]}`) ///initial text that appears in the input box 
  const [searchData, setSearchData] = useState([]) //this is the state storing current search data options to the user
  

  const handleInput = (e)=> {
    const text = e.target.value.toLowerCase().trim() 
    setInputText(text)
    //if no text, reset to empty list
    if(!text || text.length < 2) {
      setSearchData([])
      return 
    }
    
    const match_list = []
    for (const obj of network_airports) {
      const name = obj["wiki_name"].toLowerCase()
      const iata = obj["IATA"].toLowerCase()
      if (name.includes(text) || iata.includes(text)) {
        match_list.push(obj)
      }
    }
    //set the datalist
    setSearchData(match_list)
  
    return 
  }

  //handle a click when clicking a option
  const handleOption = (airport)=> {
    //set the click result
    setResult(airport)
    setInputText(`${airport["IATA"]}`)//set the display data
    setSearchData([]) //make search result empty again
    return
  }

  return (
    <div className="search-trends">
      <div className="search-container">
          <label id="select-airport-label">Airport: </label>
          <input type="text" id="airport-select" onChange={handleInput} value={inputText}/>
          <div id="search-results-list">
            {
              searchData.map((airport, index)=>(
                <button className="airport-search-option" onClick={()=>handleOption(airport)}>{`${airport["IATA"]}: ${airport["wiki_name"].replaceAll("_"," ")}`}</button>
              ))
            }
          </div>
      </div>
    </div>
  );
}


export function RouteFinder() { //entry function allowing more information to be found out
  const [sourceData, setSourceData] = useState(network_airports[getIdx("LHR")]) //store the source airport data
  const [destData, setDestData] = useState(network_airports[getIdx("NRT")]) //store the dest airport data


  return (
    <div className="about_main"> 
      <h2>Route Explorer: Find the Shortest Routes and Airlines between 959 airports</h2>
      <h3>Search and Select your Source and destination airports</h3>
      <div id="select-routes">
        <SearchAirports initialIata="LHR" setResult={setSourceData}/>
        <SearchAirports initialIata="NRT" setResult={setDestData}/>
      </div>
      <h3>Finding the shortest routes </h3>
      <h3>From {sourceData["wiki_name"].replaceAll("_"," ")} ({sourceData["IATA"]}) to {destData["wiki_name"].replaceAll("_"," ")} ({destData["IATA"]})</h3>
    </div>
  );
}
