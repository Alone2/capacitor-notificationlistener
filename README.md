# capacitor-notificationlistener

## Installation

```
npm install ...
npx cap sync
```

Register this plugin with  ```add(NotificationListenerPlugin.class)``` in 'MainActivity.java'

### Permissions
Add the following to AndroidManifest.xml:

```
<service android:name="ch.asinz.capacitornotificationlistener.NotificationService"
            android:label="@string/app_name"
            android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE">
            <intent-filter>
                <action android:name="android.service.notification.NotificationListenerService" />
            </intent-filter>
 </service>
```

## Usage

