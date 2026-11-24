import { notice, confirmAction } from '../utils/feedback';
import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
export default function RegisterFormScreen() {
  const {screenParam,navigate,register,activeCategories} = useContext(AppContext);
  const role = screenParam==='Worker'?'Worker':'Client';
  const [name,setName]=useState(''); const [email,setEmail]=useState('');
  const [password,setPassword]=useState(''); const [visible,setVisible]=useState(false);
  const [sex,setSex]=useState(''); const [age,setAge]=useState('');
  const [birthday,setBirthday]=useState(''); const [phone,setPhone]=useState('');
  const [specialty,setSpecialty]=useState(''); const [minimumServiceFee,setMinimumServiceFee]=useState('');
  const [bio,setBio]=useState(''); const [cert,setCert]=useState('');
  const [submitting,setSubmitting]=useState(false);
  useEffect(()=>{if(activeCategories.length&&!activeCategories.includes(specialty))setSpecialty(activeCategories[0]);},[activeCategories.join('|')]);
  const submit=async()=>{
    if(submitting)return;
    if(!name.trim()||!email.trim()||!password||!sex.trim()||!age||!birthday||!phone.trim()){
      notice('Incomplete registration','Please complete all required fields.');return;
    }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(birthday)||!Number.isInteger(Number(age))||Number(age)<18||Number(age)>110){
      notice('Invalid details','Enter a valid birthdate (YYYY-MM-DD) and age (18–110).');return;
    }
    setSubmitting(true);
    try {
      await register({name,email,password,sex,age:Number(age),birthday,phone,role,
        ...(role==='Worker'?{specialty,minimumServiceFee,bio,certificate:cert}:{}),
      });
      notice('Registration complete','You can now sign in to your account.');
      navigate('Login');
    } catch(e){notice('Registration failed',e.message);} finally{setSubmitting(false);}
  };
  return <ScrollView style={styles.page} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>Registration Portal</Text><Text style={styles.sub}>Setting up {role} access.</Text>
    <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName}/>
    <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"/>
    <View style={styles.pwRow}><TextInput style={[styles.input,{flex:1,marginBottom:0}]} placeholder="Password (8+ characters)" value={password} onChangeText={setPassword} secureTextEntry={!visible}/>
      <TouchableOpacity style={styles.eye} onPress={()=>setVisible(p=>!p)} accessibilityLabel={visible?'Hide password':'Show password'}><Text>{visible?'Hide':'Show'}</Text></TouchableOpacity></View>
    <TextInput style={styles.input} placeholder="Sex" value={sex} onChangeText={setSex}/>
    <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric"/>
    <TextInput style={styles.input} placeholder="Birthdate (YYYY-MM-DD)" value={birthday} onChangeText={setBirthday}/>
    <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad"/>
    {role==='Worker'&&<View style={styles.workerPanel}>
      <Text style={styles.label}>Select Service Category</Text>
      <View style={styles.chips}>{activeCategories.map(c=><TouchableOpacity key={c} style={[styles.chip,c===specialty&&styles.selected]} onPress={()=>setSpecialty(c)}><Text style={{color:c===specialty?'#FFF':'#555'}}>{c}</Text></TouchableOpacity>)}</View>
      <Text style={styles.label}>Minimum Service Fee (₱)</Text>
      <TextInput style={styles.input} placeholder="e.g. 250" value={minimumServiceFee} onChangeText={setMinimumServiceFee} keyboardType="decimal-pad" />
      <Text style={styles.sub}>Your starting charge per job, not an hourly rate. Final price may depend on the agreed work.</Text>
      <TextInput style={[styles.input,{height:72,textAlignVertical:'top'}]} multiline placeholder="Professional Bio" value={bio} onChangeText={setBio}/>
      <TextInput style={styles.input} placeholder="Certifications / Achievements" value={cert} onChangeText={setCert}/>
    </View>}
    <TouchableOpacity style={styles.button} disabled={submitting} onPress={submit}><Text style={styles.buttonText}>{submitting?'Registering...':'Register'}</Text></TouchableOpacity>
    <TouchableOpacity style={styles.back} onPress={()=>navigate('RegisterRoleScreen')}><Text>Back</Text></TouchableOpacity>
  </ScrollView>;
}
const styles=StyleSheet.create({page:{flex:1,backgroundColor:'#FFF',padding:16},title:{fontSize:22,fontWeight:'bold',marginTop:10},sub:{fontSize:13,color:'#666',marginBottom:16,marginTop:3},input:{height:46,borderWidth:1,borderColor:'#DDD',backgroundColor:'#FAFAFA',borderRadius:8,paddingHorizontal:12,marginBottom:12,color:'#111'},pwRow:{flexDirection:'row',alignItems:'center',marginBottom:12},eye:{paddingHorizontal:12,height:46,justifyContent:'center'},workerPanel:{backgroundColor:'#FAF8F0',padding:13,borderRadius:9,borderLeftColor:'#F4B41A',borderLeftWidth:3,marginTop:12},label:{fontSize:12,fontWeight:'bold',color:'#666',marginBottom:8},chips:{flexDirection:'row',flexWrap:'wrap',marginBottom:12},chip:{backgroundColor:'#FFF',borderColor:'#DDD',borderWidth:1,padding:8,borderRadius:6,marginRight:6,marginBottom:6},selected:{backgroundColor:'#F4B41A'},button:{backgroundColor:'#F4B41A',height:48,borderRadius:8,alignItems:'center',justifyContent:'center',marginTop:12},buttonText:{fontWeight:'bold',color:'#FFF',fontSize:15},back:{padding:15,alignItems:'center',marginBottom:24}});
