import { Plugins, PluginListenerHandle } from "@capacitor/core";

declare module '@capacitor/core' {
  interface PluginRegistry {
    NotificationListenerPlugin: NotificationListenerPluginPlugin;
  }
}

interface PlainSystemNotification {
  apptitle: string;
  text: string;
  textlines: string;
  title: string;
  time: number;
  package: string;
}

export interface SystemNotification {
  apptitle: string;
  text: string;
  textlines: string[];
  title: string;
  time: Date;
  package: string;
}

interface NotificationListenerPluginPlugin extends Plugin {
  addListener(
    eventName: "notificationRemovedEvent",
    listenerFunc: (info: PlainSystemNotification) => void,
  ): PluginListenerHandle;
  addListener(
    eventName: "notificationReceivedEvent",
    listenerFunc: (info: PlainSystemNotification) => void,
  ): PluginListenerHandle;
  startListening(): Promise<void>;
  stopListening(): Promise<void>;
  requestPermission(): Promise<void>;
  isListening(): Promise< { value: boolean } >;
}

// ----- 

const { NotificationListenerPlugin } = Plugins;

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
    return NotificationListenerPlugin.startListening();
  }
  addListener(
    eventName: "notificationRemovedEvent" | "notificationReceivedEvent",
    listenerFunc: (info: SystemNotification) => void,
  ): PluginListenerHandle {
    let np: PluginListenerHandle;

    const newfunc = (info: PlainSystemNotification) => { 
      let inf = convert2SystemNotification(info); 
      listenerFunc(inf);
    }

    if (eventName == "notificationReceivedEvent") {
      np = NotificationListenerPlugin.addListener("notificationReceivedEvent", newfunc);
    } else {
      np = NotificationListenerPlugin.addListener("notificationRemovedEvent", newfunc);
    }
    return np;
  }
  stopListening() : Promise<void> {
    return NotificationListenerPlugin.stopListening();
  }
  requestPermission() : Promise<void> {
    return NotificationListenerPlugin.requestPermission();
  }
  isListening (
  ) : Promise<boolean> {
    return new Promise<boolean>((resolve : any, reject : any) => {
      NotificationListenerPlugin.isListening().then((value : {value : boolean}) => {
        resolve(value.value);
      }).catch((reason : any) => {
        reject(reason);
      });
    })
  }
}