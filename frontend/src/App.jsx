import React, { useState, useEffect } from 'react';
import ToDoList from './ToDoList';
import Auth from './Auth';
import axiosInstance, { getToken, clearToken } from './axiosInstance';

function App() {
    const [email, setEmail] = useState(null);
    const [checking, setChecking] = useState(Boolean(getToken()));

    // A saved token might be expired, so confirm it with the backend on load
    useEffect(() => {
        if (!getToken()) return;

        axiosInstance.get('/auth/me')
            .then(res => setEmail(res.data.email))
            .catch(() => clearToken())
            .finally(() => setChecking(false));
    }, []);

    // The axios interceptor fires this when a request comes back 401
    useEffect(() => {
        function handleExpired() {
            setEmail(null);
        }
        window.addEventListener('auth-expired', handleExpired);
        return () => window.removeEventListener('auth-expired', handleExpired);
    }, []);

    function logout() {
        clearToken();
        setEmail(null);
    }

    if (checking) {
        return <div className="App"><div className="todolist"><h1>Loading...</h1></div></div>;
    }

    return (
        <div className="App">
            {email
                ? <ToDoList email={email} onLogout={logout} />
                : <Auth onLoggedIn={setEmail} />}
        </div>
    );
}

export default App;
