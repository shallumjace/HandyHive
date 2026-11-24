import { Alert, Platform } from 'react-native';

// React Native Alert.alert does not behave consistently on Expo Web.
export function notice(title, message) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.alert(`${title}\n${message || ''}`);
  } else {
    Alert.alert(title, message || '');
  }
}
export function confirmAction(title, message, onConfirm, label='Confirm', destructive=false) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.confirm(`${title}\n${message}`)) onConfirm();
  } else {
    Alert.alert(title, message, [
      {text:'Cancel',style:'cancel'},
      {text:label,style:destructive?'destructive':'default',onPress:onConfirm},
    ]);
  }
}
