import dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config();
const envVars = process.env;

type GeneralConfig = {
    port: number;
    mongo: {
        connectionString: string;
    };
    jwt: JwtConfig;
    yandexTranslate: YandexTranslateConfig;
};

export type JwtConfig = {
    secret: string;
    accessTtl: string;
    refreshTtl: string;
    userCacheTtl: number;
};

export type YandexTranslateConfig = {
    apiUrl: string;
    apiKey: string;
    folderId: string;
};

export const config: GeneralConfig = {
    port: parseInt(envVars.PORT || '3000'),
    mongo: {
        connectionString: envVars.MONGODB_URI || '',
    },
    jwt: {
        secret: envVars.JWT_SECRET || 'qwertyuiopasdfghjklzxcvbnm123456789hgfds',
        accessTtl: envVars.JWT_ACCESS_TTL || '1h',
        refreshTtl: envVars.JWT_REFRESH_TTL || '7d',
        userCacheTtl: +(envVars.USER_CACHE_TTL || 120), // 2 mins in seconds
    },
    yandexTranslate: {
        apiUrl: envVars.YANDEX_API_URL || '',
        apiKey: envVars.YANDEX_API_KEY || '',
        folderId: envVars.YANDEX_FOLDER_ID || '',
    },
};
