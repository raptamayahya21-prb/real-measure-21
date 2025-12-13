export interface MeasurementData {
    item_name?: string; // Optional name
    measured_value: number;
    unit: string;
    real_value?: number;
    error_percentage?: number;
    scale_factor?: number;
    points_3d?: {
        start?: any;
        end?: any;
    };
    timestamp?: string;
}

const DB_NAME = 'RealMeasureDB';
const DB_VERSION = 1;
const STORE_NAME = 'RiwayatPengukuran';

let db: IDBDatabase | null = null;

export const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event: any) => reject('IndexedDB error: ' + event.target.errorCode);

        request.onupgradeneeded = (event: any) => {
            const database = event.target.result;
            // Create object store if not exists
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event: any) => {
            db = event.target.result;
            resolve(db!);
        };
    });
};

export const saveMeasurement = async (data: MeasurementData): Promise<any> => {
    try {
        const database = await openDatabase();

        return new Promise((resolve, reject) => {
            const transaction = database.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            // Add timestamp if missing
            const record = {
                ...data,
                timestamp: data.timestamp || new Date().toISOString()
            };

            const request = store.add(record);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject('Gagal menyimpan data ke IndexedDB.');
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllMeasurements = async (): Promise<any[]> => {
    try {
        const database = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = database.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject('Gagal mengambil data.');
        });
    } catch (error) {
        return Promise.reject(error);
    }
};
