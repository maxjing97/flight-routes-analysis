import './App.css';
import { Route,Routes } from 'react-router-dom';
import Navbar from './navbar';
import UserProvider from "./context/userContext"
import {Entry, Main, Resources} from './pages/more';

import{QueryClient, QueryClientProvider} from "@tanstack/react-query"
const queryClient = new QueryClient() //log the query client to be used
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Navbar/>
        <div>
        <Routes>        {/*defining routes */}
          <Route path="/entry"  element={<Entry/>} />{/*default page route */}
          <Route path="/main"  element={<Main />}/>
          <Route path="/res"  element={<Resources />}/>
        </Routes>
        </div>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;