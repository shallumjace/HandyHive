import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

export default function CategoryListingScreen({ category }) {
  const { navigate } = useContext(AppContext);

  const mockProviders = [
    { name: 'Juan Dela Cruz', spec: 'Licensed Technician', rate: '₱300/hr', rating: '4.8 (120)', icon: 'water' },
    { name: 'Pedro Reyes', spec: 'Emergency Repairs', rate: '₱280/hr', rating: '4.7 (88)', icon: 'build' },
    { name: 'Ricky Salvador', spec: 'Maintenance Expert', rate: '₱250/hr', rating: '4.6 (70)', icon: 'construct' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigate('Home')}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{category || 'Service Hub'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterTabs}>
        <View style={[styles.tab, styles.activeTab]}><Text style={styles.activeText}>Top Rated</Text></View>
        <View style={styles.tab}><Text style={styles.tabText}>Nearest</Text></View>
        <View style={styles.tab}><Text style={styles.tabText}>Budget</Text></View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {mockProviders.map((worker, i) => (
          <TouchableOpacity key={i} style={styles.workerRow} onPress={() => navigate('WorkerProfile')}>
            <View style={styles.avatarMini}>
              <Ionicons name={worker.icon} size={20} color="#F4B41A" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name}>{worker.name}</Text>
              <Text style={styles.sub}>{worker.spec}</Text>
              <Text style={styles.rating}>
                <Ionicons name="star" size={12} color="#F4B41A" /> {worker.rating}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cost}>{worker.rate}</Text>
              <Text style={styles.avail}>● Active</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', alignItems: 'center', paddingTop: 20 },
  topBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  filterTabs: { flexDirection: 'row', paddingHorizontal: 16, marginVertical: 12 },
  tab: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 15, backgroundColor: '#F5F5F5', marginRight: 8, borderWidth: 1, borderColor: '#EAEAEA' },
  tabText: { fontSize: 12, color: '#555' },
  activeTab: { backgroundColor: '#FFF9E6', borderColor: '#F4B41A' },
  activeText: { color: '#F4B41A', fontWeight: 'bold', fontSize: 12 },
  workerRow: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center' },
  avatarMini: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFF9E6', justifyContent: 'center', alignItems: 'center' },
  name: { fontWeight: 'bold', fontSize: 15, color: '#111' },
  sub: { fontSize: 12, color: '#666', marginTop: 2 },
  rating: { fontSize: 11, marginTop: 4, color: '#444' },
  cost: { fontWeight: 'bold', color: '#111', fontSize: 14 },
  avail: { fontSize: 11, color: '#4CD964', marginTop: 4, fontWeight: '500' }
});