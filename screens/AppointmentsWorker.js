import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function AppointmentsWorker() {
  const { user, bookings, updateBookingStatus } = useContext(AppContext);

  const pendingRequests = bookings.filter(b => b.workerId === user?.id && b.status === 'Pending');

  const handleAction = (bookingId, actionType) => {
    const newStatus = actionType === 'accept' ? 'Upcoming' : 'Cancelled';
    
    Alert.alert(
      `Confirm ${actionType === 'accept' ? 'Acceptance' : 'Decline'}`,
      `Are you sure you want to ${actionType} this job request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Proceed', 
          onPress: () => updateBookingStatus(bookingId, newStatus) 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Incoming Requests</Text>
      
      <View style={styles.badgeRow}>
        <Text style={styles.badgeText}>You have {pendingRequests.length} pending client requests.</Text>
      </View>

      {/* ==========================================
          PENDING REQUEST CARDS
          ========================================== */}
      {pendingRequests.map((req) => (
        <View key={req.id} style={styles.requestCard}>
          <View style={styles.detailsBlock}>
             <Text style={styles.clientName}>{req.clientName}</Text>
             <Text style={styles.detailText}>🗓️ {req.date} at {req.time}</Text>
             <Text style={styles.detailText}>📍 {req.location}</Text>
             <Text style={styles.detailText}>🔧 {req.service}</Text>
             {req.notes ? <Text style={styles.notesText}>Notes: {req.notes}</Text> : null}
          </View>
          
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.declineBtn]} 
              onPress={() => handleAction(req.id, 'decline')}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionBtn, styles.acceptBtn]} 
              onPress={() => handleAction(req.id, 'accept')}>
              <Text style={styles.acceptText}>Accept Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      
      {pendingRequests.length === 0 && (
         <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>All caught up! No new requests.</Text>
         </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#111', marginVertical: 12 },
  badgeRow: { backgroundColor: '#FFF9E6', padding: 10, borderRadius: 6, marginBottom: 16, borderWidth: 1, borderColor: '#FBEAA6' },
  badgeText: { color: '#B8860B', fontWeight: '600', fontSize: 13, textAlign: 'center' },
  requestCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, marginBottom: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: {width: 0, height: 2} },
  detailsBlock: { padding: 16 },
  clientName: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  detailText: { fontSize: 14, color: '#444', marginBottom: 4 },
  notesText: { fontSize: 13, color: '#666', fontStyle: 'italic', marginTop: 8, backgroundColor: '#F9F9F9', padding: 8, borderRadius: 4 },
  actionsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#EEE' },
  actionBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  declineBtn: { backgroundColor: '#FAFAFA' },
  declineText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 15 },
  acceptBtn: { backgroundColor: '#F4B41A' },
  acceptText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#999', fontSize: 15 }
});