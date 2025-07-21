import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);
export default function UserProvider ({children}) {
    const [cardsmap, setCardsmap] = useState(new Map()); //map from deck name to a list of json 
    
    return (
        <UserContext.Provider value={{cardsmap}}>
            {children}
        </UserContext.Provider>
    )
}