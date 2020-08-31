import { PluginListenerHandle } from "@capacitor/core";

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

export interface NotificationListenerPluginPlugin {
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
