import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';
export default function NotificationsScreen() {
  const {user,notifications,markNotificationRead} = useContext(AppContext);
  const list = notifications.filter(n=>n.recipientUserId===user?.id).slice().reverse();
  return <ScrollView style={styles.page}>
    <Text style={styles.title}>Activity Updates</Text>
    {list.length===0&&<Text style={styles.empty}>No notifications yet.</Text>}
    {list.map(n=><TouchableOpacity key={n.id} style={[styles.card,!n.isRead&&styles.unread]} onPress={()=>markNotificationRead(n.id)}>
      <Text style={styles.text}>{n.message}</Text>
      <Text style={styles.when}>{n.createdAt} {n.isRead?'':' • Unread'}</Text>
    </TouchableOpacity>)}
  </ScrollView>;
}
const styles=StyleSheet.create({page:{flex:1,backgroundColor:'#FFF',padding:16},title:{fontSize:22,fontWeight:'bold',marginVertical:12},card:{backgroundColor:'#FAFAFA',borderColor:'#EEE',borderWidth:1,borderRadius:9,padding:14,marginBottom:10},unread:{backgroundColor:'#FFF9E6',borderColor:'#FFE4B3'},text:{fontSize:14,color:'#333',lineHeight:20},when:{fontSize:11,color:'#777',marginTop:8},empty:{color:'#999',marginTop:50,textAlign:'center'}});
