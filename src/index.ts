import { registerPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from "@capacitor/core";

import type { NotificationListenerPlugin, SystemNotification, PlainSystemNotification } from './definitions';

const NotificationListener = registerPlugin<NotificationListenerPlugin>(
    'NotificationListener',
    // {
    //   web: () => import('./web').then(m => new m.NotificationListenerWeb()),
    // },
);

export { SystemNotification } from './definitions';
export { NotificationListener };

const convert2SystemNotification = (info: PlainSystemNotification) : SystemNotification => {
    return {
        apptitle: info.apptitle,
        text: info.text,
        textlines: JSON.parse(info.textlines),
        title: info.title,
        time: new Date(info.time),
        package: info.package,
    };
}

export class SystemNotificationListener {
    startListening() : Promise<void> {
        return NotificationListener.startListening();
    }
    addListener(
        eventName: "notificationRemovedEvent" | "notificationReceivedEvent",
        listenerFunc: (info: SystemNotification) => void,
    ): PluginListenerHandle {
        let np: PluginListenerHandle;

        const newfunc = (info: PlainSystemNotification) => { 
            const inf = convert2SystemNotification(info); 
            listenerFunc(inf);
        }

        if (eventName == "notificationReceivedEvent") {
            np = NotificationListener.addListener("notificationReceivedEvent", newfunc);
        } else {
            np = NotificationListener.addListener("notificationRemovedEvent", newfunc);
        }
        return np;
    }
    stopListening() : Promise<void> {
        return NotificationListener.stopListening();
    }
    requestPermission() : Promise<void> {
        return NotificationListener.requestPermission();
    }
    isListening () : Promise<boolean> {
        return new Promise<boolean>((resolve : any, reject : any) => {
            NotificationListener.isListening().then((value : {value : boolean}) => {
                resolve(value.value);
            }).catch((reason : any) => {
                reject(reason);
            });
        })
    }
}
