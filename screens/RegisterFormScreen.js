import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { registerUserInStorage } from '../data/database';

export default function RegisterFormScreen() {
  const { screenParam, navigate, clients, workers } = useContext(AppContext);
  const targetRole = screenParam || 'Client'; 


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');

  const [specialty, setSpecialty] = useState('Welding'); 
  const [bio, setBio] = useState('');
  const [cert, setCert] = useState('');

  const executeFormSubmit = async () => {
    if (!name || !email || !password || !sex || !age || !birthday || !phone) {
      Alert.alert('Form Error', 'Please complete all required fields.');
      return;
    }

    const calculatedIdNumber = targetRole === 'Client' ? clients.length + 1 : workers.length + 1;
    

    const registrationPayload = {
      id: targetRole === 'Client' ? `client${calculatedIdNumber}` : `worker${calculatedIdNumber}`,
      name,
      email,
      password,
      sex,
      age: parseInt(age) || 25,
      birthday,
      phone,
      role: targetRole,
      ...(targetRole === 'Worker' && {
        specialty,
        rate: '₱300/hr', 
        bio,
        certificate: cert
      })
    };

    try {
      await registerUserInStorage(registrationPayload);
      
      if (targetRole === 'Client') {
        clients.push(registrationPayload);
      } else {
        workers.push(registrationPayload);
      }

      Alert.alert('Account Verified', 'Your profile records have been saved successfully.');
      navigate('Login');
    } catch (err) {
      Alert.alert('Compliance Error', err.message);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Registration Portal</Text>
      <Text style={styles.sub}>Setting up profile for {targetRole} access.</Text>

      {/* CORE PROFILE FIELDS */}
      <TextInput placeholder="Name" placeholderTextColor="#999" value={name} onChangeText={setName} style={styles.box} />
      <TextInput placeholder="Email" placeholderTextColor="#999" value={email} onChangeText={setEmail} style={styles.box} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} style={styles.box} />
      <TextInput placeholder="Sex" placeholderTextColor="#999" value={sex} onChangeText={setSex} style={styles.box} />
      <TextInput placeholder="Age" placeholderTextColor="#999" value={age} onChangeText={setAge} style={styles.box} keyboardType="numeric" />
      <TextInput placeholder="Birthdate (YYYY-MM-DD)" placeholderTextColor="#999" value={birthday} onChangeText={setBirthday} style={styles.box} />
      <TextInput placeholder="Phone Number" placeholderTextColor="#999" value={phone} onChangeText={setPhone} style={styles.box} keyboardType="phone-pad" />

      {/* ADDITIONAL WORKER PARAMETERS CONDITIONAL BLOCK */}
      {targetRole === 'Worker' && (
        <View style={styles.workerPane}>
          <Text style={styles.label}>Select Trade Specialty Dropdown Block Option</Text>
          {/* Custom micro selector row simulating dropdown options */}
          <View style={styles.selectorRow}>
            {['Welding', 'Cleaning', 'Plumbing', 'Electrical'].map((trade) => (
              <TouchableOpacity key={trade} style={[styles.selBadge, specialty === trade && styles.selActive]} onPress={() => setSpecialty(trade)}>
                <Text style={[styles.selText, specialty === trade && styles.selTextActive]}>{trade}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput placeholder="Rate per Hour (₱300/hr)"  style={[styles.box, { backgroundColor: '#EFEFEF', color: '#777' }]} />
          <TextInput placeholder="Tell customers about your experience and skills..." placeholderTextColor="#999" value={bio} onChangeText={setBio} style={[styles.box, { height: 70 }]} multiline />
          <TextInput placeholder="Certifications / Achievements (e.g., NCII Certified)" placeholderTextColor="#999" value={cert} onChangeText={setCert} style={styles.box} />
        </View>
      )}

      <TouchableOpacity style={styles.submitBtn}
      onPress={executeFormSubmit}>
        <Text style={styles.submitTxt}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111', marginTop: 10 },
  sub: { fontSize: 13, color: '#666', marginBottom: 20, marginTop: 2 },
  box: { borderWidth: 1, borderColor: '#DDD', backgroundColor: '#FAFAFA', borderRadius: 8, height: 46, paddingHorizontal: 12, color: '#111', marginBottom: 12, fontSize: 14 },
  workerPane: { backgroundColor: '#FAF8F0', padding: 12, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#F4B41A', marginBottom: 12, marginTop: 4 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#666', marginBottom: 8, textTransform: 'uppercase' },
  selectorRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  selBadge: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 4, marginRight: 6, marginBottom: 6 },
  selActive: { backgroundColor: '#F4B41A', borderColor: '#F4B41A' },
  selText: { fontSize: 12, color: '#555', fontWeight: '500' },
  selTextActive: { color: '#FFF', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#F4B41A', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 40 },
  submitTxt: { color: '#FFF', fontWeight: 'bold', fontSize: 15 }
});