package ch.asinz.capacitornotificationlistener;

import android.Manifest;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.provider.Settings;
import android.util.Log;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONArray;


@CapacitorPlugin(
    name = "NotificationListener",
    permissions = {
        @Permission(strings = { Manifest.permission.BIND_NOTIFICATION_LISTENER_SERVICE }, alias = "observeNotifications"),
    }
)
public class NotificationListenerPlugin extends Plugin {
    private static final String TAG = NotificationListenerPlugin.class.getSimpleName();
    private static final String EVENT_NOTIFICATION_REMOVED = "notificationRemovedEvent";
    private static final String EVENT_NOTIFICATION_RECEIVED = "notificationReceivedEvent";

    private NotificationReceiver notificationreceiver;

    @PluginMethod()
    public void startListening(PluginCall call) {
        if (notificationreceiver != null) {
            call.reject("NotificationReceiver already exists");
            return;
        }
        notificationreceiver = new NotificationReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(NotificationService.ACTION_RECEIVE);
        filter.addAction(NotificationService.ACTION_REMOVE);
        getContext().registerReceiver(notificationreceiver, filter);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        startActivityForResult(call, new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS), "requestedPermission");
    }

    @ActivityCallback
    private void requestedPermission(PluginCall call, ActivityResult result) {}

    @PluginMethod
    public void isListening(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("value",  NotificationService.isConnected);
        call.resolve(ret);
    }

    @PluginMethod()
    public void stopListening(PluginCall call) {
        if (notificationreceiver == null) {
            call.reject("NotificationReceiver doesn't exists");
            return;
        }
        getContext().unregisterReceiver(notificationreceiver);
    }

    private class NotificationReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            JSObject jo = new JSObject();
            try {
                jo.put("apptitle", intent.getStringExtra(NotificationService.ARG_APPTITLE));
                jo.put("text", intent.getStringExtra(NotificationService.ARG_TEXT));
                JSONArray ja = new JSONArray();
                for (String k : intent.getStringArrayExtra(NotificationService.ARG_TEXTLINES))
                    ja.put(k);
                jo.put("textlines", ja.toString());
                jo.put("title", intent.getStringExtra(NotificationService.ARG_TITLE));
                jo.put("time", intent.getLongExtra(NotificationService.ARG_TIME, System.currentTimeMillis()));
                jo.put("package", intent.getStringExtra(NotificationService.ARG_PACKAGE));
                Log.d(TAG,jo.getString("package"));
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
