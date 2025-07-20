import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Alert } from 'react-native';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

const App = () => {
  useEffect(() => {
    requestUserPermission();

    // Foreground message handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(remoteMessage.notification?.title, remoteMessage.notification?.body);
    });

    // Background/Killed: handled by native module

    messaging().onNotificationOpenedApp(remoteMessage => {
      // Navigate or handle deep link here based on remoteMessage.data
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        // App opened via pushing notification
      }
    });

    return unsubscribe;
  }, []);

  // ...the rest of your component (UI)
};
export default App;
