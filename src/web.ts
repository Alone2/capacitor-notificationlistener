import { WebPlugin } from '@capacitor/core';
import { NotificationListenerPluginPlugin } from './definitions';

export class NotificationListenerPluginWeb extends WebPlugin implements NotificationListenerPluginPlugin {
  constructor() {
    super({
      name: 'NotificationListenerPlugin',
      platforms: ['web'],
    });
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}

const NotificationListenerPlugin = new NotificationListenerPluginWeb();

export { NotificationListenerPlugin };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(NotificationListenerPlugin);
