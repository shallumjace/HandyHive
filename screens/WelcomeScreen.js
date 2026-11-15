import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

export default function WelcomeScreen() {
  const { navigate } = useContext(AppContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brandWrapper}> 
         <Text style={styles.logoIcon}>🐝</Text>
        <Text style={styles.logoTitle}>HandyHive</Text>
        <Text style={styles.tagline} >
          Connecting communities through trusted, professional neighborhood services.
        </Text>
      </View>

    <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.getStartedBtn} onPress={() => navigate('Login')}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
        <Text style={styles.valuesFooter}>✨ Trusted. Local. Reliable.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9E6', padding: 24, justifyContent: 'space-between', alignItems: 'center' },
  brandWrapper: { alignItems: 'center', marginTop: 60 },
  logoTitle: { fontSize: 34, fontWeight: 'bold', color: '#111', marginTop: 12, letterSpacing: 0.5 },
  tagline: { fontSize: 13, color: '#555', textAlign: 'center', marginTop: 10, paddingHorizontal: 25, lineHeight: 20 },
  logoIcon: {fontSize:50},
  buttonWrapper: { width: '100%', alignItems: 'center', marginBottom: 30 },
  getStartedBtn: { backgroundColor: '#111', width: '80%', height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  getStartedText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
  valuesFooter: { color: '#F4B41A', fontWeight: '700', marginTop: 18, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }
});