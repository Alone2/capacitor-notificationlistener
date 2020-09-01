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
}

// ----- 

const { NotificationListenerPlugin } = Plugins;

class SystemPluginListenerHandler {
  private pluginListenerHandle: PluginListenerHandle;
  private onremove: Function;
  constructor(pl: PluginListenerHandle, func: Function) {
    this.pluginListenerHandle = pl;
    this.onremove = func;
  }
  remove() {
    this.onremove();
    this.pluginListenerHandle.remove();
  }
}

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
  addListener(
    eventName: "notificationRemovedEvent" | "notificationReceivedEvent",
    listenerFunc: (info: SystemNotification) => void,
  ): SystemPluginListenerHandler {

    NotificationListenerPlugin.startListening();
    let np: PluginListenerHandle;

    const newfunc = (info: PlainSystemNotification) => { 
      let inf = convert2SystemNotification(info); 
      listenerFunc(inf) 
    }

    if (eventName == "notificationReceivedEvent") {
      np = NotificationListenerPlugin.addListener("notificationReceivedEvent", newfunc);
    } else {
      np = NotificationListenerPlugin.addListener("notificationRemovedEvent", newfunc);
    }

    return new SystemPluginListenerHandler(np, NotificationListenerPlugin.stopListening);
  }
  requestPermission() {
    NotificationListenerPlugin.requestPermission();
  }
}
