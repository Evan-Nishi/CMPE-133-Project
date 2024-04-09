// useSignup.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext} from './useAuthContext';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const login = async (username, password, rememberMe) => {
        setError(null);
        const response = await fetch('/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, rememberMe})
        });
        const json = await response.json();

        console.log('login response:', json);

        if (!response.ok) {
            setError(json.error);
        } else {
            dispatch({ type: 'LOGIN', payload: json });
            navigate('/'); 

        }
        
    };

    return { login, error };
};

export default useLogin;
