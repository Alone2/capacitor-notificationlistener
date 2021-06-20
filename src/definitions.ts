import type { PluginListenerHandle } from "@capacitor/core";

// export interface NotificationListenerPlugin {
//   echo(options: { value: string }): Promise<{ value: string }>;
// }

export interface PlainSystemNotification {
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

export interface NotificationListenerPlugin {
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


