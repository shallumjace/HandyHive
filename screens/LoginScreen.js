import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function LoginScreen() {
  const { login, navigate } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const executeLoginSubmit = () => {
    if (!email.trim() || !password) {
      Alert.alert('Validation Error', 'Please complete email and password forms.');
      return;
    }
    login(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appLogoText}>HandyHive</Text>
      <Text style={styles.tagline}>Welcome back!</Text>

      <TextInput placeholder="Email" placeholderTextColor="#999" value={email} onChangeText={setEmail} style={styles.field} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} style={styles.field} />

      <TouchableOpacity style={styles.loginButton} onPress={executeLoginSubmit}>
        <Text style={styles.loginText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupLink} onPress={() => navigate('RegisterRoleScreen')}>
        <Text style={styles.linkText}>New to platform? <Text style={{ color: '#F4B41A', fontWeight: 'bold' }}>Create Account</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', justifyContent: 'center', padding: 24 },
  appLogoText: { fontSize: 36, fontWeight: 'bold', color: '#111', textAlign: 'center' },
  tagline: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 40, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  field: { borderWidth: 1, borderColor: '#DDD', height: 48, borderRadius: 8, paddingHorizontal: 14, color: '#111', backgroundColor: '#FAFAFA', marginBottom: 14, fontSize: 15 },
  loginButton: { backgroundColor: '#F4B41A', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  signupLink: { marginTop: 24, alignItems: 'center' },
  linkText: { fontSize: 14, color: '#555' }
});