// HR Connect Service Worker
var CACHE_NAME = 'hr-connect-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(err) { data = {title:'HR Connect', body: e.data ? e.data.text() : 'New update!'}; }
  e.waitUntil(
    self.registration.showNotification(data.title || 'HR Connect', {
      body: data.body || 'You have a new update!',
      icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      tag: 'hr-update',
      requireInteraction: true,
      data: { url: self.location.origin + self.location.pathname.replace('sw.js','') }
    })
  );
});

// Click on notification opens the app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window'}).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url && 'focus' in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(e.notification.data.url || '/');
    })
  );
});
