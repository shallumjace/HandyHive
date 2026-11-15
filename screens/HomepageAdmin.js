import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

export default function HomepageAdmin() {
  const { clients, workers, bookings } = useContext(AppContext);

  const totalActiveBookings = bookings.filter(b => b.status === 'Upcoming' || b.status === 'Pending').length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.mainTitle}>System Control Console</Text>
      
      {/* ==========================================
          METRICS CARDS GRID SYSTEM
          ========================================== */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricBox}>
          <Ionicons name="people-outline" size={24} color="#F4B41A" />
          <Text style={styles.metricVal}>{clients.length}</Text>
          <Text style={styles.metricLbl}>Active Clients</Text>
        </View>
        <View style={styles.metricBox}>
          <Ionicons name="construct-outline" size={24} color="#F4B41A" />
          <Text style={styles.metricVal}>{workers.length}</Text>
          <Text style={styles.metricLbl}>Active Workers</Text>
        </View>
        <View style={styles.metricBox}>
          <Ionicons name="calendar-outline" size={24} color="#F4B41A" />
          <Text style={styles.metricVal}>{totalActiveBookings}</Text>
          <Text style={styles.metricLbl}>Live Bookings</Text>
        </View>
      </View>

      {/* ==========================================
          DYNAMIC ACTIVE BOOKINGS LOG TABLE
          ========================================== */}
      <Text style={styles.sectionHeader}>Active Appointments Log</Text>
      {bookings.filter(b => b.status === 'Upcoming').map((item) => (
        <View key={item.id} style={styles.bookingCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.badgeLabel}>ID: {item.id}</Text>
            <Text style={styles.badgeStatusText}>{item.status}</Text>
          </View>
          <Text style={styles.cardInfoText}><Text style={styles.boldField}>Client:</Text> {item.clientName}</Text>
          <Text style={styles.cardInfoText}><Text style={styles.boldField}>Provider:</Text> {item.workerName} ({item.service})</Text>
          <Text style={styles.cardInfoText}><Text style={styles.boldField}>Schedule:</Text> {item.date}</Text>
          <Text style={styles.cardInfoText}><Text style={styles.boldField}>Location:</Text> {item.location}</Text>
        </View>
      ))}

      {/* ==========================================
          STATIC CLIENT COMPLAINTS & FEEDBACK REPORTS
          ========================================== */}
      <Text style={styles.sectionHeader}>Recent Client Reports Summary</Text>
      <View style={styles.reportBox}>
        <Text style={styles.reportAuthor}>Reported by: John Smith (client2)</Text>
        <Text style={styles.reportContent}>"Worker arrived 15 minutes late for the appointment schedule, but the patch repair work was completed successfully."</Text>
      </View>
      <View style={styles.reportBox}>
        <Text style={styles.reportAuthor}>Reported by: Maria Clara (client3)</Text>
        <Text style={styles.reportContent}>"Excellent troubleshooting performance from the electrical specialist. Highly recommended platform worker."</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#111', marginVertical: 12 },
  metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  metricBox: { flex: 1, backgroundColor: '#FFF9E6', marginHorizontal: 4, padding: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#FBEAA6' },
  metricVal: { fontSize: 20, fontWeight: 'bold', color: '#111', marginVertical: 4 },
  metricLbl: { fontSize: 10, color: '#666', fontWeight: '500', textTransform: 'uppercase' },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#111', marginTop: 12, marginBottom: 12 },
  bookingCard: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, padding: 12, marginBottom: 10 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 4 },
  badgeLabel: { fontSize: 11, fontWeight: 'bold', color: '#666' },
  badgeStatusText: { fontSize: 11, fontWeight: 'bold', color: '#4CD964' },
  cardInfoText: { fontSize: 13, color: '#333', marginBottom: 2 },
  boldField: { fontWeight: '600', color: '#555' },
  reportBox: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FFE4B3', borderRadius: 8, padding: 12, marginBottom: 10 },
  reportAuthor: { fontSize: 12, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  reportContent: { fontSize: 12, color: '#555', fontStyle: 'italic', lineHeight: 16 }
});