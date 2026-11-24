import { notice, confirmAction } from '../utils/feedback';
import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { money } from '../data/domain';

export default function BookAppointmentScreen() {
  const { user, selectedWorkerId, workers, createBooking, navigate } = useContext(AppContext);
  const [date,setDate]=useState('');
  const [time,setTime]=useState('');
  const [location,setLocation]=useState('');
  const [description,setDescription]=useState('');
  const [submitting,setSubmitting]=useState(false);
  const targetWorker=workers.find(w=>w.id===selectedWorkerId);
  const submit=async()=>{
    if (submitting || !targetWorker) return;
    setSubmitting(true);
    try {
      await createBooking({workerId:targetWorker.id,date,time,location,notes:description});
      notice('Booking submitted','Your request is awaiting provider acceptance.');
      navigate('AppointmentsScreen');
    } catch (e) { notice('Could not book',e.message); }
    finally { setSubmitting(false); }
  };
  return <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>Schedule Setup</Text>
    <Text style={styles.subtitle}>Booking a service with {targetWorker?.name || 'provider not found'}</Text>
    <Text style={styles.fee}>Minimum service fee: {money(targetWorker?.minimumServiceFee)} (final cost may vary by agreement)</Text>
    <Text style={styles.label}>Appointment date (YYYY-MM-DD)</Text>
    <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2026-12-05" />
    <Text style={styles.label}>Appointment time (24-hour HH:mm)</Text>
    <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="14:30" />
    <Text style={styles.label}>Service address</Text>
    <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Complete address" />
    <Text style={styles.label}>Problem description</Text>
    <TextInput style={[styles.input,{height:90,textAlignVertical:'top'}]} value={description} onChangeText={setDescription} placeholder="Explain the repair or service requested" multiline />
    <Text style={styles.note}>Photo attachments are not available in this version. No image upload is claimed or stored.</Text>
    <TouchableOpacity disabled={!targetWorker||submitting} style={styles.button} onPress={submit}><Text style={styles.buttonText}>{submitting?'Submitting...':'Book Appointment'}</Text></TouchableOpacity>
    <TouchableOpacity onPress={()=>navigate('WorkerProfileScreen')} style={styles.back}><Text>Back to Worker Profile</Text></TouchableOpacity>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:'#FFF',padding:16},title:{fontSize:22,fontWeight:'bold',marginTop:10},subtitle:{fontSize:13,color:'#666',marginBottom:15,marginTop:3},fee:{backgroundColor:'#FFF9E6',padding:12,borderRadius:8,marginBottom:16,fontWeight:'bold',color:'#666'},label:{fontSize:12,fontWeight:'bold',color:'#555',marginBottom:6},input:{borderWidth:1,borderColor:'#DDD',backgroundColor:'#FAFAFA',borderRadius:8,height:46,paddingHorizontal:12,color:'#111',marginBottom:16,fontSize:14},note:{fontSize:12,color:'#777',marginBottom:20},button:{backgroundColor:'#F4B41A',height:48,borderRadius:8,alignItems:'center',justifyContent:'center'},buttonText:{fontSize:15,color:'#FFF',fontWeight:'bold'},back:{alignItems:'center',padding:15}});
