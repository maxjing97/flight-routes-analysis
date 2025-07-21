import './App.css';
import { Route,Routes,Link } from 'react-router-dom';
import Navbar from './navbar';
import UserProvider from "./context/userContext"
import {Entry, Main, Resources} from './pages/main';

import{QueryClient, QueryClientProvider} from "@tanstack/react-query"
const queryClient = new QueryClient() //log the query client to be used
function App() {
  return (
    
    <QueryClientProvider client={queryClient}>
      <UserProvider>
      <div id="header">
        <img id="icon" src="./media/icon.png"/>
        <Link to="/main">
          <h1 id="title">Wikipedia Flight Data Explorer</h1>
        </Link>
      </div>


        <Navbar/>
          <Routes> 
            <Route path="/entry"  element={<Entry/>} />{/*default page route */}
            <Route path="/main"  element={<Main />}/>
            <Route path="/res"  element={<Resources />}/>
          </Routes>
      </UserProvider>
    </QueryClientProvider>
    
  );
}

export default App;