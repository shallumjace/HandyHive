import { notice, confirmAction } from '../utils/feedback';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import BookingDetailsModal from '../components/BookingDetailsModal';

export default function AppointmentsWorker() {
  const { user, bookings, updateBookingStatus } = useContext(AppContext);
  const [selectedId,setSelectedId] = useState(null);
  const pending = bookings.filter(b => b.workerId===user?.id&&b.status==='Pending');
  const selected = bookings.find(b=>b.id===selectedId&&b.workerId===user?.id);
  const action = (b, nextStatus) => confirmAction(
    nextStatus === 'Upcoming' ? 'Accept job?' : 'Decline request?',
    `Booking ${b.id}`,
    async () => {
      try { await updateBookingStatus(b.id,nextStatus); setSelectedId(null); notice('Updated','Client has been notified.'); }
      catch(e) { notice('Error',e.message); }
    }, 'Confirm', nextStatus === 'Cancelled'
  );
  return <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    <Text style={styles.title}>Incoming Requests</Text>
    <View style={styles.banner}><Text style={styles.bannerText}>You have {pending.length} pending client requests.</Text></View>
    {pending.map(b=><View key={b.id} style={styles.card}>
      <TouchableOpacity onPress={()=>setSelectedId(b.id)} style={styles.details}>
        <Text style={styles.name}>{b.clientName}</Text>
        <Text style={styles.line}>🗓️ {b.date} {b.time}</Text>
        <Text style={styles.line}>📍 {b.location}</Text>
        <Text style={styles.line}>🔧 {b.service}</Text>
        <Text style={styles.link}>Tap to view full request details →</Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.decline} onPress={()=>action(b,'Cancelled')}><Text style={{color:'#EB5757',fontWeight:'bold'}}>Decline</Text></TouchableOpacity>
        <TouchableOpacity style={styles.accept} onPress={()=>action(b,'Upcoming')}><Text style={{color:'#FFF',fontWeight:'bold'}}>Accept Job</Text></TouchableOpacity>
      </View>
    </View>)}
    {pending.length===0 && <Text style={styles.empty}>All caught up! No new requests.</Text>}
    <BookingDetailsModal booking={selected} onClose={()=>setSelectedId(null)}>
      {selected?.status==='Pending' && <View style={styles.actions}>
        <TouchableOpacity style={styles.decline} onPress={()=>action(selected,'Cancelled')}><Text style={{color:'#EB5757',fontWeight:'bold'}}>Decline</Text></TouchableOpacity>
        <TouchableOpacity style={styles.accept} onPress={()=>action(selected,'Upcoming')}><Text style={{color:'#FFF',fontWeight:'bold'}}>Accept Job</Text></TouchableOpacity>
      </View>}
    </BookingDetailsModal>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:'#FFF',padding:16},title:{fontWeight:'bold',fontSize:22,marginVertical:12},banner:{backgroundColor:'#FFF9E6',padding:11,borderRadius:8,marginBottom:18},bannerText:{color:'#B8860B',textAlign:'center'},card:{borderColor:'#DDD',borderWidth:1,borderRadius:10,marginBottom:14,overflow:'hidden'},details:{padding:16},name:{fontSize:18,fontWeight:'bold',marginBottom:7},line:{fontSize:13,color:'#555',marginBottom:5},link:{color:'#2F80ED',fontSize:12,marginTop:9,fontWeight:'bold'},actions:{flexDirection:'row'},decline:{flex:1,padding:14,backgroundColor:'#FAFAFA',alignItems:'center'},accept:{flex:1,padding:14,backgroundColor:'#F4B41A',alignItems:'center'},empty:{color:'#999',marginTop:40,textAlign:'center'}});
