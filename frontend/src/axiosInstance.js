import axios from 'axios';

const TOKEN_KEY = 'todo_token';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

// Attach the saved token to every request
axiosInstance.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If the token is rejected, drop it and send the user back to the login screen
axiosInstance.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            clearToken();
            window.dispatchEvent(new Event('auth-expired'));
        }
        return Promise.reject(err);
    }
);

export default axiosInstance;
