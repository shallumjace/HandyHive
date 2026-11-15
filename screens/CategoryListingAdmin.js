import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

export default function CategoryListingAdmin() {
  const { categories, workers, addCategory, deleteCategory } = useContext(AppContext);
  const [newCat, setNewCat] = useState('');

  const handleCreate = async () => {
    if (!newCat.trim()) return;
    const success = await addCategory(newCat.trim());
    if (success) {
      setNewCat('');
      Alert.alert('Operation Success', 'New category cluster successfully saved to storage.');
    } else {
      Alert.alert('Duplicate Node', 'This specialty category already exists inside the engine.');
    }
  };

  const handleConfirmDelete = (catName) => {
    Alert.alert(
      'Deletion Warning',
      `Deleting "${catName}" will permanently delete all platform workers registered under this specialty. Proceed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Storage Records', style: 'destructive', onPress: () => deleteCategory(catName) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleTitle}>Core System Categories</Text>

      {/* ==========================================
          ADD CATEGORY INPUT SUBMODULE
          ========================================== */}
      <View style={styles.entryRow}>
        <TextInput 
          placeholder="Enter new specialty..." 
          placeholderTextColor="#999"
          value={newCat} 
          onChangeText={setNewCat} 
          style={styles.inputBox} 
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleCreate}>
          <Text style={styles.addBtnTxt}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* ==========================================
          DYNAMIC LISTING WITH CALCULATED COUNTS
          ========================================== */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {categories.map((cat, index) => {
          const matchingCount = workers.filter(w => w.specialty === cat).length;

          return (
            <View key={index} style={styles.categoryTile}>
              <View>
                <Text style={styles.categoryNameText}>{cat}</Text>
                <Text style={styles.subCounterText}>{matchingCount} Specialists Registered</Text>
              </View>
              <TouchableOpacity style={styles.deleteActionBtn} onPress={() => handleConfirmDelete(cat)}>
                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  titleTitle: { fontSize: 22, fontWeight: 'bold', color: '#111', marginVertical: 12 },
  entryRow: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  inputBox: { flex: 1, borderWidth: 1, borderColor: '#EEE', borderRadius: 8, height: 46, paddingHorizontal: 12, backgroundColor: '#FAFAFA', color: '#111' },
  addBtn: { backgroundColor: '#F4B41A', height: 46, borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center', marginLeft: 8 },
  addBtnTxt: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  categoryTile: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: '#F5F5F5', backgroundColor: '#FAFAFA', borderRadius: 10, marginBottom: 10 },
  categoryNameText: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  subCounterText: { fontSize: 12, color: '#666', marginTop: 2 },
  deleteActionBtn: { padding: 6 }
});