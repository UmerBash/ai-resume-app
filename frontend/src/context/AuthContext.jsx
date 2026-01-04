import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for user/token
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data) {
            setUser(response.data);
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        if (response.data) {
            setUser(response.data);
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    };

    const loginWithGoogle = async (token, type = 'accessToken') => {
        const payload = type === 'accessToken' ? { accessToken: token } : { idToken: token };
        const response = await api.post('/auth/google', payload);
        if (response.data) {
            setUser(response.data);
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('lastResumeText');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loginWithGoogle, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
