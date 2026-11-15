import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

export default function ProfileWorker() {
  const { user, logout } = useContext(AppContext);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* ==========================================
          WORKER PROFILE HEADER
          ========================================== */}
      <View style={styles.headerCard}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarInitial}>{user?.name?.charAt(0) || 'W'}</Text>
        </View>
        <Text style={styles.workerName}>{user?.name || 'Worker Name'}</Text>
        <Text style={styles.workerSpec}>{user?.specialty || 'Service'} Specialist</Text>
        <Text style={styles.workerRate}>Rate: {user?.rate || '₱0/hr'}</Text>
      </View>

      {/* ==========================================
          STATIC CONFIGURATION TABS
          ========================================== */}
      <View style={styles.optionsList}>
        <TouchableOpacity style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Ionicons name="settings-outline" size={20} color="#555" />
            <Text style={styles.optionText}>Manage Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Ionicons name="ribbon-outline" size={20} color="#555" />
            <Text style={styles.optionText}>Certifications & Bio</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Ionicons name="time-outline" size={20} color="#555" />
            <Text style={styles.optionText}>Working Hours & Schedule</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Ionicons name="help-buoy-outline" size={20} color="#555" />
            <Text style={styles.optionText}>Support Center</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
      </View>

      {/* ==========================================
          LOGOUT COMPONENT
          ========================================== */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  headerCard: { alignItems: 'center', backgroundColor: '#FAFAFA', paddingVertical: 30, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', marginBottom: 24 },
  avatarWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF9E6', borderWidth: 2, borderColor: '#F4B41A', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarInitial: { fontSize: 32, fontWeight: 'bold', color: '#F4B41A' },
  workerName: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  workerSpec: { fontSize: 14, color: '#666', marginTop: 4 },
  workerRate: { fontSize: 14, fontWeight: 'bold', color: '#4CD964', marginTop: 8 },
  optionsList: { marginBottom: 30 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionText: { fontSize: 15, color: '#333', marginLeft: 12, fontWeight: '500' },
  logoutButton: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FF3B30', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 40 },
  logoutText: { color: '#FF3B30', fontSize: 15, fontWeight: 'bold' }
});