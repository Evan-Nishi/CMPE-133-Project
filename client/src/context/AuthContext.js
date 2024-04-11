import React from "react";
import {createContext, useReducer, useEffect} from "react";


export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {user: action.payload }
        case 'LOGOUT':
            return {user: null}
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
         user: null
    })

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await fetch('/session', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                console.log('Session data:', data.user);
                dispatch({ type: 'LOGIN', payload: data.user });
            } catch (error) {
                console.error('Error restoring session:', error);
                dispatch({ type: 'LOGOUT' });
            }
        };

        restoreSession();
    }, []);

    

    console.log('login state:', state)

    return (
        <AuthContext.Provider value = {{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}