export interface NotificationListenerPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
