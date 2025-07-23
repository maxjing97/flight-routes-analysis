import network_airports from "./data/airports_in_network.json" with { type: "json" }; //with needed for running node in terminal
import network_graph from "./data/network_graph.json" with { type: "json" };

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



console.log("testing BFS",BFS("ADD", "SYD"))