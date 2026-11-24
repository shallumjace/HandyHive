import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';

const chartCount = (records, iso, key) => records.filter(r => {
  const raw = r[key] || r.createdAt || '';
  if (!raw) return false;
  const date = new Date(raw);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0,7)===iso;
}).length;
const lastMonths = () => Array.from({length:6},(_,i)=>{
  const today = new Date();
  const date = new Date(Date.UTC(today.getFullYear(),today.getMonth()-(5-i),1,12));
  return {key:date.toISOString().slice(0,7),label:date.toLocaleString('en-US',{month:'short',timeZone:'UTC'})};
});
export default function AnalyticsAdmin() {
  const {bookings,reports,reviews,clients,workers} = useContext(AppContext);
  const [metric,setMetric]=useState('Bookings');
  const months=lastMonths();
  const datasets={Bookings:bookings,Reports:reports,Reviews:reviews};
  const rows=months.map(m=>({...m,count:chartCount(datasets[metric],m.key, 'createdAt')}));
  const max=Math.max(1,...rows.map(x=>x.count));
  return <ScrollView style={styles.page}>
    <Text style={styles.title}>Statistical Operations Matrix</Text>
    <View style={styles.summary}>
      {[['Clients',clients.length],['Workers',workers.length],['Bookings',bookings.length],['Completed',bookings.filter(b=>b.status==='Completed').length],['Reports',reports.length]].map(([label,value])=><View key={label} style={styles.tile}><Text style={styles.number}>{value}</Text><Text style={styles.caption}>{label}</Text></View>)}
    </View>
    <Text style={styles.section}>Monthly Activity Trend (Last 6 Months)</Text>
    <View style={styles.filters}>{Object.keys(datasets).map(name=><TouchableOpacity key={name} onPress={()=>setMetric(name)} style={[styles.filter,metric===name&&styles.chosen]}><Text style={{color:metric===name?'#FFF':'#555',fontSize:12,fontWeight:'bold'}}>{name}</Text></TouchableOpacity>)}</View>
    <View style={styles.graph}>{rows.map(r=><View key={r.key} style={styles.barCol}><Text style={styles.numberSmall}>{r.count}</Text><View style={styles.track}><View style={[styles.bar,{height:Math.round(r.count/max*125)}]} /></View><Text style={styles.caption}>{r.label}</Text></View>)}</View>
    <Text style={styles.note}>Data comes from saved records. Older seed bookings without creation dates are excluded from the monthly chart; they remain in the total bookings figure.</Text>
  </ScrollView>;
}
const styles=StyleSheet.create({page:{flex:1,backgroundColor:'#FFF',padding:16},title:{fontSize:22,fontWeight:'bold',marginVertical:12},summary:{flexDirection:'row',flexWrap:'wrap',marginBottom:24},tile:{backgroundColor:'#FFF9E6',width:'30%',marginRight:'3%',marginBottom:8,borderRadius:8,padding:12,alignItems:'center'},number:{fontSize:22,fontWeight:'bold'},caption:{fontSize:11,color:'#777',marginTop:4},section:{fontSize:16,fontWeight:'bold',marginBottom:12},filters:{flexDirection:'row',marginBottom:14},filter:{backgroundColor:'#FAFAFA',borderColor:'#EEE',borderWidth:1,paddingVertical:9,paddingHorizontal:14,borderRadius:6,marginRight:6},chosen:{backgroundColor:'#F4B41A',borderColor:'#F4B41A'},graph:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around',padding:16,backgroundColor:'#FAFAFA',borderRadius:12,borderColor:'#EEE',borderWidth:1},barCol:{alignItems:'center',flex:1},numberSmall:{fontSize:11,color:'#888'},track:{height:125,width:24,backgroundColor:'#EEE',borderRadius:9,justifyContent:'flex-end',overflow:'hidden',marginTop:5},bar:{backgroundColor:'#F4B41A',width:24,borderRadius:8},note:{fontSize:11,color:'#777',marginTop:12,lineHeight:17}});
