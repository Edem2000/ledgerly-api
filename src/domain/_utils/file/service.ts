import { diskStorage, StorageEngine } from 'multer';
import { extname, join } from 'path';
import * as fs from 'node:fs';

export function customStorage(): StorageEngine {
    return diskStorage({
        destination: `./storage`,
        filename: (req, file, cb) => {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, unique + extname(file.originalname));
        },
    });
}

export async function deleteFile(fileUri: string) {
    const filePath = join(process.cwd(), fileUri);
    if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
    }
}
