import React, { useState } from 'react';
import axiosInstance, { setToken } from './axiosInstance';
import './App.css';

function Auth({ onLoggedIn }) {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const isSignup = mode === 'signup';

    function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setBusy(true);

        axiosInstance.post(isSignup ? '/auth/signup' : '/auth/login', { email, password })
            .then(res => {
                setToken(res.data.token);
                onLoggedIn(res.data.email);
            })
            .catch(err => {
                setError(err.response?.data?.error || 'Something went wrong. Is the backend running?');
            })
            .finally(() => setBusy(false));
    }

    function switchMode() {
        setMode(isSignup ? 'login' : 'signup');
        setError("");
    }

    return (
        <div className="todolist">
            <h1>{isSignup ? 'Sign Up' : 'Log In'}</h1>

            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    required
                />
                <button className="add-button" type="submit" disabled={busy}>
                    {busy ? 'Please wait...' : (isSignup ? 'Create Account' : 'Log In')}
                </button>
            </form>

            {error && <p className="auth-error">{error}</p>}

            <p className="auth-switch">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button className="link-button" type="button" onClick={switchMode}>
                    {isSignup ? 'Log in' : 'Sign up'}
                </button>
            </p>
        </div>
    );
}

export default Auth;
