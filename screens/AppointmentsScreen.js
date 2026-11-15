import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function AppointmentsScreen() {
  const { user, bookings } = useContext(AppContext);

  const clientBookings = bookings.filter(b => b.clientId === user?.id);

  const upcomingCategory = clientBookings.filter(b => b.status === 'Pending');
  const ongoingCategory = clientBookings.filter(b => b.status === 'Upcoming');
  const cancelledCategory = clientBookings.filter(b => b.status === 'Cancelled');

  const renderBookingBlock = (itemsList, styleThemeColor) => {
    return itemsList.map((item) => (
      <View key={item.id} style={styles.itemBox}>
        <View style={[styles.colorIndicatorStrip, { backgroundColor: styleThemeColor }]} />
        <View style={{ padding: 12, flex: 1 }}>
          <Text style={styles.cardHeaderTitle}>{item.workerName} • {item.service}</Text>
          <Text style={styles.cardBodyText}>🗓️ Date Schedule: {item.date}</Text>
          <Text style={styles.cardBodyText}>📍 Location Matrix: {item.location}</Text>
        </View>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenHeader}>Your Task Bookings</Text>

      {/* UPCOMING CATEGORY (WAITING FOR CONFIRMATION) */}
      <Text style={styles.laneTitle}>Upcoming (Awaiting Confirmation)</Text>
      {upcomingCategory.length === 0 ? <Text style={styles.emptyText}>No pending items filed.</Text> : renderBookingBlock(upcomingCategory, '#FFCC00')}

      {/* ONGOING CATEGORY (ACCEPTED BY WORKER) */}
      <Text style={styles.laneTitle}>Ongoing (Confirmed Actions)</Text>
      {ongoingCategory.length === 0 ? <Text style={styles.emptyText}>No ongoing tasks active.</Text> : renderBookingBlock(ongoingCategory, '#4CD964')}

      {/* CANCELLED CATEGORY */}
      <Text style={styles.laneTitle}>Cancelled Registry</Text>
      {cancelledCategory.length === 0 ? <Text style={styles.emptyText}>Clean log history sheet.</Text> : renderBookingBlock(cancelledCategory, '#FF3B30')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  screenHeader: { fontSize: 22, fontWeight: 'bold', color: '#111', marginVertical: 10 },
  laneTitle: { fontSize: 13, fontWeight: 'bold', color: '#666', marginTop: 16, marginBottom: 8, textTransform: 'uppercase' },
  itemBox: { flexDirection: 'row', backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, marginBottom: 10, overflow: 'hidden' },
  colorIndicatorStrip: { width: 5, height: '100%' },
  cardHeaderTitle: { fontSize: 15, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  cardBodyText: { fontSize: 12, color: '#555', marginTop: 1 },
  emptyText: { color: '#999', fontSize: 12, fontStyle: 'italic', paddingLeft: 4 }
});