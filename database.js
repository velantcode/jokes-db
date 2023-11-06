import mongoose from 'mongoose';
import {DBParams} from './environment.js';

const { error, log } = console;

export default async function Database() {
  try {
    const { DDB_HOST, DDB_NAME, DDB_PASSWORD, DDB_USER } = DBParams;

    if (DDB_HOST || DDB_NAME) {
      const mongoOptions = {
        dbName: DDB_NAME,
        auth: {
          username: DDB_USER || undefined,
          password: DDB_PASSWORD || undefined,
        },
      };
      await mongoose.connect(DDB_HOST, mongoOptions);
      log('DB Connected.');
    } else {
      error('Require database params!');
    }
  } catch (e) {
    error('Database:', e);
  }
}
