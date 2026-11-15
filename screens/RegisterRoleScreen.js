import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function RegisterRoleScreen() {
  const { navigate } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <Text style={styles.headingTitle}>Select Account Role</Text>
      <Text style={styles.subtext}>Choose how you plan to engage with the platform.</Text>

      <TouchableOpacity style={styles.choiceCard} onPress={() => navigate('RegisterFormScreen', 'Client')}>
        <Text style={styles.choiceTitle}>Register as Client Account</Text>
        <Text style={styles.choiceDesc}>Hire expert local specialists for custom repairs and trade services.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.choiceCard} onPress={() => navigate('RegisterFormScreen', 'Worker')}>
        <Text style={styles.choiceTitle}>Register as Service Provider</Text>
        <Text style={styles.choiceDesc}>List your trade specialties, set your hourly rate, and manage inbound jobs.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigate('Login')}>
        <Text style={styles.backText}>Return to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 24, justifyContent: 'center' },
  headingTitle: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 8, textAlign: 'center' },
  subtext: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 36, lineHeight: 20 },
  choiceCard: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 20, marginBottom: 16 },
  choiceTitle: { fontSize: 16, fontWeight: 'bold', color: '#F4B41A' },
  choiceDesc: { fontSize: 13, color: '#555', marginTop: 6, lineHeight: 18 },
  backButton: { marginTop: 20, alignItems: 'center' },
  backText: { color: '#777', fontWeight: '500', fontSize: 14 }
});