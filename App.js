import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, View, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission required',
          'Push notifications need the appropriate permissions.'
        );
        return;
      }

      // Replace 'your-project-id' with your actual Expo project ID
      const projectId = '98407980-3f2c-4be0-98b1-25bf498c9fb3';

      const pushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      console.log(pushTokenData);

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }

    configurePushNotifications();
  }, []);

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('NOTIFICATION RECEIVED');
        console.log(notification);
        const userName = notification.request.content.data.userName;
        console.log(userName);
      }
    );

    const subscription2 =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('NOTIFICATION RESPONSE RECEIVED');
        console.log(response);
        const userName = response.notification.request.content.data.userName;
        console.log(userName);
      });

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'My First local notification',
        body: 'This is the body of the notification.',
        data: { userName: 'Max' },
      },
      trigger: {
        seconds: 5,
      },
    });
  }

  function sendPushNotificationHandler() {
    fetch('https://exp.host/--/api/v2/push/send',{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        to: 'ExponentPushToken[PHLAQ0EMl8OxWcyoV9N1Ed]',
        title: 'Test - sent from a device!',
        bodu: 'This is a test!'
      })
    });
  }

  return (
    <View style={styles.container}>
      <Button title="Schedule Notification" onPress={scheduleNotificationHandler} />
      <Button title='Send Push Notification'  onPress={sendPushNotificationHandler}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
