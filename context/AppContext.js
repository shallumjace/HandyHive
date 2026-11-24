import React, { createContext, useState, useEffect } from 'react';
import { notice } from '../utils/feedback';
import { initializeDatabase, getData, saveData, registerUserInStorage } from '../data/database';
import {
  newId, nowISO, normalizeWorker, parseMoney, validFutureDate,
  updateScheduleRecord, changeBookingStatusRecord, ensureUniqueReview,
} from '../data/domain';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Welcome');
  const [screenParam, setScreenParam] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [clients, setClients] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [archivedCategories, setArchivedCategories] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reports, setReports] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await initializeDatabase();
        const [a,c,w,cats,b,r,rev,n,arch] = await Promise.all([
          getData('ADMINS'), getData('CLIENTS'), getData('WORKERS'),
          getData('CATEGORIES'), getData('BOOKINGS'), getData('REPORTS'),
          getData('REVIEWS'), getData('NOTIFICATIONS'), getData('ARCHIVED_CATEGORIES'),
        ]);
        const normalized = w.map(normalizeWorker);
        // Preserve legacy hourly text for audit. Newly added numbers are provisional.
        if (JSON.stringify(normalized) !== JSON.stringify(w)) await saveData('WORKERS', normalized);
        setAdmins(a); setClients(c); setWorkers(normalized); setCategories(cats);
        setBookings(b); setReports(r); setReviews(rev); setNotifications(n);
        setArchivedCategories(arch);
      } catch (e) {
        notice('Storage error', `Could not load Handy Hive: ${e.message}`);
      } finally { setReady(true); }
    })();
  }, []);

  const navigate = (screen, param = null) => {
    setCurrentScreen(screen);
    setScreenParam(param);
  };
  const persist = async (key, next, setter) => {
    await saveData(key, next);
    setter(next);
    return next;
  };
  const login = (email, password) => {
    const name = String(email).trim().toLowerCase();
    const match = [
      ...admins.map(a => ({...a, role:'Admin'})),
      ...workers.map(w => ({...w, role:'Worker'})),
      ...clients.map(c => ({...c, role:'Client'})),
    ].find(a => a.email?.toLowerCase() === name && a.password === password);
    if (!match) { notice('Login failed', 'Invalid email or password.'); return false; }
    setUser(match);
    navigate(match.role === 'Admin' ? 'AdminHome' : match.role === 'Worker' ? 'WorkerHome' : 'Home');
    return true;
  };
  const logout = () => { setUser(null); navigate('Login'); };
  const asRole = (role) => {
    if (user?.role !== role) throw new Error(`${role} access required.`);
  };
  const addNotification = async (recipientUserId, eventType, message, relatedRecordId) => {
    const next = [...notifications, { id: newId('notify'), recipientUserId, eventType, message, relatedRecordId, createdAt: nowISO(), isRead:false }];
    await persist('NOTIFICATIONS', next, setNotifications);
  };
  const markNotificationRead = async (id) => {
    const found = notifications.find(n => n.id === id);
    if (!found || found.recipientUserId !== user?.id) return;
    await persist('NOTIFICATIONS', notifications.map(n => n.id === id ? {...n, isRead:true} : n), setNotifications);
  };
  const addCategory = async (name) => {
    asRole('Admin');
    const trimmed = String(name).trim();
    if (!trimmed || categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) return false;
    await persist('CATEGORIES', [...categories, trimmed], setCategories);
    return true;
  };
  const archiveCategory = async (name, archived) => {
    asRole('Admin');
    if (!categories.includes(name)) throw new Error('Unknown category.');
    const next = archived ? [...new Set([...archivedCategories, name])] : archivedCategories.filter(c => c !== name);
    await persist('ARCHIVED_CATEGORIES', next, setArchivedCategories);
  };
  const deleteUserAccount = async (id, role) => {
    asRole('Admin');
    // Existing admin feature retained. Historical bookings/reports retain snapshot names.
    if (role === 'Client') await persist('CLIENTS', clients.filter(c => c.id !== id), setClients);
    if (role === 'Worker') await persist('WORKERS', workers.filter(w => w.id !== id), setWorkers);
  };
  const register = async (payload) => {
    if (!ready) throw new Error('Storage is still loading.');
    const valid = { ...payload, name: payload.name?.trim(), email: payload.email?.trim().toLowerCase() };
    if (!valid.name || !/^\S+@\S+\.\S+$/.test(valid.email || '') || !valid.password || valid.password.length < 8) {
      throw new Error('Enter a name, valid email, and password with at least 8 characters.');
    }
    if (payload.role === 'Worker') {
      if (archivedCategories.includes(payload.specialty)) throw new Error('This category is archived.');
      if (!categories.includes(payload.specialty)) throw new Error('Choose an active specialty.');
      const fee = parseMoney(payload.minimumServiceFee);
      if (!(fee > 0)) throw new Error('Minimum service fee must be greater than zero.');
      valid.minimumServiceFee = fee;
      valid.pricingNeedsReview = false;
    }
    const created = await registerUserInStorage(valid);
    if (created.role === 'Client') setClients(prev => [...prev, created]);
    if (created.role === 'Worker') setWorkers(prev => [...prev, created]);
    return created;
  };
  const createBooking = async ({ workerId, date, time, location, notes }) => {
    asRole('Client');
    const worker = workers.find(w => w.id === workerId);
    if (!worker) throw new Error('Service provider not found.');
    if (archivedCategories.includes(worker.specialty)) throw new Error('This service category is archived.');
    if (!validFutureDate(date, time)) throw new Error('Enter a future date (YYYY-MM-DD), and time (HH:mm, 24-hour).');
    if (!location?.trim() || !notes?.trim()) throw new Error('Enter an address and problem description.');
    const booking = {
      id:newId('booking'), clientId:user.id, clientName:user.name, clientPhone:user.phone || '',
      workerId, workerName:worker.name, service:worker.specialty,
      date, time, scheduledAt:`${date}T${time}:00`,
      location:location.trim(), notes:notes.trim(), status:'Pending',
      minimumServiceFee:worker.minimumServiceFee, agreedPrice:null,
      createdAt:nowISO(), updatedAt:nowISO(), rescheduleHistory:[], statusHistory:[],
    };
    await persist('BOOKINGS', [...bookings, booking], setBookings);
    await addNotification(workerId, 'booking-request', `New ${booking.service} request from ${user.name}.`, booking.id);
    return booking;
  };
  const updateBookingStatus = async (bookingId, nextStatus) => {
    asRole('Worker');
    const booking = bookings.find(b => b.id === bookingId && b.workerId === user.id);
    if (!booking) throw new Error('Booking not found for this provider.');
    const next = changeBookingStatusRecord(booking, nextStatus);
    await persist('BOOKINGS', bookings.map(b => b.id === bookingId ? next : b), setBookings);
    await addNotification(booking.clientId, 'booking-status', `Booking ${booking.id}: ${nextStatus}.`, booking.id);
    return next;
  };
  const rescheduleBooking = async (bookingId, date, time) => {
    asRole('Client');
    const b = bookings.find(b => b.id === bookingId && b.clientId === user.id);
    if (!b) throw new Error('Booking not found.');
    const next = updateScheduleRecord(b, date, time);
    await persist('BOOKINGS', bookings.map(x => x.id === b.id ? next : x), setBookings);
    await addNotification(b.workerId, 'reschedule', `${user.name} rescheduled booking ${b.id} to ${date} ${time}.`, b.id);
  };
  const cancelBooking = async (bookingId) => {
    asRole('Client');
    const b = bookings.find(b => b.id === bookingId && b.clientId === user.id);
    if (!b) throw new Error('Booking not found.');
    const next = { ...changeBookingStatusRecord(b, 'Cancelled'), cancelledBy:user.id, cancelledAt:nowISO() };
    await persist('BOOKINGS', bookings.map(x => x.id === b.id ? next : x), setBookings);
    await addNotification(b.workerId, 'cancelled', `${user.name} cancelled booking ${b.id}.`, b.id);
  };
  const submitReview = async (bookingId, stars, review) => {
    asRole('Client');
    const b = bookings.find(x => x.id === bookingId && x.clientId === user.id && x.status === 'Completed');
    if (!b) throw new Error('Only your completed bookings can be rated.');
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) throw new Error('Choose 1–5 stars.');
    ensureUniqueReview(reviews, bookingId, user.id);
    await persist('REVIEWS', [...reviews, { id:newId('review'), bookingId, clientId:user.id, workerId:b.workerId, stars, review:String(review || '').trim(), createdAt:nowISO() }], setReviews);
  };
  const submitReport = async (bookingId, reason, description) => {
    asRole('Client');
    const b = bookings.find(x => x.id === bookingId && x.clientId === user.id && x.status === 'Completed');
    if (!b) throw new Error('Only your completed bookings can be reported here.');
    if (!String(reason).trim() || String(description).trim().length < 10) throw new Error('Enter a reason and description (at least 10 characters).');
    const report = {
      id:newId('report'), bookingId, clientId:user.id, clientName:user.name,
      workerId:b.workerId, workerName:b.workerName, reason:reason.trim(), description:description.trim(),
      status:'Pending', statusHistory:[{ status:'Pending', at:nowISO() }], createdAt:nowISO(), updatedAt:nowISO(),
    };
    await persist('REPORTS', [...reports, report], setReports);
    return report;
  };
  const updateReportStatus = async (reportId, status) => {
    asRole('Admin');
    if (!['Under Investigation', 'Reviewed'].includes(status)) throw new Error('Invalid report status.');
    const r = reports.find(r => r.id === reportId);
    if (!r) throw new Error('Report not found.');
    if (r.status === status) return false;
    const next = { ...r, status, updatedAt:nowISO(), statusHistory:[...(r.statusHistory || []), { status, at:nowISO(), adminId:user.id }] };
    await persist('REPORTS', reports.map(x => x.id === reportId ? next : x), setReports);
    await addNotification(r.clientId, 'report-status', `Your report ${r.id} is now ${status}.`, r.id);
    return true;
  };
  const updateProfile = async (values) => {
    if (!user) throw new Error('Please sign in.');
    const fields = ['name','email','phone','sex','age','birthday','bio','certificate','specialty','availability','serviceArea','minimumServiceFee'];
    const patch = Object.fromEntries(Object.entries(values).filter(([key]) => fields.includes(key)));
    patch.name = String(patch.name ?? user.name).trim();
    patch.email = String(patch.email ?? user.email).trim().toLowerCase();
    if (!patch.name || !/^\S+@\S+\.\S+$/.test(patch.email)) throw new Error('Enter a valid name and email.');
    if ([...admins,...clients,...workers].some(a => a.id !== user.id && a.email?.toLowerCase() === patch.email)) throw new Error('This email is already registered.');
    if (patch.age === '') delete patch.age;
    if (patch.age != null && (!Number.isInteger(Number(patch.age)) || Number(patch.age) < 18 || Number(patch.age) > 110)) throw new Error('Enter an age between 18 and 110.');
    if (patch.age != null) patch.age = Number(patch.age);
    if (user.role === 'Worker') {
      const fee = parseMoney(patch.minimumServiceFee ?? user.minimumServiceFee);
      if (!(fee > 0)) throw new Error('Minimum service fee must be greater than zero.');
      patch.minimumServiceFee = fee;
      patch.pricingNeedsReview = false;
      if (patch.specialty && patch.specialty !== user.specialty && archivedCategories.includes(patch.specialty)) throw new Error('Cannot select an archived category.');
      if (patch.specialty && !categories.includes(patch.specialty)) throw new Error('Unknown service category.');
    }
    const stores = { Admin:[admins,setAdmins,'ADMINS'], Client:[clients,setClients,'CLIENTS'], Worker:[workers,setWorkers,'WORKERS'] };
    const [items,setItems,key] = stores[user.role];
    const updated = { ...user, ...patch, updatedAt:nowISO() };
    await persist(key, items.map(x => x.id === user.id ? updated : x), setItems);
    setUser(updated);
    return updated;
  };
  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    if (!user) throw new Error('Please sign in.');
    if (user.password !== oldPassword) throw new Error('Current password is incorrect.');
    if (newPassword.length < 8) throw new Error('New password must have at least eight characters.');
    if (newPassword !== confirmPassword) throw new Error('Password confirmation does not match.');
    const stores = { Admin:[admins,setAdmins,'ADMINS'], Client:[clients,setClients,'CLIENTS'], Worker:[workers,setWorkers,'WORKERS'] };
    const [items,setItems,key] = stores[user.role];
    await persist(key, items.map(x => x.id === user.id ? {...x,password:newPassword} : x), setItems);
    setUser(prev => ({...prev,password:newPassword}));
  };

  return (
    <AppContext.Provider value={{
      ready,user,currentScreen,screenParam,admins,clients,workers,categories,
      activeCategories: categories.filter(c => !archivedCategories.includes(c)),
      archivedCategories,bookings,reports,reviews,notifications,selectedWorkerId,
      setSelectedWorkerId,navigate,login,logout,register,addCategory,archiveCategory,deleteUserAccount,
      createBooking,updateBookingStatus,rescheduleBooking,cancelBooking,submitReview,submitReport,
      updateReportStatus,addNotification,markNotificationRead,updateProfile,changePassword,
    }}>
      {children}
    </AppContext.Provider>
  );
};
