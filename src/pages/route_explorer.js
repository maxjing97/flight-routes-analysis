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

//function to get the possible airlines between two destination iata (needed since BFS/A* algorithm) matches based on iata/first
const getAirlines = (source, dest) => {
  const found_airlines = [] //list of airlines found 
  //get connections list 
  const connections = network_graph[source]
  for(const node of connections) {
    if (node[1] === dest) {
      found_airlines.push(node[2])
    }
  }
  return found_airlines
}
//from a previous array from the BFS or A* function, get the path in ascending order from a source to a destination, and show approximate distance
const getPath = (source, dest, prev) => {
  let path = [] //store the path. Add from the start by using unshift instead
  let current_iata = dest//get the current next iata from the prev, intiialze with the current one
  path.unshift(current_iata)
  while (current_iata !== source) {
    current_iata = prev[current_iata]
    path.unshift(current_iata)
  }
  return path
}

//bfs algorithm with source iata and destination iata 
const BFS = (iata, dest_iata) => {
  //mark all iata other destinations as unvisited (infinite distance from the start)
  let visited = {} 
  let prev = {} //previous array of the components
  for(const key in network_graph) {
    visited[key] = Infinity //set to 
    prev[key] = null //set to 
  }
  visited[iata] = 0//set the current visited node distane to be 0
  prev[iata] = iata //previous for itself is clearly this 
  const Q = [iata] //use a list as queue
  while (Q.length > 0) { //while queue is not empty
    const curriata = Q.shift() //remove starting element
    //get neighbors list of tuples of [distance, iata, airline]
    const neighbors = network_graph[curriata]   
    for (const neighbor of neighbors) {
      const neighbor_iata = neighbor[1]//get the iata of the neighbor
      if (visited[neighbor_iata]===Infinity) { //only added to next visited
        visited[neighbor_iata] = visited[curriata] + 1 //add 1 for the distance
        Q.push(neighbor_iata)//add to the queue 
        prev[neighbor_iata] = curriata//store the previous 
        //this part is excluded in standard bfs if we want to find the shortest number of connections to a certain node, we stop here
        if (dest_iata === neighbor_iata) {
          return [visited[neighbor_iata], prev] //return the distance and the previous map
        }
      }
    }
  }
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
    if (airport) {
      setInputText(`${airport["IATA"]}`)//set the display data
      setSearchData([]) //make search result empty again
      setResult(airport)
    }
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
                <button key={index} className="airport-search-option" onClick={()=>handleOption(airport)}>{`${airport["IATA"]}: ${airport["wiki_name"].replaceAll("_"," ")}`}</button>
              ))
            }
          </div>
      </div>
    </div>
  );
}

 
export function RouteFinder() { //entry function allowing more information to be found out
  const [sourceData, setSourceData] = useState(network_airports[getIdx("LHR")]) //store the source airport data (default origin)
  const [destData, setDestData] = useState(network_airports[getIdx("NRT")]) //store the dest airport data (default destination)
  const [BFSresults, setBFSresults] = useState(BFS("LHR", "NRT"))//store bfs results
  const [BFSpath, setBFSpath] = useState(getPath("LHR", "NRT", {"NRT":"LHR","LHR":"LHR"})) //get bfs path taken using the function
  //store results
  useEffect(()=>{
    const newBFS = BFS(sourceData["IATA"], destData["IATA"])
    setBFSresults(newBFS)
    setBFSpath(getPath(sourceData["IATA"], destData["IATA"], newBFS[1]))
  }, [sourceData, destData]) //change the BFS result if the 

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

      {BFSresults[0]===1 && 
        <div className="path-parts">
          <h3>There's a direct flight operated by the following airlines:</h3>
          {getAirlines(sourceData["IATA"], destData["IATA"]).map((airline, index) => (
            <h5 className="path-airline">{airline}</h5>
          ))}
        </div>
      }
      
      {BFSresults[0]!==1 && 
        <div>
          <h3>There's no direct flight. Here's a route with the fewest connections ({BFSresults[0]})</h3>
          {/*retrace the path using the previous dict*/}
          <h3>Flight path:</h3>
          <div className="display-paths">
            {
             BFSpath.map((airport, index) => (
              <div key={index}>
                {(index < BFSpath.length - 1) && 
                  <div className="path-parts">
                    <h3>{BFSpath[index]} to {BFSpath[index+1]} Operators:</h3>
                    {getAirlines(BFSpath[index], BFSpath[index+1]).map((airline, index) => (
                      <h5 className="path-airline">{airline}</h5>
                    ))}
                  </div>
                }
              </div>
              ))
            }
          </div>
        </div>
      }
    
    </div>
  );
}
