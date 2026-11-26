// ==========================================
// HANDY HIVE MOBILE APP
// ==========================================
// practice adding global account

import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppProvider, AppContext } from './context/AppContext';

// ==========================================
// 1. AUTHENTICATION SCREENS
// ==========================================
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterRoleScreen from './screens/RegisterRoleScreen';
import RegisterFormScreen from './screens/RegisterFormScreen';

// ==========================================
// 2. CLIENT SCREENS
// ==========================================
import HomeScreen from './screens/HomeScreen';
import AppointmentsScreen from './screens/AppointmentsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import WorkerProfileScreen from './screens/WorkerProfileScreen';
import BookAppointmentScreen from './screens/BookAppointmentScreen';

// ==========================================
// 3. WORKER SCREENS 
// ==========================================
import HomepageWorker from './screens/HomepageWorker';
import AppointmentsWorker from './screens/AppointmentsWorker';
import ProfileWorker from './screens/ProfileWorker';

// ==========================================
// 4. ADMIN SCREENS 
// ==========================================
import HomepageAdmin from './screens/HomepageAdmin';
import CategoryListingAdmin from './screens/CategoryListingAdmin';
import UsersAdmin from './screens/UsersAdmin';
import ProfileAdmin from './screens/ProfileAdmin';

function AppContent() {
  const { currentScreen, navigate, user, ready } = useContext(AppContext);

  if (!ready) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Loading Handy Hive...</Text></View>;

  // ----------------------------------------------------
  //  AUTHENTICATION (No User Logged In)
  // ----------------------------------------------------
  if (!user) {
    if (currentScreen === 'RegisterRoleScreen') return <RegisterRoleScreen />;
    if (currentScreen === 'RegisterFormScreen') return <RegisterFormScreen />;
    if (currentScreen === 'Login') return <LoginScreen />;
    return <WelcomeScreen />; 
  }

  // ----------------------------------------------------
  //  ADMIN DASHBOARD LAYOUT & NAVIGATION
  // ----------------------------------------------------
  if (user.role === 'Admin') {
    const renderAdminContent = () => {
      switch (currentScreen) {
        case 'AdminHome': return <HomepageAdmin />;
        case 'AdminCategories': return <CategoryListingAdmin />;
        case 'AdminUsers': return <UsersAdmin />;
        case 'AdminProfile': return <ProfileAdmin />;
        default: return <HomepageAdmin />;
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>{renderAdminContent()}</View>
        <View style={styles.tabBar}> 
          
          <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('AdminHome')}>
            <Ionicons name="stats-chart" size={20} color={currentScreen === 'AdminHome' ? '#EB5757' : '#777'} />
            <Text style={[styles.tabTxt, currentScreen === 'AdminHome' && styles.activeAdminTxt]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('AdminCategories')}>  
            <Ionicons name="construct" size={20} color={currentScreen === 'AdminCategories' ? '#EB5757' : '#777'} />
            <Text style={[styles.tabTxt, currentScreen === 'AdminCategories' && styles.activeAdminTxt]}>Category</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('AdminUsers')}>
            <Ionicons name="people" size={20} color={currentScreen === 'AdminUsers' ? '#EB5757' : '#777'} />
            <Text style={[styles.tabTxt, currentScreen === 'AdminUsers' && styles.activeAdminTxt]}>Users</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('AdminProfile')}>
            <Ionicons name="settings" size={20} color={currentScreen === 'AdminProfile' ? '#EB5757' : '#777'} />
            <Text style={[styles.tabTxt, currentScreen === 'AdminProfile' && styles.activeAdminTxt]}>Profile</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  //  WORKER DASHBOARD LAYOUT & NAVIGATION
  // ----------------------------------------------------
  if (user.role === 'Worker') {
    const renderWorkerContent = () => {
      switch (currentScreen) {
        case 'WorkerHome': return <HomepageWorker />;
        case 'WorkerAppointments': return <AppointmentsWorker />;
        case 'WorkerProfile': return <ProfileWorker />;
        default: return <HomepageWorker />;
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>{renderWorkerContent()}</View>
        <View style={styles.tabBar}>

          <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('WorkerHome')}>
            <Ionicons name="briefcase" size={20} color={currentScreen === 'WorkerHome' ? '#2F80ED' : '#777'} />
            <Text style={[styles.tabTxt, currentScreen === 'WorkerHome' && styles.activeWorkerTxt]}>Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('WorkerAppointments')}>
            <Ionicons name="clipboard" size={20} color={currentScreen === 'WorkerAppointments' ? '#2F80ED' : '#777'} />
            <Text style={[styles.tabTxt, currentScreen === 'WorkerAppointments' && styles.activeWorkerTxt]}>Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('WorkerProfile')}>
            <Ionicons name="person" size={20} color={currentScreen === 'WorkerProfile' ? '#2F80ED' : '#777'} />
            <Text style={[styles.tabTxt, currentScreen === 'WorkerProfile' && styles.activeWorkerTxt]}>Profile</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // CLIENT DASHBOARD LAYOUT & NAVIGATION
  // ----------------------------------------------------
  if (currentScreen === 'WorkerProfileScreen') return <WorkerProfileScreen />;
  if (currentScreen === 'BookAppointmentScreen') return <BookAppointmentScreen />;

  const renderClientContent = () => {
    switch (currentScreen) {
      case 'Home': return <HomeScreen />;
      case 'AppointmentsScreen': return <AppointmentsScreen />;
      case 'NotificationsScreen': return <NotificationsScreen />;
      case 'ProfileScreen': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>{renderClientContent()}</View>
      <View style={styles.tabBar}>

        <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('Home')}>
          <Ionicons name="home" size={20} color={currentScreen === 'Home' ? '#F4B41A' : '#777'} />
          <Text style={[styles.tabTxt, currentScreen === 'Home' && styles.activeClientTxt]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('AppointmentsScreen')}>
          <Ionicons name="calendar" size={20} color={currentScreen === 'AppointmentsScreen' ? '#F4B41A' : '#777'} />
          <Text style={[styles.tabTxt, currentScreen === 'AppointmentsScreen' && styles.activeClientTxt]}>Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('NotificationsScreen')}>
          <Ionicons name="notifications" size={20} color={currentScreen === 'NotificationsScreen' ? '#F4B41A' : '#777'} />
          <Text style={[styles.tabTxt, currentScreen === 'NotificationsScreen' && styles.activeClientTxt]}>Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('ProfileScreen')}>
          <Ionicons name="person" size={20} color={currentScreen === 'ProfileScreen' ? '#F4B41A' : '#777'} />
          <Text style={[styles.tabTxt, currentScreen === 'ProfileScreen' && styles.activeClientTxt]}>Profile</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}

// ==========================================
// SYSTEM THEMING SHEET
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  tabBar: { 
    flexDirection: 'row', 
    height: 65, 
    borderTopWidth: 1, 
    borderTopColor: '#EEE', 
    backgroundColor: '#FFF', 
    alignItems: 'center' 
  },
  tabBtn: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100%' 
  },
  tabTxt: { 
    fontSize: 10, 
    color: '#777', 
    fontWeight: '500',
    marginTop: 4 
  },
  
 
  activeClientTxt: { color: '#F4B41A', fontWeight: 'bold' }, 
  activeWorkerTxt: { color: '#2F80ED', fontWeight: 'bold' }, 
  activeAdminTxt: { color: '#EB5757', fontWeight: 'bold' }   
});