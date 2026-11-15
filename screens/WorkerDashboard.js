import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

import HomepageWorker from './HomepageWorker';
import AppointmentsWorker from './AppointmentsWorker';
import ProfileWorker from './ProfileWorker';

export default function WorkerDashboard() {
  const { currentScreen, navigate } = useContext(AppContext);

  const renderSubScreen = () => {
    switch (currentScreen) {
      case 'WorkerHome': return <HomepageWorker />;
      case 'WorkerAppointments': return <AppointmentsWorker />;
      case 'WorkerProfile': return <ProfileWorker />;
      default: return <HomepageWorker />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {renderSubScreen()}
      </View>

      {/* ==========================================
          WORKER BOTTOM NAVIGATION BAR
          ========================================== */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('WorkerHome')}>
          <Ionicons name="home" size={22} color={currentScreen === 'WorkerHome' ? '#F4B41A' : '#777'} />
          <Text style={[styles.tabTxt, currentScreen === 'WorkerHome' && styles.activeTxt]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('WorkerAppointments')}>
          <Ionicons name="calendar" size={22} color={currentScreen === 'WorkerAppointments' ? '#F4B41A' : '#777'} />
          <Text style={[styles.tabTxt, currentScreen === 'WorkerAppointments' && styles.activeTxt]}>Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('WorkerProfile')}>
          <Ionicons name="person" size={22} color={currentScreen === 'WorkerProfile' ? '#F4B41A' : '#777'} />
          <Text style={[styles.tabTxt, currentScreen === 'WorkerProfile' && styles.activeTxt]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  tabBar: { flexDirection: 'row', height: 60, borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FFF', paddingBottom: 5 },
  tabBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabTxt: { fontSize: 11, color: '#777', marginTop: 3, fontWeight: '500' },
  activeTxt: { color: '#F4B41A', fontWeight: 'bold' }
});