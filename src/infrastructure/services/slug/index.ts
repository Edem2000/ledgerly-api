import type { SlugService } from 'domain/_utils/slug';
import slugify from 'slugify';

export class SlugServiceImpl implements SlugService {
    public createSlug(raw: string, delimiter: string = '_'): string {
        return slugify(raw, delimiter).toLowerCase();
    }
}
