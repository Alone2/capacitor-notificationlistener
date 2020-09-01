package ch.asinz.capacitornotificationlistener;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.provider.Settings;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

@NativePlugin(
        permissions = {
                Manifest.permission.BIND_NOTIFICATION_LISTENER_SERVICE
        }
)
public class NotificationListenerPlugin extends Plugin {
    private static final String TAG = NotificationListenerPlugin.class.getSimpleName();
    private static final String EVENT_NOTIFICATION_REMOVED = "notificationRemovedEvent";
    private static final String EVENT_NOTIFICATION_RECEIVED = "notificationReceivedEvent";

    private NotificationReceiver notificationreceiver;

    @PluginMethod()
    public void startListening(PluginCall call) {
        if (!hasPermission(Manifest.permission.BIND_NOTIFICATION_LISTENER_SERVICE)) {
            call.reject("No permission");
        }
        if (notificationreceiver == null) {
            call.success();
        }
        notificationreceiver = new NotificationReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(NotificationService.ACTION_RECEIVE);
        filter.addAction(NotificationService.ACTION_REMOVE);
        getContext().registerReceiver(notificationreceiver, filter);
        call.success();
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        startActivityForResult(call, new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS), 0);
        call.success();
    }

    @PluginMethod()
    public void stopListening(PluginCall call) {
        if (notificationreceiver == null) {
            call.success();
        }
        getContext().unregisterReceiver(notificationreceiver);
        call.success();
    }

    private class NotificationReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            JSObject jo = new JSObject();
            try {
                jo.put("apptitle", intent.getStringExtra(NotificationService.ARG_APPTITLE));
                jo.put("text", intent.getStringExtra(NotificationService.ARG_TEXT));
                // doesn't work 'cause no arrays D=
                jo.put("textlines", intent.getStringArrayExtra(NotificationService.ARG_TEXTLINES));
                jo.put("title", intent.getStringExtra(NotificationService.ARG_TITLE));
                jo.put("time", intent.getLongExtra(NotificationService.ARG_TIME, System.currentTimeMillis()));
                jo.put("package", intent.getStringExtra(NotificationService.ARG_PACKAGE));
            } catch (Exception e) {
                Log.e(TAG, "JSObject Error");
                return;
            }
            switch (intent.getAction()){
                case NotificationService.ACTION_RECEIVE:
                    notifyListeners(EVENT_NOTIFICATION_RECEIVED, jo);
                    break;
                case NotificationService.ACTION_REMOVE :
                    notifyListeners(EVENT_NOTIFICATION_REMOVED, jo);
                    break;
            }
        }
    }
}
