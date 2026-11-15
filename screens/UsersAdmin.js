import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

export default function UsersAdmin() {
  const { clients, workers, deleteUserAccount } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('Client'); 
  const [targetUser, setTargetUser] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);

  const triggerModalView = (userObj) => {
    setTargetUser(userObj);
    setModalVisible(true);
  };

  const handleAccountErase = () => {
    Alert.alert(
      'Account Deletion Request',
      `Are you absolute certain you want to destroy records for ${targetUser.name}? This cannot be undone.`,
      [
        { text: 'Abort Action', style: 'cancel' },
        { 
          text: 'Erase Account', 
          style: 'destructive', 
          onPress: async () => {
            await deleteUserAccount(targetUser.id, activeTab);
            setModalVisible(false);
            setTargetUser(null);
            Alert.alert('Cleared', 'Account wiped successfully from storage blocks.');
          } 
        }
      ]
    );
  };

  const displayList = activeTab === 'Client' ? clients : workers;

  return (
    <View style={styles.container}>
      <Text style={styles.headerHeadline}>System User Directory</Text>

      {/* ==========================================
          DIRECTORY FILTER SUB-TABS BAR
          ========================================== */}
      <View style={styles.tabContainerRow}>
        <TouchableOpacity style={[styles.subTab, activeTab === 'Client' && styles.subTabActive]} onPress={() => setActiveTab('Client')}>
          <Text style={[styles.subTabTxt, activeTab === 'Client' && styles.subTabTxtActive]}>Clients Base ({clients.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.subTab, activeTab === 'Worker' && styles.subTabActive]} onPress={() => setActiveTab('Worker')}>
          <Text style={[styles.subTabTxt, activeTab === 'Worker' && styles.subTabTxtActive]}>Workers Base ({workers.length})</Text>
        </TouchableOpacity>
      </View>

      {/* ==========================================
          USER DIRECTORY LIST CONTENT
          ========================================== */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {displayList.map((user) => (
          <TouchableOpacity key={user.id} style={styles.userCardRow} onPress={() => triggerModalView(user)}>
            <View style={styles.avatarHolderPlaceholder}>
              <Text style={styles.avatarInitialText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.profileMainNameText}>{user.name}</Text>
              <Text style={styles.profileSubDescText}>{user.id} • {user.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#CCC" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ==========================================
          DYNAMIC USER PROFILE MODAL VIEWER
          ========================================== */}
      {targetUser && (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalShadeWrapper}>
            <View style={styles.modalContentPane}>
              <View style={styles.modalHeaderCloseRow}>
                <Text style={styles.modalHeaderTitle}>User Profile</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#111" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.scrollDetails} showsVerticalScrollIndicator={false}>
                <Text style={styles.detailItemText}><Text style={styles.modalLabelField}>ID:</Text> {targetUser.id}</Text>
                <Text style={styles.detailItemText}><Text style={styles.modalLabelField}>Full Name:</Text> {targetUser.name}</Text>
                <Text style={styles.detailItemText}><Text style={styles.modalLabelField}>Email Address:</Text> {targetUser.email}</Text>
                <Text style={styles.detailItemText}><Text style={styles.modalLabelField}>Classification:</Text> {targetUser.role}</Text>
                <Text style={styles.detailItemText}><Text style={styles.modalLabelField}>Sex:</Text> {targetUser.sex}</Text>
                <Text style={styles.detailItemText}><Text style={styles.modalLabelField}>Age:</Text> {targetUser.age} yrs old</Text>
                <Text style={styles.detailItemText}><Text style={styles.modalLabelField}>Birthdate:</Text> {targetUser.birthday}</Text>
                <Text style={styles.detailItemText}><Text style={styles.modalLabelField}>Phone Number:</Text> {targetUser.phone}</Text>
                
                {activeTab === 'Worker' && (
                  <>
                    <Text style={styles.detailItemText}><Text style={styles.modalLabelField}>Specialty:</Text> {targetUser.specialty}</Text>
                    <Text style={styles.detailItemText}><Text style={styles.modalLabelField}>Rate:</Text> {targetUser.rate}</Text>
                    <Text style={styles.detailItemText}><Text style={styles.modalLabelField}>Bio:</Text> {targetUser.bio}</Text>
                    <Text style={styles.detailItemText}><Text style={styles.modalLabelField}>Credentials/Certifications:</Text> {targetUser.certificate}</Text>
                  </>
                )}
              </ScrollView>

              <TouchableOpacity style={styles.destructivePurgeButton} onPress={handleAccountErase}>
                <Ionicons name="trash-sharp" size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.destructivePurgeText}>Terminate Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  headerHeadline: { fontSize: 22, fontWeight: 'bold', color: '#111', marginVertical: 12 },
  tabContainerRow: { flexDirection: 'row', backgroundColor: '#F5F5F5', padding: 4, borderRadius: 8, marginBottom: 16 },
  subTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  subTabActive: { backgroundColor: '#FFF', elevation: 1 },
  subTabTxt: { fontSize: 13, color: '#666', fontWeight: '500' },
  subTabTxtActive: { color: '#F4B41A', fontWeight: 'bold' },
  userCardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  avatarHolderPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF9E6', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFE4B3' },
  avatarInitialText: { color: '#F4B41A', fontWeight: 'bold', fontSize: 15 },
  profileMainNameText: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  profileSubDescText: { fontSize: 12, color: '#666', marginTop: 1 },
  modalShadeWrapper: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContentPane: { backgroundColor: '#FFF', borderRadius: 12, padding: 20, maxHeight: '80%' },
  modalHeaderCloseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10, marginBottom: 14 },
  modalHeaderTitle: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  scrollDetails: { paddingBottom: 12 },
  detailItemText: { fontSize: 13, color: '#333', marginBottom: 8, lineHeight: 18 },
  modalLabelField: { fontWeight: 'bold', color: '#555' },
  destructivePurgeButton: { backgroundColor: '#FF3B30', height: 44, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  destructivePurgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});