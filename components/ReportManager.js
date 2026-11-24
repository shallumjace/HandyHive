import { notice, confirmAction } from '../utils/feedback';
import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
export default function ReportManager() {
  const { reports, updateReportStatus } = useContext(AppContext);
  const [selectedId,setSelectedId] = useState(null);
  const selected = reports.find(r=>r.id===selectedId);
  const update=async(status)=>{try{const changed=await updateReportStatus(selected.id,status);notice(changed?'Status updated':'No change',changed?'Client has been notified.':'The report already has this status.');}catch(e){notice('Update failed',e.message);}};
  return <View>
    <Text style={styles.heading}>Client Reports ({reports.length})</Text>
    {reports.length===0 && <Text style={styles.empty}>No client reports have been submitted yet.</Text>}
    {reports.slice().sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')).map(r=><TouchableOpacity key={r.id} style={styles.card} onPress={()=>setSelectedId(r.id)}>
      <View style={styles.row}><Text style={styles.name}>{r.clientName||r.clientId}</Text><Text style={styles.status}>{r.status}</Text></View>
      <Text style={styles.caption}>Reported provider: {r.workerName||r.workerId}</Text>
      <Text style={styles.description} numberOfLines={2}>{r.reason}: {r.description}</Text>
      <Text style={styles.link}>View report and change status →</Text>
    </TouchableOpacity>)}
    <Modal transparent visible={!!selected} onRequestClose={()=>setSelectedId(null)} animationType="slide">
      <View style={styles.scrim}><View style={styles.modal}>
        <View style={styles.row}><Text style={styles.heading}>Report Details</Text><TouchableOpacity onPress={()=>setSelectedId(null)}><Text style={styles.close}>✕</Text></TouchableOpacity></View>
        {selected && <ScrollView>
          {[
            ['Report ID',selected.id],['Client',selected.clientName||selected.clientId],
            ['Provider',selected.workerName||selected.workerId],['Booking',selected.bookingId],
            ['Reason',selected.reason],['Description',selected.description],['Status',selected.status],
            ['Submitted',selected.createdAt],
          ].map(([k,v])=><View key={k} style={styles.field}><Text style={styles.caption}>{k}</Text><Text style={styles.name}>{String(v||'Not provided')}</Text></View>)}
          <Text style={styles.heading}>Status History</Text>
          {(selected.statusHistory||[]).map((h,i)=><Text key={i} style={styles.caption}>{h.status} • {h.at}</Text>)}
          <TouchableOpacity style={styles.button} onPress={()=>update('Under Investigation')}><Text style={styles.buttonText}>Mark Under Investigation</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.button,{backgroundColor:'#2F80ED'}]} onPress={()=>update('Reviewed')}><Text style={styles.buttonText}>Mark Reviewed</Text></TouchableOpacity>
        </ScrollView>}
      </View></View>
    </Modal>
  </View>;
}
const styles=StyleSheet.create({heading:{fontSize:16,fontWeight:'bold',color:'#111',marginVertical:12},empty:{color:'#888',padding:14},card:{borderWidth:1,borderColor:'#FFE4B3',backgroundColor:'#FFFDF7',borderRadius:8,padding:13,marginBottom:10},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},name:{fontSize:13,color:'#222',fontWeight:'bold',marginTop:3},status:{fontSize:11,color:'#B8860B',fontWeight:'bold'},caption:{fontSize:12,color:'#777',marginTop:6},description:{fontSize:13,color:'#555',marginTop:8},link:{fontSize:12,color:'#2F80ED',fontWeight:'bold',marginTop:8},scrim:{flex:1,backgroundColor:'rgba(0,0,0,.5)',justifyContent:'center',padding:20},modal:{maxHeight:'83%',backgroundColor:'#FFF',borderRadius:12,padding:18},close:{fontSize:20,padding:4},field:{borderBottomWidth:1,borderBottomColor:'#F3F3F3',paddingVertical:8},button:{backgroundColor:'#F4B41A',padding:12,borderRadius:8,alignItems:'center',marginTop:12},buttonText:{color:'#FFF',fontWeight:'bold'}});
