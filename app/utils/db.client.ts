// utils/db.client.ts
import { createRxDatabase, addRxPlugin, type RxDatabase, type RxCollection } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';

// Add plugins
addRxPlugin(RxDBJsonDumpPlugin);

export type KintaiPresetDocType = {
  id: string; // Unique identifier (e.g., UUID or snake_case name)
  name: string; // Display label (e.g. "Normal Work")
  workTypeCode: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  isTelework: boolean;
};

const presetSchema = {
  title: 'kintaipreset schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
    workTypeCode: { type: 'string' },
    startHour: { type: 'string' },
    startMinute: { type: 'string' },
    endHour: { type: 'string' },
    endMinute: { type: 'string' },
    isTelework: { type: 'boolean' }
  },
  required: ['id', 'name', 'workTypeCode', 'isTelework']
};

export type KintaiDatabaseCollections = {
  presets: RxCollection<KintaiPresetDocType>;
};

export type KintaiDatabase = RxDatabase<KintaiDatabaseCollections>;

let dbPromise: Promise<KintaiDatabase> | null = null;

export const getDb = async (): Promise<KintaiDatabase> => {
  if (dbPromise) return dbPromise;
  
  dbPromise = (async () => {
    // Create the database
    const db = await createRxDatabase<KintaiDatabaseCollections>({
      name: 'kintaidb',
      storage: getRxStorageDexie(),
      multiInstance: true,
      eventReduce: true
    });

    // Create the collections
    await db.addCollections({
      presets: {
        schema: presetSchema
      }
    });

    // Seed default presets if the database is empty
    const presetsCount = await db.presets.count().exec();
    if (presetsCount === 0) {
      const defaultPresets: KintaiPresetDocType[] = [
        {
          id: 'normal',
          name: '通常勤務 (Normal Work)',
          workTypeCode: '10',
          startHour: '09',
          startMinute: '45',
          endHour: '18',
          endMinute: '45',
          isTelework: false,
        },
        {
          id: 'telework',
          name: '在宅勤務 (Telework)',
          workTypeCode: '10',
          startHour: '09',
          startMinute: '45',
          endHour: '18',
          endMinute: '45',
          isTelework: true,
        },
        {
          id: 'paid_leave',
          name: '一日有給休暇 (Full Paid Leave)',
          workTypeCode: '20',
          startHour: '',
          startMinute: '',
          endHour: '',
          endMinute: '',
          isTelework: false,
        },
        {
          id: 'morning_leave',
          name: '午前半休 (Morning Leave)',
          workTypeCode: '21',
          startHour: '14',
          startMinute: '00',
          endHour: '18',
          endMinute: '45',
          isTelework: false,
        },
        {
          id: 'afternoon_leave',
          name: '午後半休 (Afternoon Leave)',
          workTypeCode: '21',
          startHour: '09',
          startMinute: '45',
          endHour: '14',
          endMinute: '00',
          isTelework: false,
        }
      ];
      
      await db.presets.bulkInsert(defaultPresets);
    }

    return db;
  })();
  
  return dbPromise;
};
