declare module '@capacitor/core' {
  interface PluginRegistry {
    NotificationListenerPlugin: NotificationListenerPluginPlugin;
  }
}

export interface NotificationListenerPluginPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
