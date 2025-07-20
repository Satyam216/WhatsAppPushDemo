import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import LinearGradient from 'react-native-linear-gradient';

const App = () => {
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Notification:', remoteMessage);
    });

    return unsubscribe;
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted.');
    }

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Android notification permission granted.');
      } else {
        console.log('Android notification permission denied.');
      }
    }

    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      setFcmToken(token);
    } catch (error) {
      console.log('Failed to get FCM token:', error);
    }
  }

  return (
    <LinearGradient
      colors={['#7F00FF', '#E100FF', '#FF8C00']}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Text style={styles.title}>FCM Notification Demo</Text>
        <Text style={styles.subtitle}>Your Device Token</Text>

        <ScrollView style={styles.tokenBox}>
          <Text selectable style={styles.tokenText}>
            {fcmToken || 'Fetching token...'}
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made by Satyam Jain</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Satyam216/')}>
            <Text style={styles.link}>github.com/Satyam216</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#f1f1f1',
    marginBottom: 10,
    textAlign: 'center',
  },
  tokenBox: {
    maxHeight: 200,
    width: '100%',
    backgroundColor: '#ffffffdd',
    borderRadius: 12,
    padding: 12,
    borderColor: '#eee',
    borderWidth: 1,
    marginBottom: 24,
  },
  tokenText: {
    fontSize: 13,
    color: '#333',
  },
  footer: {
    alignItems: 'center',
    marginTop: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#f1f1f1',
  },
  link: {
    fontSize: 14,
    color: '#fff',
    textDecorationLine: 'underline',
    marginTop: 2,
  },
});

export default App;
