import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

export default function ProfileScreen() {
  const { user, logout } = useContext(AppContext);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* AVATAR TOP MODULE CARD */}
      <View style={styles.pCard}>
        <View style={styles.iconCircle}>
          <Ionicons name="person" size={32} color="#F4B41A" />
        </View>
        <Text style={styles.uName}>{user?.name || 'Account Owner'}</Text>
        <Text style={styles.uEmail}>{user?.email || 'client@hive.com'}</Text>
      </View>

      {/* STATIC ACCESS MAPPINGS TABS TABS */}
      <View style={styles.menuBox}>
        <TouchableOpacity style={styles.rowTab}><Text style={styles.rowText}>Manage Profile</Text></TouchableOpacity>
        <TouchableOpacity style={styles.rowTab}><Text style={styles.rowText}>Payment Gateway</Text></TouchableOpacity>
        <TouchableOpacity style={styles.rowTab}><Text style={styles.rowText}>Security Configuration</Text></TouchableOpacity>
        <TouchableOpacity style={styles.rowTab}><Text style={styles.rowText}>Support Center</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutTxt}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  pCard: { alignItems: 'center', marginVertical: 20, backgroundColor: '#FAFAFA', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: '#EEE' },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF9E6', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#FFE4B3' },
  uName: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  uEmail: { fontSize: 13, color: '#666', marginTop: 2 },
  menuBox: { marginBottom: 30 },
  rowTab: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  rowText: { fontSize: 14, color: '#333', fontWeight: '500' },
  logoutBtn: { borderHeight: 1, borderColor: '#FF3B30', borderWidth: 1, height: 46, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  logoutTxt: { color: '#FF3B30', fontWeight: 'bold', fontSize: 14 }
});