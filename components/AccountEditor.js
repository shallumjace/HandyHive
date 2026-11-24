import { notice, confirmAction } from '../utils/feedback';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { money } from '../data/domain';

const Input = ({ label, value, onChangeText, secureTextEntry=false, keyboardType='default', multiline=false }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={[styles.field, multiline && {height:72,textAlignVertical:'top'}]}
      placeholder={label} value={String(value ?? '')} onChangeText={onChangeText}
      secureTextEntry={secureTextEntry} keyboardType={keyboardType} multiline={multiline}
      autoCapitalize={label === 'Email' ? 'none' : 'sentences'} />
  </View>
);

export default function AccountEditor({ role }) {
  const { user, logout, updateProfile, changePassword, activeCategories } = useContext(AppContext);
  const [mode, setMode] = useState('Overview');
  const [form, setForm] = useState({});
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving,setSaving] = useState(false);
  useEffect(() => {
    setForm({
      name:user?.name || '', email:user?.email || '', phone:user?.phone || '', sex:user?.sex || '', age:String(user?.age ?? ''), birthday:user?.birthday || '',
      bio:user?.bio || '', certificate:user?.certificate || '',
      specialty:user?.specialty || '', serviceArea:user?.serviceArea || '',
      availability:user?.availability || '',
      minimumServiceFee:String(user?.minimumServiceFee ?? ''),
    });
  }, [user?.id]);
  const change = (key, value) => setForm(p => ({...p,[key]:value}));
  const apply = async (callback, success) => {
    if (saving) return;
    setSaving(true);
    try { await callback(); notice('Saved', success); setMode('Overview'); }
    catch (e) { notice('Could not save',e.message); }
    finally { setSaving(false); }
  };
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.profileCard}>
        <Text style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || '?'}</Text>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.sub}>{user?.email}</Text>
        <Text style={styles.sub}>{role === 'Worker' ? `${user?.specialty} • Minimum service fee: ${money(user?.minimumServiceFee)}` : role}</Text>
        {role === 'Worker' && user?.pricingNeedsReview && (
          <Text style={styles.warning}>Provisional fee from old hourly data. Confirm or change it under Manage Profile.</Text>
        )}
      </View>
      {mode === 'Overview' && (
        <View>
          <TouchableOpacity style={styles.menuItem} onPress={() => setMode('Edit')}>
            <Text style={styles.menuText}>Manage Profile / Edit Profile</Text><Text style={styles.next}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setMode('Password')}>
            <Text style={styles.menuText}>Change Password</Text><Text style={styles.next}>›</Text>
          </TouchableOpacity>
        </View>
      )}
      {mode === 'Edit' && (
        <View style={styles.panel}>
          <Text style={styles.head}>Edit Profile</Text>
          <Input label="Name" value={form.name} onChangeText={v=>change('name',v)} />
          <Input label="Email" value={form.email} onChangeText={v=>change('email',v)} keyboardType="email-address" />
          <Input label="Phone" value={form.phone} onChangeText={v=>change('phone',v)} keyboardType="phone-pad" />
          <Input label="Sex" value={form.sex} onChangeText={v=>change('sex',v)} />
          <Input label="Age" value={form.age} onChangeText={v=>change('age',v)} keyboardType="numeric" />
          <Input label="Birthday (YYYY-MM-DD)" value={form.birthday} onChangeText={v=>change('birthday',v)} />
          {role === 'Worker' && (
            <>
              <Text style={styles.label}>Specialty</Text>
              <View style={styles.chips}>
                {activeCategories.map(c => <TouchableOpacity key={c} style={[styles.chip,form.specialty===c&&styles.chipActive]} onPress={()=>change('specialty',c)}>
                  <Text style={{color:form.specialty===c?'#FFF':'#555'}}>{c}</Text>
                </TouchableOpacity>)}
              </View>
              <Input label="Minimum Service Fee (₱)" value={form.minimumServiceFee} onChangeText={v=>change('minimumServiceFee',v)} keyboardType="decimal-pad" />
              <Input label="Service Area" value={form.serviceArea} onChangeText={v=>change('serviceArea',v)} />
              <Input label="Availability / Working Schedule" value={form.availability} onChangeText={v=>change('availability',v)} />
              <Input label="Certifications" value={form.certificate} onChangeText={v=>change('certificate',v)} />
              <Input label="Professional Bio" value={form.bio} onChangeText={v=>change('bio',v)} multiline />
            </>
          )}
          <TouchableOpacity style={styles.save} disabled={saving} onPress={()=>apply(()=>updateProfile(form),'Your profile was updated.')}><Text style={styles.saveText}>{saving?'Saving...':'Save Profile'}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.back} onPress={()=>setMode('Overview')}><Text>Back</Text></TouchableOpacity>
        </View>
      )}
      {mode === 'Password' && (
        <View style={styles.panel}>
          <Text style={styles.head}>Change Password</Text>
          <Input label="Current Password" secureTextEntry value={oldPassword} onChangeText={setOldPassword} />
          <Input label="New Password (8+ characters)" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
          <Input label="Confirm New Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
          <TouchableOpacity style={styles.save} disabled={saving} onPress={()=>apply(async()=>{
            await changePassword(oldPassword,newPassword,confirmPassword);
            setOldPassword(''); setNewPassword(''); setConfirmPassword('');
          },'Your password was changed.')}><Text style={styles.saveText}>{saving?'Saving...':'Change Password'}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.back} onPress={()=>setMode('Overview')}><Text>Back</Text></TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.logout} onPress={logout}><Text style={{color:'#EB5757',fontWeight:'bold'}}>Logout</Text></TouchableOpacity>
    </ScrollView>
  );
}
const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:'#FFF',padding:16},profileCard:{alignItems:'center',backgroundColor:'#FAFAFA',padding:20,borderRadius:12,borderWidth:1,borderColor:'#EEE',marginVertical:15},
  avatar:{backgroundColor:'#FFF9E6',width:64,height:64,borderRadius:32,overflow:'hidden',textAlign:'center',textAlignVertical:'center',fontSize:28,color:'#F4B41A',fontWeight:'bold',marginBottom:10},
  name:{fontWeight:'bold',fontSize:19,color:'#111'},sub:{fontSize:13,color:'#666',marginTop:5,textAlign:'center'},warning:{marginTop:10,color:'#A65B00',fontSize:12,textAlign:'center'},
  menuItem:{paddingVertical:16,borderBottomColor:'#EEE',borderBottomWidth:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},menuText:{fontSize:15,color:'#333'},next:{fontSize:20,color:'#AAA'},
  panel:{backgroundColor:'#FAFAFA',padding:14,borderWidth:1,borderColor:'#EEE',borderRadius:10,marginBottom:16},head:{fontWeight:'bold',fontSize:18,marginBottom:14},fieldWrap:{marginBottom:10},label:{fontSize:12,fontWeight:'bold',color:'#555',marginBottom:5},
  field:{height:45,borderColor:'#DDD',borderWidth:1,borderRadius:8,backgroundColor:'#FFF',paddingHorizontal:12,color:'#111'},save:{backgroundColor:'#F4B41A',padding:14,borderRadius:8,alignItems:'center',marginTop:7},saveText:{fontWeight:'bold',color:'#FFF'},back:{padding:14,alignItems:'center'},
  chips:{flexDirection:'row',flexWrap:'wrap',marginBottom:12},chip:{padding:9,borderRadius:7,backgroundColor:'#FFF',borderColor:'#DDD',borderWidth:1,marginRight:6,marginBottom:6},chipActive:{backgroundColor:'#F4B41A'},logout:{borderColor:'#EB5757',borderWidth:1,padding:14,borderRadius:8,alignItems:'center',marginTop:12},disclaimer:{fontSize:11,color:'#999',lineHeight:16,marginVertical:18},
});
