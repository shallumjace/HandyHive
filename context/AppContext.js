import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { initializeDatabase, getData, saveData, registerUserInStorage } from '../data/database';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- Core Navigation and Session States ---
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('Welcome');
  const [screenParam, setScreenParam] = useState(null); 

  // --- Dynamic Application Database Core States ---
  const [admins, setAdmins] = useState([]);
  const [clients, setClients] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);

  // --- Initialize Storage on Launch ---
  useEffect(() => {
    const bootstrapAsync = async () => {
      await initializeDatabase();
      const loadedAdmins = await getData('ADMINS');
      const loadedClients = await getData('CLIENTS');
      const loadedWorkers = await getData('WORKERS');
      const loadedCategories = await getData('CATEGORIES');
      const loadedBookings = await getData('BOOKINGS');

      setAdmins(loadedAdmins);
      setClients(loadedClients);
      setWorkers(loadedWorkers);
      setCategories(loadedCategories);
      setBookings(loadedBookings);
    };
    bootstrapAsync();
  }, []);

  // --- Navigation Core Controller ---
  const navigate = (screenName, param = null) => {
    setCurrentScreen(screenName);
    if (param) setScreenParam(param);
  };

  // --- Global Unified Authentication Engine ---
  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check Admins
    const adminFound = admins.find(a => a.email.toLowerCase() === normalizedEmail && a.password === password);
    if (adminFound) {
      setUser({ ...adminFound, role: 'Admin' });
      navigate('AdminHome');
      return;
    }

    // Check Workers
    const workerFound = workers.find(w => w.email.toLowerCase() === normalizedEmail && w.password === password);
    if (workerFound) {
      setUser({ ...workerFound, role: 'Worker' });
      navigate('WorkerHome');
      return;
    }

    // Check Clients
    const clientFound = clients.find(c => c.email.toLowerCase() === normalizedEmail && c.password === password);
    if (clientFound) {
      setUser({ ...clientFound, role: 'Client' });
      navigate('Home');
      return;
    }

    Alert.alert('Authentication Failed', 'Invalid credentials or matching user path not found.');
  };

  const logout = () => {
    setUser(null);
    setCurrentScreen('Login');
  };

  // --- Admin Feature Actions Layer ---
  const addCategory = async (newCatName) => {
    if (!newCatName || categories.includes(newCatName)) return false;
    const updated = [...categories, newCatName];
    setCategories(updated);
    await saveData('CATEGORIES', updated);
    return true;
  };

  const deleteCategory = async (catName) => {
    const updatedCats = categories.filter(c => c !== catName);
    setCategories(updatedCats);
    await saveData('CATEGORIES', updatedCats);

    const updatedWorkers = workers.filter(w => w.specialty !== catName);
    setWorkers(updatedWorkers);
    await saveData('WORKERS', updatedWorkers);
    return true;
  };

  const deleteUserAccount = async (userId, role) => {
    if (role === 'Client') {
      const updated = clients.filter(c => c.id !== userId);
      setClients(updated);
      await saveData('CLIENTS', updated);
    } else if (role === 'Worker') {
      const updated = workers.filter(w => w.id !== userId);
      setWorkers(updated);
      await saveData('WORKERS', updated);
    }
  };

  const createAdminAccount = async (name, email, password) => {
    const allUsers = [...admins, ...clients, ...workers];
    if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      Alert.alert('Registration Error', 'Email is already assigned to an existing profile.');
      return false;
    }
    const newAdmin = { id: `admin${admins.length + 1}`, name, email, password, role: 'Admin' };
    const updated = [...admins, newAdmin];
    setAdmins(updated);
    await saveData('ADMINS', updated);
    return true;
  };

  // --- Booking Operations Layer ---
  const updateBookingStatus = async (bookingId, nextStatus) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: nextStatus } : b);
    setBookings(updated);
    await saveData('BOOKINGS', updated);
  };

  return (
    <AppContext.Provider value={{
      user, currentScreen, screenParam, admins, clients, workers, categories, bookings, selectedWorkerId,
      setSelectedWorkerId, navigate, login, logout, addCategory, deleteCategory, deleteUserAccount, createAdminAccount, updateBookingStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};