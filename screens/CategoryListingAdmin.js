import { notice, confirmAction } from '../utils/feedback';
import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

export default function CategoryListingAdmin() {
  const { categories, workers, addCategory, archiveCategory, archivedCategories } = useContext(AppContext);
  const [newCat, setNewCat] = useState('');

  const handleCreate = async () => {
    if (!newCat.trim()) return;
    const success = await addCategory(newCat.trim());
    if (success) {
      setNewCat('');
      notice('Operation Success', 'New category cluster successfully saved to storage.');
    } else {
      notice('Duplicate Node', 'This specialty category already exists inside the engine.');
    }
  };

  const handleArchiveToggle = (name) => {
    const isArchived = archivedCategories.includes(name);
    confirmAction(
      isArchived ? 'Restore category?' : 'Archive category?',
      isArchived ? `Make "${name}" available for new bookings again?` : `Archive "${name}"? Existing workers and booking history will be preserved.`,
      async () => {
        try { await archiveCategory(name,!isArchived); }
        catch(e) { notice('Unable to update',e.message); }
      }, isArchived ? 'Unarchive' : 'Archive', !isArchived
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
                <Text style={styles.categoryNameText}>{cat} {archivedCategories.includes(cat) ? "(Archived)" : ""}</Text>
                <Text style={styles.subCounterText}>{matchingCount} Specialists Registered</Text>
              </View>
              <TouchableOpacity style={styles.deleteActionBtn} onPress={() => handleArchiveToggle(cat)}>
                <Ionicons name={archivedCategories.includes(cat) ? "refresh-outline" : "archive-outline"} size={20} color="#EB5757" />
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