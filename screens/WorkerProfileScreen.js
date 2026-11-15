import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function WorkerProfileScreen() {
  const { selectedWorkerId, workers, navigate } = useContext(AppContext);

  const workerProfile = workers.find(w => w.id === selectedWorkerId);

  if (!workerProfile) {
    return (
      <View style={styles.errorBox}>
        <Text>Profile node target lost. Return to cluster feed.</Text>
        <TouchableOpacity onPress={() => navigate('Home')}><Text style={{ color: '#F4B41A' }}>Back</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER COVER CARD */}
        <View style={styles.profileHeaderCard}>
          <Text style={styles.pName}>{workerProfile.name}</Text>
          <Text style={styles.pSpec}>{workerProfile.specialty} Specialist</Text>
          <Text style={styles.pRate}>{workerProfile.rate}</Text>
        </View>

        {/* METADATA STRUCT TABLE */}
        <Text style={styles.sectionHeader}>Profile Specifications</Text>
        <View style={styles.infoSheet}>
          <Text style={styles.rowItem}><Text style={styles.labelField}>Age Context:</Text> {workerProfile.age} Years Old</Text>
          <Text style={styles.rowItem}><Text style={styles.labelField}>Gender Construct:</Text> {workerProfile.sex}</Text>
          <Text style={styles.rowItem}><Text style={styles.labelField}>Birthdate Tracker:</Text> {workerProfile.birthday}</Text>
          <Text style={styles.rowItem}><Text style={styles.labelField}>Contact Matrix:</Text> {workerProfile.phone}</Text>
          <Text style={styles.rowItem}><Text style={styles.labelField}>Credentials:</Text> {workerProfile.certificate}</Text>
        </View>

        {/* BIO BIO SECTION */}
        <Text style={styles.sectionHeader}>Professional Biography</Text>
        <View style={styles.bioCard}>
          <Text style={styles.bioText}>"{workerProfile.bio}"</Text>
        </View>
      </ScrollView>

      {/* FOOTER COMMIT ACTION TRUCK */}
      <View style={styles.actionDock}>
        <TouchableOpacity style={styles.dockBackBtn} onPress={() => navigate('Home')}>
          <Text style={styles.backBtnText}>Exit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dockBookBtn} onPress={() => navigate('BookAppointmentScreen')}>
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  errorBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileHeaderCard: { backgroundColor: '#111', padding: 24, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  pName: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  pSpec: { fontSize: 14, color: '#F4B41A', marginTop: 4, fontWeight: '600' },
  pRate: { fontSize: 16, color: '#4CD964', marginTop: 8, fontWeight: 'bold' },
  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#666', uppercase: true, marginBottom: 8, marginTop: 10 },
  infoSheet: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEE', padding: 14, borderRadius: 8, marginBottom: 16 },
  rowItem: { fontSize: 14, color: '#333', marginBottom: 6 },
  labelField: { fontWeight: 'bold', color: '#555' },
  bioCard: { backgroundColor: '#FFF9E6', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#FFE4B3', marginBottom: 80 },
  bioText: { fontSize: 14, fontStyle: 'italic', color: '#555', lineHeight: 20 },
  actionDock: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FFF' },
  dockBackBtn: { flex: 1, height: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA', borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: '#DDD' },
  backBtnText: { color: '#666', fontWeight: 'bold' },
  dockBookBtn: { flex: 2, height: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4B41A', borderRadius: 8 },
  bookBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 }
});