import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

export default function HomepageWorker() {
  const { user, bookings } = useContext(AppContext);

  const activeJobs = bookings.filter(b => b.workerId === user?.id && b.status === 'Upcoming');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.mainTitle}>Welcome back, {user?.name.split(' ')[0]}!</Text>
      
      {/* ==========================================
          METRICS TABLE
          ========================================== */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricBox}>
          <Ionicons name="briefcase-outline" size={28} color="#F4B41A" />
          <Text style={styles.metricVal}>{activeJobs.length}</Text>
          <Text style={styles.metricLbl}>Confirmed Jobs</Text>
        </View>
      </View>

      {/* ==========================================
          SUMMARY OF ACCEPTED APPOINTMENTS
          ========================================== */}
      <Text style={styles.sectionHeader}>Your Upcoming Itinerary</Text>
      
      {activeJobs.length === 0 ? (
        <View style={styles.emptyStateBox}>
          <Text style={styles.emptyStateText}>You have no confirmed jobs right now.</Text>
        </View>
      ) : (
        activeJobs.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.cardHeader}>
              <View>
                 <Text style={styles.dateLabel}>{job.date}</Text>
                 <Text style={styles.dateLabel}>{job.time}</Text>
              </View>
              <Text style={styles.statusBadge}>ACCEPTED</Text>
            </View>
            <Text style={styles.infoText}><Text style={styles.boldField}>Client:</Text> {job.clientName}</Text>
            <Text style={styles.infoText}><Text style={styles.boldField}>Phone:</Text> {job.clientPhone}</Text>
            <Text style={styles.infoText}><Text style={styles.boldField}>Type of Work:</Text> {job.service}</Text>
            <Text style={styles.infoText}><Text style={styles.boldField}>Location:</Text> {job.location}</Text>
            
            {job.notes ? (
               <View style={styles.notesBox}>
                 <Text style={styles.notesText}>"{job.notes}"</Text>
               </View>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#111', marginVertical: 12 },
  metricsContainer: { flexDirection: 'row', marginBottom: 24 },
  metricBox: { flex: 1, backgroundColor: '#FFF9E6', padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#FBEAA6' },
  metricVal: { fontSize: 28, fontWeight: 'bold', color: '#111', marginVertical: 6 },
  metricLbl: { fontSize: 12, color: '#666', fontWeight: 'bold', textTransform: 'uppercase' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 12 },
  jobCard: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEE', borderRadius: 10, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 8 },
  dateLabel: { fontSize: 14, fontWeight: 'bold', color: '#F4B41A' },
  statusBadge: { fontSize: 10, fontWeight: 'bold', color: '#FFF', backgroundColor: '#4CD964', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  infoText: { fontSize: 14, color: '#333', marginBottom: 4 },
  boldField: { fontWeight: '600', color: '#555' },
  notesBox: { marginTop: 8, backgroundColor: '#F0F0F0', padding: 10, borderRadius: 6 },
  notesText: { fontStyle: 'italic', color: '#555', fontSize: 13 },
  emptyStateBox: { padding: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA', borderRadius: 10, borderWidth: 1, borderColor: '#EEE' },
  emptyStateText: { color: '#999', fontSize: 14 }
});