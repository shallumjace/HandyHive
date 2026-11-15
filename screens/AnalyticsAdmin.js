import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function AnalyticsAdmin() {
  const monthlyVolumeData = [
    { month: 'Jan', count: 45 }, { month: 'Feb', count: 70 }, 
    { month: 'Mar', count: 110 }, { month: 'Apr', count: 95 }, 
    { month: 'May', count: 130 }
  ];

  const weeklyReportsData = [
    { label: 'Wk 1', lines: 8 }, { label: 'Wk 2', lines: 3 }, 
    { label: 'Wk 3', lines: 5 }, { label: 'Wk 4', lines: 2 }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitleHeader}>Statistical Operations Matrix</Text>

      {/* ==========================================
          CHART BLOCK 1: MONTHLY BOOKINGS VOLUME
          ========================================== */}
      <View style={styles.chartBlockCard}>
        <Text style={styles.chartCardTitle}>Monthly Bookings Volume Trend</Text>
        <View style={styles.barGraphWrapperFrame}>
          {monthlyVolumeData.map((data, idx) => (
            <View key={idx} style={styles.barColumnWrapper}>
              <View style={styles.barOuterLane}>
                <View style={[styles.barInnerActiveColor, { height: data.count }]} />
              </View>
              <Text style={styles.chartAxisLabel}>{data.month}</Text>
              <Text style={styles.chartDataIndicator}>{data.count}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ==========================================
          CHART BLOCK 2: WEEKLY INCIDENT REPORTS
          ========================================== */}
      <View style={styles.chartBlockCard}>
        <Text style={styles.chartCardTitle}>Weekly Client Incident Submissions</Text>
        <View style={styles.barGraphWrapperFrame}>
          {weeklyReportsData.map((data, idx) => (
            <View key={idx} style={styles.barColumnWrapper}>
              <View style={styles.barOuterLane}>
                {/* Scaled multiplication factor handles small numbers */}
                <View style={[styles.barInnerActiveColor, { height: data.lines * 12, backgroundColor: '#FF3B30' }]} />
              </View>
              <Text style={styles.chartAxisLabel}>{data.label}</Text>
              <Text style={styles.chartDataIndicator}>{data.lines}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  pageTitleHeader: { fontSize: 22, fontWeight: 'bold', color: '#111', marginVertical: 12 },
  chartBlockCard: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEE', padding: 16, borderRadius: 12, marginBottom: 16 },
  chartCardTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  barGraphWrapperFrame: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 160, paddingBottom: 10 },
  barColumnWrapper: { alignItems: 'center' },
  barOuterLane: { width: 24, height: 130, backgroundColor: '#EFEFEF', borderRadius: 12, justifyContent: 'flex-end', overflow: 'hidden' },
  barInnerActiveColor: { width: '100%', backgroundColor: '#F4B41A', borderRadius: 12 },
  chartAxisLabel: { fontSize: 11, fontWeight: '600', color: '#666', marginTop: 6 },
  chartDataIndicator: { fontSize: 10, color: '#999', marginTop: 1 }
});