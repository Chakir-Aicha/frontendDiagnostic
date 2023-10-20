import { createContext, useContext, useState } from "react";

const StateContext = createContext({

    currentUser:{},
    userToken:null,
    setCurrentUser:()=>{},
    setUserToken:()=>{}
});

export const ContextProvider=({children})=>{
    const [currentUser,setCurrentUser]=useState({});
    const [userToken,_setUserToken]=useState(localStorage.getItem('TOKEN')||'')
    const setUserToken=(token)=>{
        if(token){
            //on va stocker le token dans le stockage du navigateur
            //car si je fais un reload au page je veux rester autorise c-a-d rester sur la meme page dont j'ai accede
            localStorage.setItem('TOKEN',token)
        }else{
            localStorage.removeItem('TOKEN')
        }
        _setUserToken(token);
    }

    return(
        <StateContext.Provider value={{
            currentUser,
            setCurrentUser,
            userToken,
            setUserToken

        }}>
            {children}



        </StateContext.Provider>
    )
}
// eslint-disable-next-line react-hooks/rules-of-hooks
export const userStateContext=()=>useContext(StateContext);