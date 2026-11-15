import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TourableOpacity, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

export default function ChatScreen() {
  const { navigate } = useContext(AppContext);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => navigate('WorkerProfile')}>
          <Ionicons name="chevron-back" color="#000" size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.chatName}>Juan Dela Cruz</Text>
          <Text style={styles.statusOnline}>● Service Provider</Text>
        </View>
      </View>

      <ScrollView style={styles.messageListContainer} showsVerticalScrollIndicator={false}>
        
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput placeholder="Secure messaging terminal..." placeholderTextColor="#999" style={styles.inputTxt} />
        <TouchableOpacity style={styles.sendIconCircle}>
          <Ionicons name="send" size={15} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatHeader: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center', paddingTop: 20 },
  chatName: { fontWeight: 'bold', fontSize: 16, color: '#111' },
  statusOnline: { fontSize: 11, color: '#4CD964', fontWeight: '500', marginTop: 1 },
  messageListContainer: { flex: 1, backgroundColor: '#FAFAFA', padding: 16 },
  inputArea: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#EEE', alignItems: 'center', backgroundColor: '#FFF', paddingBottom: 20 },
  inputTxt: { flex: 1, backgroundColor: '#F5F5F5', height: 40, borderRadius: 20, paddingHorizontal: 16, marginRight: 10, color: '#111' },
  sendIconCircle: { backgroundColor: '#F4B41A', width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' }
});