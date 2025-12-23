import { Module } from '@nestjs/common';
import { Symbols } from 'di/common';
import { HasherImpl } from 'infrastructure/utils/hash';
import { Hasher } from 'domain/_utils/auth/types';
import { SlugService } from 'domain/_utils/slug';
import { SlugServiceImpl } from 'infrastructure/services/slug';
import { config } from 'infrastructure/config/config';
import { TranslateService } from 'domain/_utils/translate';
import { YandexTranslateService } from 'infrastructure/services/translate';
import { LlmProvider } from 'domain/_utils/llm';
import { OpenAiProvider } from 'infrastructure/services/llm/openai-provider';

@Module({
    providers: [
        {
            provide: Symbols.infrastructure.utils.hasher,
            useFactory(): Hasher {
                return new HasherImpl();
            },
        },
        {
            provide: Symbols.infrastructure.utils.slug,
            useFactory(): SlugService {
                return new SlugServiceImpl();
            },
        },
        {
            provide: Symbols.infrastructure.utils.translate,
            useFactory(): TranslateService {
                return new YandexTranslateService(config.yandexTranslate);
            },
        },
        {
            provide: Symbols.infrastructure.utils.llm,
            useFactory(): LlmProvider {
                return new OpenAiProvider(config.openAi);
            },
        },
    ],
    exports: [
        Symbols.infrastructure.utils.hasher,
        Symbols.infrastructure.utils.slug,
        Symbols.infrastructure.utils.translate,
        Symbols.infrastructure.utils.llm,
    ],
})
export class UtilsModule {}
