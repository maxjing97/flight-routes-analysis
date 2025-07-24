import { MinPriorityQueue } from "@datastructures-js/priority-queue";
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
  while (pq.size()!=0) {
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


//similar to Dijkstra/ except we use a heuristic funciton 
const Astar = (iata, dest_iata) => {

}


//console.log("testing BFS",BFS("PEK", "NRT"))

//pq.enqueue({dist: 3})
//pq.enqueue({dist: 1})
//pq.enqueue({dist: 2})
//console.log("pq size:", pq.size())
//console.log("testing priority queue dequeue:",pq.dequeue())
//console.log("pq size:", pq.size())

const [dist, prev] =  DijkstraPath("LHR", "NRT")
console.log("testing Dijkstra's algorithm distance",dist)
console.log("testing Dijkstra's algorithm path",getPath("LHR", "NRT", prev))