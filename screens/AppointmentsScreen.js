import { notice, confirmAction } from '../utils/feedback';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { money } from '../data/domain';
import BookingDetailsModal from '../components/BookingDetailsModal';

const TABS = ['Pending', 'Upcoming', 'Completed', 'Cancelled'];
export default function AppointmentsScreen() {
  const {user,bookings,reviews,reports,rescheduleBooking,cancelBooking,submitReview,submitReport} = useContext(AppContext);
  const [tab,setTab] = useState('Pending');
  const [selectedId,setSelectedId] = useState(null);
  const [date,setDate] = useState('');
  const [time,setTime] = useState('');
  const [mode,setMode] = useState('Details');
  const [stars,setStars] = useState(5);
  const [review,setReview] = useState('');
  const [reason,setReason] = useState('Poor Service');
  const [description,setDescription] = useState('');
  const selected = bookings.find(b=>b.id===selectedId && b.clientId===user?.id);
  const list = bookings.filter(b=>b.clientId===user?.id && b.status===tab);
  const open=(b)=>{setSelectedId(b.id);setMode('Details');setDate(b.date?.match(/^\d{4}-\d{2}-\d{2}$/)?b.date:'');setTime(b.time?.match(/^\d{2}:\d{2}$/)?b.time:'');setReview('');setDescription('');};
  const process=async(fn,message)=>{try{await fn();notice('Success',message);setSelectedId(null);}catch(e){notice('Unable to continue',e.message);}};
  return <View style={styles.page}>
    <Text style={styles.title}>Your Task Bookings</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={{paddingBottom:8}}>
      {TABS.map(t=><TouchableOpacity key={t} style={[styles.tab,tab===t&&styles.active]} onPress={()=>setTab(t)}>
        <Text style={[styles.tabText,tab===t&&styles.activeText]}>{t} ({bookings.filter(b=>b.clientId===user?.id&&b.status===t).length})</Text>
      </TouchableOpacity>)}
    </ScrollView>
    <ScrollView showsVerticalScrollIndicator={false}>
      {list.length===0 && <Text style={styles.empty}>No {tab.toLowerCase()} bookings.</Text>}
      {list.map(b=><TouchableOpacity key={b.id} style={styles.card} onPress={()=>open(b)}>
        <Text style={styles.cardTitle}>{b.workerName} • {b.service}</Text>
        <Text style={styles.detail}>🗓️ {b.date} {b.time}</Text>
        <Text style={styles.detail}>📍 {b.location}</Text>
        <Text style={styles.detail}>Minimum service fee: {b.minimumServiceFee == null?'Not recorded':money(b.minimumServiceFee)}</Text>
        <Text style={styles.tap}>Tap for details and available actions →</Text>
      </TouchableOpacity>)}
    </ScrollView>
    <BookingDetailsModal booking={selected} onClose={()=>setSelectedId(null)}>
      {selected && ['Pending','Upcoming'].includes(selected.status) && <>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.action} onPress={()=>setMode('Reschedule')}><Text style={styles.actionText}>Reschedule</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.action,{backgroundColor:'#EB5757'}]} onPress={()=>confirmAction('Cancel booking','Cancel this appointment?',()=>process(()=>cancelBooking(selected.id),'Booking cancelled and worker notified.'),'Cancel Booking',true)}><Text style={styles.actionText}>Cancel Booking</Text></TouchableOpacity>
        </View>
        {mode==='Reschedule' && <View style={styles.form}>
          <Text style={styles.label}>New date (YYYY-MM-DD)</Text><TextInput style={styles.input} placeholder="2026-12-05" value={date} onChangeText={setDate} />
          <Text style={styles.label}>New time (24-hour HH:mm)</Text><TextInput style={styles.input} placeholder="14:30" value={time} onChangeText={setTime} />
          <TouchableOpacity style={styles.action} onPress={()=>process(()=>rescheduleBooking(selected.id,date,time),'Appointment rescheduled and provider notified.')}><Text style={styles.actionText}>Confirm New Schedule</Text></TouchableOpacity>
        </View>}
      </>}
      {selected?.status==='Completed' && <>
        <View style={styles.actionRow}>
          {!reviews.some(r=>r.bookingId===selected.id&&r.clientId===user.id) && <TouchableOpacity style={styles.action} onPress={()=>setMode('Rate')}><Text style={styles.actionText}>Rate Provider</Text></TouchableOpacity>}
          <TouchableOpacity style={styles.action} onPress={()=>setMode('Report')}><Text style={styles.actionText}>Report Provider</Text></TouchableOpacity>
        </View>
        {reviews.some(r=>r.bookingId===selected.id&&r.clientId===user.id) && <Text style={styles.detail}>You already submitted a rating for this booking.</Text>}
        {mode==='Rate' && <View style={styles.form}>
          <Text style={styles.label}>Your rating</Text><View style={styles.actionRow}>{[1,2,3,4,5].map(n=><TouchableOpacity key={n} onPress={()=>setStars(n)}><Text style={{fontSize:28,color:n<=stars?'#F4B41A':'#DDD'}}>★</Text></TouchableOpacity>)}</View>
          <TextInput style={styles.input} placeholder="Optional feedback" value={review} onChangeText={setReview} multiline />
          <TouchableOpacity style={styles.action} onPress={()=>process(()=>submitReview(selected.id,stars,review),'Your review was saved.')}><Text style={styles.actionText}>Submit Rating</Text></TouchableOpacity>
        </View>}
        {mode==='Report' && <View style={styles.form}>
          <Text style={styles.label}>Reason</Text>
          <View style={styles.actionRow}>{['Poor Service','Unfair Charge','Misconduct'].map(s=><TouchableOpacity key={s} onPress={()=>setReason(s)} style={[styles.reason,reason===s&&styles.reasonSelected]}><Text style={{fontSize:12,color:reason===s?'#FFF':'#555'}}>{s}</Text></TouchableOpacity>)}</View>
          <TextInput style={[styles.input,{height:90,textAlignVertical:'top'}]} placeholder="Describe what happened (at least 10 characters)" value={description} onChangeText={setDescription} multiline />
          <TouchableOpacity style={styles.action} onPress={()=>process(()=>submitReport(selected.id,reason,description),'Report filed. Admin can review it.') }><Text style={styles.actionText}>Submit Report</Text></TouchableOpacity>
          {reports.filter(r=>r.bookingId===selected.id&&r.clientId===user.id).map(r=><Text key={r.id} style={styles.detail}>Previous report: {r.status}</Text>)}
        </View>}
      </>}
    </BookingDetailsModal>
  </View>;
}
const styles=StyleSheet.create({page:{flex:1,backgroundColor:'#FFF',padding:16},title:{fontSize:22,fontWeight:'bold',marginVertical:12},tabs:{flexGrow:0,maxHeight:54,marginBottom:12},tab:{backgroundColor:'#FAFAFA',borderWidth:1,borderColor:'#EEE',paddingHorizontal:12,paddingVertical:11,borderRadius:8,marginRight:8},active:{backgroundColor:'#FFF9E6',borderColor:'#F4B41A'},tabText:{color:'#666',fontWeight:'bold',fontSize:12},activeText:{color:'#B8860B'},card:{borderWidth:1,borderColor:'#EEE',backgroundColor:'#FAFAFA',padding:14,borderRadius:10,marginBottom:12},cardTitle:{fontWeight:'bold',fontSize:15},detail:{color:'#555',fontSize:13,marginTop:7},tap:{fontSize:12,color:'#B8860B',fontWeight:'bold',marginTop:12},empty:{color:'#999',marginTop:24,textAlign:'center'},actionRow:{flexDirection:'row',flexWrap:'wrap',marginVertical:12,alignItems:'center',justifyContent:'space-around'},action:{flex:1,backgroundColor:'#F4B41A',padding:12,borderRadius:8,alignItems:'center',marginRight:6,marginBottom:6},actionText:{color:'#FFF',fontWeight:'bold',fontSize:12},form:{paddingVertical:12},label:{fontWeight:'bold',color:'#666',fontSize:12,marginBottom:6},input:{borderWidth:1,borderColor:'#DDD',borderRadius:8,backgroundColor:'#FAFAFA',padding:10,marginBottom:12},reason:{padding:7,backgroundColor:'#F4F4F4',borderRadius:6,marginRight:4,marginBottom:5},reasonSelected:{backgroundColor:'#F4B41A'}});
