import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

import HomepageAdmin from './HomepageAdmin';
import CategoryListingAdmin from './CategoryListingAdmin';
import UsersAdmin from './UsersAdmin';
import AnalyticsAdmin from './AnalyticsAdmin';
import ProfileAdmin from './ProfileAdmin';

export default function AdminDashboard() {
  const { currentScreen, navigate } = useContext(AppContext);

  const renderSubScreen = () => {
    switch (currentScreen) {
      case 'AdminHome': return <HomepageAdmin />;
      case 'AdminCategories': return <CategoryListingAdmin />;
      case 'AdminUsers': return <UsersAdmin />;
      case 'AdminAnalytics': return <AnalyticsAdmin />;
      case 'AdminProfile': return <ProfileAdmin />;
      default: return <HomepageAdmin />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {renderSubScreen()}
      </View>

      {/* ==========================================
          CUSTOM BOTOM NAVIGATION BAR
          ========================================== */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('AdminHome')}>
          <Ionicons name="apps" size={20} color={currentScreen === 'AdminHome' ? '#F4B41A' : '#777'} />
          <Text style={[styles.tabTxt, currentScreen === 'AdminHome' && styles.activeTxt]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('AdminCategories')}>
          <Ionicons name="grid" size={20} color={currentScreen === 'AdminCategories' ? '#F4B41A' : '#777'} />
          <Text style={[styles.tabTxt, currentScreen === 'AdminCategories' && styles.activeTxt]}>Services</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('AdminUsers')}>
          <Ionicons name="people" size={20} color={currentScreen === 'AdminUsers' ? '#F4B41A' : '#777'} />
          <Text style={[styles.tabTxt, currentScreen === 'AdminUsers' && styles.activeTxt]}>Users</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('AdminAnalytics')}>
          <Ionicons name="bar-chart" size={20} color={currentScreen === 'AdminAnalytics' ? '#F4B41A' : '#777'} />
          <Text style={[styles.tabTxt, currentScreen === 'AdminAnalytics' && styles.activeTxt]}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => navigate('AdminProfile')}>
          <Ionicons name="person-circle" size={20} color={currentScreen === 'AdminProfile' ? '#F4B41A' : '#777'} />
          <Text style={[styles.tabTxt, currentScreen === 'AdminProfile' && styles.activeTxt]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  tabBar: { flexDirection: 'row', height: 60, borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FFF', paddingBottom: 5 },
  tabBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabTxt: { fontSize: 10, color: '#777', marginTop: 3, fontWeight: '500' },
  activeTxt: { color: '#F4B41A', fontWeight: 'bold' }
});