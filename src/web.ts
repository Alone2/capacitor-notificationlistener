import { WebPlugin } from '@capacitor/core';

import type { NotificationListenerPlugin } from './definitions';

export class NotificationListenerWeb
  extends WebPlugin
  implements NotificationListenerPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
