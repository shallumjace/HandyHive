import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { AppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { categories, workers, navigate, setSelectedWorkerId } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  const filteredWorkers = workers.filter(w => w.specialty === selectedCategory);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.greetingHeader}>Find Reliable Services</Text>

      {/* ==========================================
          SWIPEABLE CATEGORIES TRACK (PAGING SLIDER)
          ========================================== */}
      <Text style={styles.sectionLabel}>Service Categories (Swipe Left/Right)</Text>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false} 
        style={styles.sliderWrapper}
      >
        {categories.map((cat, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.sliderPageItem, selectedCategory === cat && styles.activePageItem]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.sliderPageTxt, selectedCategory === cat && styles.activePageTxt]}>
              {cat.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ==========================================
          DYNAMIC WORKER GRID LISTING
          ========================================== */}
      <Text style={styles.sectionLabel}>Available Professionals in {selectedCategory}</Text>
      
      {filteredWorkers.length === 0 ? (
        <Text style={styles.emptyNotice}>No workers registered under this trade yet.</Text>
      ) : (
        filteredWorkers.map((worker) => (
          <TouchableOpacity 
            key={worker.id} 
            style={styles.workerCardBox}
            onPress={() => {
              setSelectedWorkerId(worker.id);
              navigate('WorkerProfileScreen');
            }}
          >
            <View style={styles.cardRow}>
              <View style={styles.badgePlaceholder}><Text style={styles.badgeLetter}>{worker.name.charAt(0)}</Text></View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.workerName}>{worker.name}</Text>
                <Text style={styles.workerSpecText}>{worker.specialty} • {worker.certificate}</Text>
                <Text style={styles.workerRateText}>{worker.rate}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  greetingHeader: { fontSize: 24, fontWeight: 'bold', color: '#111', marginVertical: 10 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#666', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  sliderWrapper: { height: 60, marginBottom: 20 },
  sliderPageItem: { width: width - 200, backgroundColor: '#FAFAFA', borderRadius: 8, borderWidth: 1, borderColor: '#EEE', justifyContent: 'center', alignItems: 'center', height: 50 },
  activePageItem: { backgroundColor: '#FFF9E6', borderColor: '#F4B41A' },
  sliderPageTxt: { fontSize: 16, fontWeight: '600', color: '#777' },
  activePageTxt: { color: '#F4B41A', fontWeight: 'bold' },
  workerCardBox: { backgroundColor: '#FAFAFA', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#ECECEC', marginBottom: 12 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  badgePlaceholder: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  badgeLetter: { fontSize: 18, fontWeight: 'bold', color: '#F4B41A' },
  workerName: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  workerSpecText: { fontSize: 13, color: '#666', marginVertical: 2 },
  workerRateText: { fontSize: 13, fontWeight: 'bold', color: '#4CD964' },
  emptyNotice: { color: '#999', fontStyle: 'italic', paddingVertical: 10 }
});