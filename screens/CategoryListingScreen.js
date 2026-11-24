import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';
import { money, averageRating } from '../data/domain';

// Optional category detail screen; uses live provider records (no mock profiles).
export default function CategoryListingScreen({category}) {
  const {activeCategories,workers,reviews,navigate,setSelectedWorkerId}=useContext(AppContext);
  const categoryName=activeCategories.includes(category)?category:activeCategories[0];
  const list=workers.filter(w=>w.specialty===categoryName);
  return <ScrollView style={styles.page}>
    <Text style={styles.heading}>{categoryName || 'Available Services'}</Text>
    {list.length===0 && <Text style={styles.empty}>No providers currently listed in this category.</Text>}
    {list.map(worker=><TouchableOpacity key={worker.id} style={styles.card} onPress={()=>{setSelectedWorkerId(worker.id);navigate('WorkerProfileScreen');}}>
      <Text style={styles.name}>{worker.name}</Text>
      <Text style={styles.meta}>{worker.specialty} • {worker.certificate || 'No certification listed'}</Text>
      <Text style={styles.rate}>Minimum service fee: {money(worker.minimumServiceFee)}</Text>
      <Text style={styles.meta}>{averageRating(reviews,worker.id)==null?'No ratings yet':`${averageRating(reviews,worker.id).toFixed(1)} / 5`}</Text>
    </TouchableOpacity>)}
    <TouchableOpacity onPress={()=>navigate('Home')}><Text style={styles.back}>Back to Services</Text></TouchableOpacity>
  </ScrollView>;
}
const styles=StyleSheet.create({page:{flex:1,padding:16,backgroundColor:'#FFF'},heading:{fontSize:22,fontWeight:'bold',marginBottom:16},card:{padding:15,backgroundColor:'#FAFAFA',borderRadius:9,borderColor:'#EEE',borderWidth:1,marginBottom:12},name:{fontSize:16,fontWeight:'bold'},meta:{fontSize:13,color:'#777',marginTop:5},rate:{fontSize:13,color:'#228833',fontWeight:'bold',marginTop:8},empty:{color:'#999'},back:{color:'#F4B41A',fontWeight:'bold',marginTop:16}});
