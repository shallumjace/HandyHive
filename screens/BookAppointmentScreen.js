import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { saveData } from '../data/database';

export default function BookAppointmentScreen() {
  const { user, selectedWorkerId, workers, bookings, navigate } = useContext(AppContext);

  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const targetWorker = workers.find(w => w.id === selectedWorkerId);

  const executeBookingDispatch = async () => {
    if (!date || !location || !description) {
      Alert.alert('Incomplete Manifest', 'Please complete all form inputs before submitting booking.');
      return;
    }

    const newBookingNode = {
      id: `b${bookings.length + 1}`,
      clientId: user.id,
      clientName: user.name,
      clientPhone: user.phone || '0900 000 0000',
      workerId: targetWorker.id,
      workerName: targetWorker.name,
      service: targetWorker.specialty,
      date: date,
      time: 'Assigned Schedule',
      location: location,
      notes: description,
      status: 'Pending' 
    };

    const dynamicStack = [...bookings, newBookingNode];
    bookings.push(newBookingNode); 
    await saveData('BOOKINGS', dynamicStack);

    Alert.alert('Booking Dispatched', 'Your request has been filed and is awaiting provider confirmation.');
    navigate('AppointmentsScreen');
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Schedule Setup</Text>
      <Text style={styles.subtitle}>Filing task assignment request for {targetWorker?.name}</Text>

      <Text style={styles.inputLabel}>Target Schedule Date</Text>
      <TextInput placeholder="e.g., May 28, 2026" placeholderTextColor="#999" value={date} onChangeText={setDate} style={styles.input} />

      <Text style={styles.inputLabel}>Service Location Address</Text>
      <TextInput placeholder="Complete address" placeholderTextColor="#999" value={location} onChangeText={setLocation} style={styles.input} />

      <Text style={styles.inputLabel}>Repair Descriptions & Task Notes</Text>
      <TextInput placeholder="Provide details about the issues or problem..." placeholderTextColor="#999" value={description} onChangeText={setDescription} style={[styles.input, { height: 100, textAlignVertical: 'top', paddingTop: 10 }]} multiline numberOfLines={4} />

      {/* STATIC PICTURE ENTRY ATTACHMENT BOX */}
      <Text style={styles.inputLabel}>Reference Picture</Text>
      <TouchableOpacity style={styles.staticPhotoBtn} onPress={() => Alert.alert('Not Working','Design Only!')}>
        <Text style={styles.staticPhotoText}>+ Add Condition Images</Text>
      </TouchableOpacity> 

      <TouchableOpacity style={styles.submitBtn} onPress={executeBookingDispatch}>
        <Text style={styles.submitText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111', marginTop: 10 },
  subtitle: { fontSize: 13, color: '#666', marginBottom: 20, marginTop: 2 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#555', marginBottom: 6, uppercase: true },
  input: { borderWidth: 1, borderColor: '#DDD', backgroundColor: '#FAFAFA', borderRadius: 8, height: 46, paddingHorizontal: 12, color: '#111', marginBottom: 16, fontSize: 14 },
  staticPhotoBtn: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#F4B41A', backgroundColor: '#FFF9E6', borderRadius: 8, height: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  staticPhotoText: { color: '#F4B41A', fontWeight: '600', fontSize: 13 },
  submitBtn: { backgroundColor: '#F4B41A', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 }
});