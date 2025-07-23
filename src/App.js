import './App.css';
import { Route,Routes,Link } from 'react-router-dom';
import Navbar from './navbar';
import UserProvider from "./context/userContext"
import {Entry, Trends, Resources} from './pages/main';
import { RouteFinder } from './pages/route_explorer';

import{QueryClient, QueryClientProvider} from "@tanstack/react-query"
const queryClient = new QueryClient() //log the query client to be used
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
      <div id="header">
        <img id="icon" src="./media/icon.png"/>
        <Link to="/">
          <h1 id="title">Wikipedia Flights Data Explorer</h1>
        </Link>
      </div>
        <Navbar/>
          <Routes> 
            <Route path="/"  element={<Entry/>} />{/*default page route */}
            <Route path="/trends"  element={<Trends />}/>
            <Route path="/res"  element={<Resources />}/>
            <Route path="/routefinder"  element={<RouteFinder/>}/>
          </Routes>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;