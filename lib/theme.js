"use client";

<<<<<<< HEAD
import { createContext, useContext, useEffect } from 'react';
=======
import { createContext, useContext, useEffect, useState } from 'react';
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
<<<<<<< HEAD
  useEffect(() => {
    // Set dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
=======
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}