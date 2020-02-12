import { Model } from '@vuex-orm/core';
import { Platform } from 'quasar';

import uuid from 'uuid/v4';

export default class Beer extends Model {
  static entity = 'beers';

  static STORAGE_KEY = 'Beer';

  static afterCreate = (model) => Beer.saveToStorage(model);

  static afterDelete = (model) => Beer.saveToStorage(model);

  static afterUpdate = (model) => Beer.saveToStorage(model);

  static saveToStorage(model) {
    const beers = Beer.getStoredBeers();
    beers.push(model);
    window.localStorage.setItem(Beer.STORAGE_KEY, JSON.stringify(beers));
  }

  static getStoredBeers() {
    if (Platform.is.electron) {
      return [];
    }
    if (!window) {
      return [];
    }
    const beersFromStorage = window.localStorage.getItem(Beer.STORAGE_KEY);
    if (!beersFromStorage) {
      return [];
    }
    return JSON.parse(beersFromStorage);
  }

  static fields() {
    return {
      id: this.uid(() => uuid()),
      name: this.string(null),
      percent: this.number(null),
      notes: this.string(null).nullable(),
      volume: this.number(0.5),
      units: this.number(1),
    };
  }
}
