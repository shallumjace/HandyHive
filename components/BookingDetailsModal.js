import React from 'react';
import { Modal, View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { money } from '../data/domain';

export default function BookingDetailsModal({ booking, onClose, children }) {
  if (!booking) return null;
  const fields = [
    ['Reference', booking.id], ['Client',booking.clientName], ['Phone',booking.clientPhone],
    ['Service Provider',booking.workerName],['Service',booking.service],['Status',booking.status],
    ['Appointment Date',booking.date],['Appointment Time',booking.time],
    ['Location',booking.location],['Problem Description',booking.notes],
    ['Minimum Service Fee',booking.minimumServiceFee == null ? 'Not recorded' : money(booking.minimumServiceFee)],
    ['Agreed Price',booking.agreedPrice == null ? 'Not yet agreed' : money(booking.agreedPrice)],
  ];
  return <Modal transparent visible animationType="slide" onRequestClose={onClose}>
    <View style={styles.scrim}>
      <View style={styles.modal}>
        <View style={styles.top}>
          <Text style={styles.title}>Appointment Details</Text>
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close appointment details"><Text style={styles.close}>✕</Text></TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {fields.map(([label,value])=><View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text><Text style={styles.value}>{String(value ?? 'Not provided')}</Text>
          </View>)}
          {!!booking.rescheduleHistory?.length && <>
            <Text style={styles.section}>Reschedule History</Text>
            {booking.rescheduleHistory.map((h,i)=><Text key={i} style={styles.history}>{h.oldDate} {h.oldTime} → {h.newDate} {h.newTime}</Text>)}
          </>}
          {!!booking.statusHistory?.length && <>
            <Text style={styles.section}>Status History</Text>
            {booking.statusHistory.map((h,i)=><Text key={i} style={styles.history}>{h.status} • {h.at}</Text>)}
          </>}
          {children}
        </ScrollView>
      </View>
    </View>
  </Modal>;
}
const styles=StyleSheet.create({
  scrim:{flex:1,backgroundColor:'rgba(0,0,0,.52)',justifyContent:'center',padding:20},modal:{maxHeight:'82%',backgroundColor:'#FFF',padding:18,borderRadius:14},top:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#EEE',paddingBottom:12,marginBottom:10},
  title:{fontSize:18,fontWeight:'bold',color:'#111'},close:{fontSize:21,color:'#333',paddingHorizontal:10},row:{paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#F6F6F6'},label:{fontSize:11,textTransform:'uppercase',fontWeight:'bold',color:'#777'},value:{fontSize:14,color:'#222',marginTop:2},section:{fontSize:14,fontWeight:'bold',marginTop:14,marginBottom:8},history:{color:'#555',fontSize:12,marginBottom:5},
});
