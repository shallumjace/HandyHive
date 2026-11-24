import { notice, confirmAction } from '../utils/feedback';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import BookingDetailsModal from '../components/BookingDetailsModal';

export default function HomepageWorker() {
  const { user, bookings, notifications, markNotificationRead, updateBookingStatus } = useContext(AppContext);
  const [selectedId,setSelectedId]=useState(null);
  const activeJobs = bookings.filter(b => b.workerId === user?.id && b.status === 'Upcoming');
  const history = bookings.filter(b => b.workerId === user?.id && ['Cancelled', 'Completed'].includes(b.status));
  const selected = bookings.find(b => b.id === selectedId && b.workerId === user?.id);
  const notices = notifications.filter(n => n.recipientUserId === user?.id).slice(-8).reverse();
  const complete = async()=>{try{await updateBookingStatus(selected.id,'Completed');setSelectedId(null);notice('Completed','Booking marked as completed. Client can now rate or report the service.');}catch(e){notice('Error',e.message);}};
  return <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    <Text style={styles.title}>Welcome back, {user?.name?.split(' ')[0]}!</Text>
    <View style={styles.metric}><Text style={styles.metricNum}>{activeJobs.length}</Text><Text>Confirmed Jobs</Text></View>
    <Text style={styles.heading}>Your Upcoming Itinerary</Text>
    {activeJobs.length===0 && <Text style={styles.empty}>You have no confirmed jobs right now.</Text>}
    {activeJobs.map(b=><TouchableOpacity key={b.id} style={styles.card} onPress={()=>setSelectedId(b.id)}>
      <Text style={styles.cardTitle}>{b.clientName} • {b.service}</Text>
      <Text style={styles.line}>🗓️ {b.date} {b.time}</Text>
      <Text style={styles.line}>📍 {b.location}</Text>
      <Text style={styles.line}>{b.notes}</Text>
      <Text style={styles.link}>View full appointment details →</Text>
    </TouchableOpacity>)}
    <Text style={styles.heading}>Appointment Logs</Text>
    {history.length===0 && <Text style={styles.empty}>No completed or cancelled appointments yet.</Text>}
    {history.map(b=><TouchableOpacity key={b.id} style={styles.card} onPress={()=>setSelectedId(b.id)}>
      <Text style={styles.cardTitle}>{b.clientName} • {b.status}</Text>
      <Text style={styles.line}>{b.service} • {b.date} {b.time}</Text>
      <Text style={styles.link}>View booking history →</Text>
    </TouchableOpacity>)}
    <Text style={styles.heading}>Appointment Notifications</Text>
    {notices.length===0 && <Text style={styles.empty}>No notifications.</Text>}
    {notices.map(n=><TouchableOpacity key={n.id} style={[styles.card,!n.isRead&&{borderColor:'#F4B41A'}]} onPress={()=>markNotificationRead(n.id)}>
      <Text style={styles.line}>{n.message}</Text><Text style={styles.meta}>{n.createdAt}{n.isRead?' • Read':' • Tap to mark read'}</Text>
    </TouchableOpacity>)}
    <BookingDetailsModal booking={selected} onClose={()=>setSelectedId(null)}>
      {selected?.status==='Upcoming' && <TouchableOpacity style={styles.button} onPress={()=>confirmAction('Complete service','Confirm that the service has been completed?', complete, 'Mark Completed')}><Text style={styles.buttonText}>Mark Job Completed</Text></TouchableOpacity>}
    </BookingDetailsModal>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:'#FFF',padding:16},title:{fontSize:23,fontWeight:'bold',marginVertical:12},metric:{padding:16,backgroundColor:'#FFF9E6',borderRadius:12,alignItems:'center',marginBottom:24},metricNum:{fontSize:28,fontWeight:'bold'},heading:{fontSize:17,fontWeight:'bold',marginBottom:10,marginTop:14},card:{padding:14,borderRadius:10,borderColor:'#EEE',borderWidth:1,backgroundColor:'#FAFAFA',marginBottom:10},cardTitle:{fontSize:15,fontWeight:'bold',marginBottom:5},line:{fontSize:13,color:'#555',marginTop:4},link:{color:'#2F80ED',fontWeight:'bold',fontSize:12,marginTop:10},meta:{fontSize:11,color:'#999',marginTop:5},empty:{color:'#999',paddingVertical:14},button:{backgroundColor:'#2F80ED',padding:14,borderRadius:8,alignItems:'center',marginVertical:12},buttonText:{color:'#FFF',fontWeight:'bold'}});
