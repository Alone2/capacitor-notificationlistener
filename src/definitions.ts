import { Plugins, PluginListenerHandle } from "@capacitor/core";

declare module '@capacitor/core' {
  interface PluginRegistry {
    NotificationListenerPlugin: NotificationListenerPluginPlugin;
  }
}

export interface SystemNotification {
  appname: string;
  text: string;
  textlines: string[];
  title: string;
  time: Date;
  package: string;
}

interface NotificationListenerPluginPlugin extends Plugin {
  addListener(
    eventName: "notificationReceivedEvent", 
    listenerFunc: (info: SystemNotification) => void,
  ): PluginListenerHandle;
  addListener(
    eventName: "notificationRemovedEvent", 
    listenerFunc: (info: SystemNotification) => void,
  ): PluginListenerHandle;
  startListening() : Promise<void>;
  stopListening() : Promise<void>;
  requestPermission(): Promise<void>;
}



const { NotificationListenerPlugin } = Plugins;

class SystemPluginListenerHandler {
    #pluginListenerHandle : PluginListenerHandle;
    #onremove : Function;
    constructor(pl : PluginListenerHandle, func : Function) {
        this.#pluginListenerHandle = pl;
        this.#onremove = func;
    }
    remove() {
        this.#onremove();
        this.#pluginListenerHandle.remove();
    }
}

export class SystemNotificationListener extends Plugin {
  constructor() {
      super()
  }
  addListener(
    eventName: "notificationRemovedEvent" | "notificationReceivedEvent", 
    listenerFunc: (info: SystemNotification) => void,
  ): SystemPluginListenerHandler {
        NotificationListenerPlugin.startListening();
        return new SystemPluginListenerHandler(NotificationListenerPlugin.addListener(eventName, listenerFunc), NotificationListenerPlugin.stopListening);
  }
  requestPermission() {
    NotificationListenerPlugin.requestPermission();
  }
}
