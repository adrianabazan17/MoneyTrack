import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: Storage | null = null;

  constructor(private ionicStorage: Storage) {
    this.init();
  }

  async init() {
    this.storage = await this.ionicStorage.create();
  }

  async set(key: string, value: any) {
    return this.storage?.set(key, value);
  }

  async get(key: string) {
    return this.storage?.get(key);
  }

  async remove(key: string) {
    return this.storage?.remove(key);
  }

  async clear() {
    return this.storage?.clear();
  }
}