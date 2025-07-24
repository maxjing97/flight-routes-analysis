import "./routes.css"
import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from "react-router-dom"
import { MinPriorityQueue } from "@datastructures-js/priority-queue";//priority queue for Dijkstra's/A*
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from "leaflet"
import network_airports from "./data/airports_in_network.json"
import network_graph from "./data/network_graph.json"

//default icon to show the map on 
//custom icon for a default pin
const defaultIcon = new L.DivIcon({
  className: '', // Remove default styles
  html: `<svg width="15" height="15" viewBox="0 0 24 24" fill="#114fd3ff" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" fill="#114fd3ff" />
  </svg>`,
  iconSize: [15, 15],
  iconAnchor: [1, 1],
});

//special icon for source and destination airport
const specialIcon = new L.DivIcon({
  className: '', // Remove default styles
  html: `<svg width="15" height="15" viewBox="0 0 24 24" fill="#746400ff" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" fill="#746400ff" />
  </svg>`,
  iconSize: [15, 15],
  iconAnchor: [1, 1],
});

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

//function to get the possible airlines (and approximate distnace) between two destination iata (needed since BFS/A* algorithm) matches based on iata/first
const getAirlinesDistance = (source, dest) => {
  const airline_distances = [] //list of airlines-distance pairs found in the [airline, distance] order 
  //get connections list 
  const connections = network_graph[source]
  for(const node of connections) {
    if (node[1] === dest) {
      airline_distances.push([node[2], node[0]]) //push the a
    }
  }
  return airline_distances
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

//bfs path algorithm with source iata and destination iata 
const BFSPath = (iata, dest_iata) => {
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
//initialize min priority (smallest elements like distance have the highest priority)queue to airport objects. The Max version is also possible
const pq = new MinPriorityQueue(obj=>obj.dist)//initiate the object for comparison
//raw Dijkstra's algorithm
const DijkstraPath = (iata, dest_iata) => {
  //distance and previous maps like before
  let dist = {}
  let prev = {}
  //loop thorugh all iata 
  for(const key in network_graph) {
    dist[key] = Infinity //get to initiy 
    prev[key] = null
  }  
  //priority queue initialization
  dist[iata] = 0 //set the current
  prev[iata] = iata
  pq.enqueue({dist: 0, code: iata})
  while (pq.size()!==0) {
    const currnode = pq.dequeue() //find the current node in the pq
    const curriata = currnode.code//get node iata name
    const neighbors_list = network_graph[curriata]// neighbors
    for(const neighbor of neighbors_list) { //get neighbors 
      const neighbor_iata = neighbor[1]//get neighbor code
      //get the distance between the current node iata and the lower level one
      const altdist = dist[curriata]+neighbor[0] //get alternative distance based on the current node 
      //update if the current distance is longer 
      if(altdist< dist[neighbor_iata]) {
        dist[neighbor_iata] = altdist
        pq.enqueue({dist: altdist, code: neighbor_iata})
        prev[neighbor_iata] = curriata//set the previous node 
      }
    }
    //if we find the destination node, we break. This part is excluded in standard Dijkstra's if we want to find the shortest distance to all nodes
    if(curriata===dest_iata) {
      return [dist[dest_iata], prev]
    }
  }
  return [dist[dest_iata], prev]
}


function SearchAirports({initialIata = "LHR", setResult=()=>{}}) {  
  const initial_index = getIdx(initialIata)
  const [inputText, setInputText] = useState(`${network_airports[initial_index]["IATA"]}`) ///initial text that appears in the input box 
  const [searchData, setSearchData] = useState([]) //this is the state storing current search data options to the user

  const handleInput = (e)=> {
    setInputText(e.target.value) //set value no matter
    //search text
    const text = e.target.value.toLowerCase().trim() 
    //if no text, reset to empty list
    if(!text || text.length < 2) {
      setSearchData([])
      return 
    }
    
    const match_list = []
    for (const obj of network_airports) {
      const name = obj["wiki_name"].toLowerCase()
      const iata = obj["IATA"].toLowerCase()
      const city = obj["city"]  //get city is possible
      if (name.includes(text) || iata.includes(text)) {
        match_list.push(obj)
      }else if (city && city.toLowerCase().includes(text)) { //if city is defined, search for the result
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
  const [sourceData, setSourceData] = useState(network_airports[getIdx("EZE")]) //store the source airport data (default origin)
  const [destData, setDestData] = useState(network_airports[getIdx("ACC")]) //store the dest airport data (default destination)
  const [BFSresults, setBFSresults] = useState(BFSPath("EZE", "ACC"))//store bfs results
  const [BFSpath, setBFSpath] = useState(getPath("EZE", "ACC", BFSPath("EZE", "ACC")[1])) //get bfs path taken using the function
  const [shortestresults, setShortestresults] = useState(DijkstraPath("EZE", "ACC"))//store shortest path results using A*/ Dikjstra's
  const [shortestpath, setShortestpath] = useState(getPath("EZE", "ACC", DijkstraPath("EZE", "ACC")[1])) //get bfs path taken using the function
  const [mapOpen, setMapOpen] = useState(false)//store if the map is closed or not.
  //store results
  useEffect(()=>{
    const newBFS = BFSPath(sourceData["IATA"], destData["IATA"])
    setBFSresults(newBFS)
    const newBFSpath = getPath(sourceData["IATA"], destData["IATA"], newBFS[1])
    console.log("BFS path found", newBFSpath)
    setBFSpath(newBFSpath)
    const newShortest = DijkstraPath(sourceData["IATA"], destData["IATA"])
    setShortestresults(newShortest)
    setShortestpath(getPath(sourceData["IATA"], destData["IATA"], newShortest[1]))
  }, [sourceData, destData]) //change the BFS result if the 

  return (
    <div className="about_main"> 
      <h2>Route Explorer: Find the Shortest Routes and Airlines between 959 airports</h2>
      <h3>Search and Select your Source and destination airports</h3>
      <p>Search by IATA code, official name, or city.</p>
      {/*leaflet map */}
      {mapOpen && 
      <div id="map-box">
        <MapContainer id="map" center={[0, 0]} zoom={1} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {network_airports.map((json, index) => (
            <Marker icon={defaultIcon} position={[json["latitude"], json["longitude"]]}>
              <Popup id="preview-pin">
                <h3>{json["IATA"]} :</h3>  {json["wiki_name"].replaceAll("_"," ")}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      }
      <button id="network-airports-button" onClick={()=>setMapOpen(prev=>!prev)}>
      {
        mapOpen ? (
          <div id="network-airports-button-content">
            <h3>Close Map</h3>
            <img src="./media/close.png" alt="close map"/>
          </div>
        ) : (
          <div id="network-airports-button-content">
          <h3>Open Map</h3>
          <img src="./media/expand.png" alt="close map"/>
          </div>
        )
      }
      </button>
      <div id="select-routes">
        <SearchAirports initialIata="EZE" setResult={setSourceData}/>
        <SearchAirports initialIata="ACC" setResult={setDestData}/>
      </div>
      <h3>Finding the shortest routes </h3>
      <h3>From {sourceData["wiki_name"].replaceAll("_"," ")} ({sourceData["IATA"]}) to {destData["wiki_name"].replaceAll("_"," ")} ({destData["IATA"]})</h3>

      
      {(BFSresults[0]===1) && 
        <div className="path-parts">
          {getAirlinesDistance(sourceData["IATA"], destData["IATA"]).map((airline_distances, index) => (
            <div>
            { (index !== 0) &&
              <h5 className="path-airline">{airline_distances[0]}</h5>
            }
            { (index === 0) &&
              <h5 className="path-airline">{airline_distances[0]}<br/> Approximate Distance: {Math.round(airline_distances[1])}km</h5>
            }
            </div>
          ))}
          <h3>There's a direct flight operated by the following airlines:</h3>
        </div>
      }
      {/*Show Dijkstra's if there is no direct path*/}
      {(BFSresults[0]!==1) &&
        <div>
          <h3>There's no direct flight. Here's a route with the shortest path - ({shortestpath.length -1}) connections</h3>
          <h3>Approximate Total distance: {Math.round(shortestresults[0])}km</h3>
          {/*retrace the path using the previous dict*/}
          <h3>Flight path:</h3>
          <div className="display-paths">
            {
             shortestpath.map((airport, index) => (
              <div key={index}>
                {(index < shortestpath.length - 1) && 
                  <div className="path-parts">
                    {getAirlinesDistance(shortestpath[index], shortestpath[index+1]).map((airline_distances, index) => (
                      <div>
                      { (index !== 0) &&
                        <h5 className="path-airline">{airline_distances[0]}</h5>
                      }
                      { (index === 0) &&
                        <h5 className="path-airline">{airline_distances[0]}<br/> Approximate Distance: {Math.round(airline_distances[1])}km</h5>
                      }
                      </div>
                    ))}
                    <h3>{shortestpath[index]} to {shortestpath[index+1]} Operators:</h3>
                  </div>
                }
              </div>
              ))
            }
          </div>
        </div>   
      }
      {/*only show BFS results if Dijkstra's requires more connections than the BFS method and if there is no direct flight*/}
      {(BFSresults[0]!==1 && BFSPath.length < shortestpath.length - 1) && 
        <div>
          <h3>Alternatively, Here's a route with the fewest connections ({BFSresults[0]})</h3>
          {/*retrace the path using the previous dict*/}
          <h3>Flight path:</h3>
          <div className="display-paths">
            {
             BFSpath.map((airport, index) => (
              <div key={index}>
                {(index < BFSpath.length - 1) && 
                  <div className="path-parts">
                    {getAirlinesDistance(BFSpath[index], BFSpath[index+1]).map((airline_distances, index) => (
                      <div>
                      { (index !== 0) &&
                        <h5 className="path-airline">{airline_distances[0]}</h5>
                      }
                      { (index === 0) &&
                        <h5 className="path-airline">{airline_distances[0]}<br/> Approximate Distance: {Math.round(airline_distances[1])}km</h5>
                      }
                      
                      </div>
                    ))}
                    <h3>{BFSpath[index]} to {BFSpath[index+1]} Operators:</h3>
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
