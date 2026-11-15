import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function NotificationScreen() {
  const { user, bookings } = useContext(AppContext);

  const alertsList = bookings.filter(b => b.clientId === user?.id && b.status !== 'Pending');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.titleHeader}>Activity Updates</Text>

      {alertsList.length === 0 ? (
        <View style={styles.emptyCenter}>
          <Text style={styles.emptyCenterTxt}>No updates available at this time.</Text>
        </View>
      ) : (
        alertsList.map((alert) => {
          const checkAccepted = alert.status === 'Upcoming';
          return (
            <View key={alert.id} style={[styles.alertTile, checkAccepted ? styles.alertSuccessBorder : styles.alertFailBorder]}>
              <Text style={styles.alertMainText}>
                Task assignment record <Text style={{ fontWeight: 'bold' }}>#{alert.id}</Text> for {alert.service} service request has been officially 
                <Text style={[{ fontWeight: 'bold' }, checkAccepted ? { color: '#4CD964' } : { color: '#FF3B30' }]}>
                   {checkAccepted ? ' ACCEPTED ' : ' DECLINED '}
                </Text> 
                by {alert.workerName}.
              </Text>
              <Text style={styles.timestampText}>Logged Schedule: {alert.date}</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  titleHeader: { fontSize: 22, fontWeight: 'bold', color: '#111', marginVertical: 10 },
  alertTile: { padding: 14, backgroundColor: '#FAFAFA', borderRadius: 8, borderWidth: 1, marginBottom: 10 },
  alertSuccessBorder: { borderColor: '#4CD964', backgroundColor: '#F2FBF4' },
  alertFailBorder: { borderColor: '#FF3B30', backgroundColor: '#FDF3F2' },
  alertMainText: { fontSize: 13, color: '#333', lineHeight: 18 },
  timestampText: { fontSize: 11, color: '#777', marginTop: 6, fontWeight: '500' },
  emptyCenter: { marginTop: 60, alignItems: 'center' },
  emptyCenterTxt: { color: '#999', fontSize: 14 }
});