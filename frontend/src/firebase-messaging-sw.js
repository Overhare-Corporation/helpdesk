importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBYgfIQzbRwkaBK4_HVE9B1DBVXvUAOFWs",
    authDomain: "appsim-gt.firebaseapp.com",
    databaseURL: "https://appsim-gt-default-rtdb.firebaseio.com",
    projectId: "appsim-gt",
    storageBucket: "appsim-gt.firebasestorage.app",
    messagingSenderId: "990425453290",
    appId: "1:990425453290:web:5560329cdc4e08bb6afd93",
    measurementId: "G-XG0Z973014"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'appsim.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
