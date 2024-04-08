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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, rememberMe})
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        } else {
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });
            navigate('/'); // Redirect to home page

        }
        
    };

    return { login, error };
};

export default useLogin;
