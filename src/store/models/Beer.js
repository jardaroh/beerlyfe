import { Model } from '@vuex-orm/core';

import uuid from 'uuid/v4';

export default class Beer extends Model {
  static entity = 'beers';

  static fields() {
    return {
      id: this.uid(() => uuid()),
      name: this.string(null),
      percent: this.number(null),
      notes: this.string(null).nullable(),
    };
  }
}
