import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

export default function ProfileAdmin() {
  const { user, createAdminAccount, logout } = useContext(AppContext);
  const [activeMenu, setActiveMenu] = useState('Overview'); 
  

  const [admName, setAdmName] = useState('');
  const [admEmail, setAdmEmail] = useState('');
  const [admPass, setAdmPass] = useState('');

  const executeAdminCreation = async () => {
    if (!admName || !admEmail || !admPass) {
      Alert.alert('Form Error', 'All registration credential entry boxes must be filled.');
      return;
    }
    const success = await createAdminAccount(admName, admEmail, admPass);
    if (success) {
      setAdmName('');
      setAdmEmail('');
      setAdmPass('');
      setActiveMenu('Overview');
      Alert.alert('Success', 'New authority sub-admin record initialized within system storage.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>System Account Manager</Text>

      {/* ==========================================
          ADMIN AVATAR PROFILE TOP SUMMARY
          ========================================== */}
      <View style={styles.profileCard}>
        <View style={styles.avatarLarge}>
          <Ionicons name="shield-checkmark" size={36} color="#F4B41A" />
        </View>
        <Text style={styles.name}>{user?.name || 'Root Administrator'}</Text>
        <Text style={styles.sub}>{user?.email || 'admin@hive.com'}</Text>
        <View style={styles.badgeLabelContainer}><Text style={styles.badgeText}>SYSTEM CONTROL PRIVILEGES</Text></View>
      </View>

      {/* ==========================================
          DYNAMIC SUB-MENU TOGGLE BLOCK
          ========================================== */}
      {activeMenu === 'Overview' && (
        <View style={styles.menuList}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setActiveMenu('AddAdmin')}>
            <Text style={styles.menuText}>Add Admin Account</Text>
            <Ionicons name="chevron-forward" size={16} color="#CCC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setActiveMenu('StaticEdit')}>
            <Text style={styles.menuText}>Edit Profile Configuration</Text>
            <Ionicons name="chevron-forward" size={16} color="#CCC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Global Security Parameters</Text>
            <Ionicons name="chevron-forward" size={16} color="#CCC" />
          </TouchableOpacity>
        </View>
      )}

      {/* "ADD ADMIN" SECTION MODE */}
      {activeMenu === 'AddAdmin' && (
        <View style={styles.subPanelPane}>
          <View style={styles.panelHeaderRow}>
            <Text style={styles.panelLabel}>Add an Admin Account</Text>
            <TouchableOpacity onPress={() => setActiveMenu('Overview')}><Text style={styles.cancelTxt}>Back</Text></TouchableOpacity>
          </View>
          <TextInput placeholder="Fullname" placeholderTextColor="#999" value={admName} onChangeText={setAdmName} style={styles.fieldBox} />
          <TextInput placeholder="Email" placeholderTextColor="#999" value={admEmail} onChangeText={setAdmEmail} style={styles.fieldBox} autoCapitalize="none" />
          <TextInput placeholder="Password" placeholderTextColor="#999" secureTextEntry value={admPass} onChangeText={setAdmPass} style={styles.fieldBox} />
          <TouchableOpacity style={styles.actionButtonCommit} onPress={executeAdminCreation}>
            <Text style={styles.actionCommitText}>Save New Admin Account</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STATIC EDIT PROFILE PREVIEW */}
      {activeMenu === 'StaticEdit' && (
        <View style={styles.subPanelPane}>
          <View style={styles.panelHeaderRow}>
            <Text style={styles.panelLabel}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setActiveMenu('Overview')}><Text style={styles.cancelTxt}>Back</Text></TouchableOpacity>
          </View>
          <TextInput value={user?.name} editable={false} style={[styles.fieldBox, { backgroundColor: '#F5F5F5', color: '#999' }]} />
          <TextInput value={user?.email} editable={false} style={[styles.fieldBox, { backgroundColor: '#F5F5F5', color: '#999' }]} />
          <Text style={styles.alertNoticeText}>*Not working.</Text>
        </View>
      )}

      {/* ==========================================
          LOGOUT ACTION COMPONENT TERMINAL BUTTON
          ========================================== */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#111', marginVertical: 12 },
  profileCard: { alignItems: 'center', marginBottom: 24, backgroundColor: '#FAFAFA', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  avatarLarge: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFF9E6', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#FFE4B3' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  sub: { color: '#666', fontSize: 13, marginTop: 3 },
  badgeLabelContainer: { marginTop: 10, backgroundColor: '#111', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4 },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5 },
  menuList: { marginBottom: 24 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', alignItems: 'center' },
  menuText: { fontSize: 14, color: '#333', fontWeight: '500' },
  subPanelPane: { backgroundColor: '#FAFAFA', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#EEE', marginBottom: 20 },
  panelHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  panelLabel: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  cancelTxt: { fontSize: 13, color: '#F4B41A', fontWeight: 'bold' },
  fieldBox: { borderWidth: 1, borderColor: '#DDD', height: 44, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#FFF', color: '#111', marginBottom: 10, fontSize: 14 },
  actionButtonCommit: { backgroundColor: '#F4B41A', height: 44, borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  actionCommitText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  alertNoticeText: { fontSize: 11, color: '#999', fontStyle: 'italic', lineHeight: 16, marginTop: 4 },
  logoutBtn: { borderWidth: 1, borderColor: '#FF3B30', height: 46, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', marginTop: 12, marginBottom: 30 },
  logoutText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 14 }
});