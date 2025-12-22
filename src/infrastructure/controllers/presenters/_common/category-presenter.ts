import { Category } from 'domain/category/category';
import { HexString, Language } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';

export class CategoryPresenter {
    public static present(category: Category, currentUser?: CurrentUser): CategoryResponseDto {
        return {
            id: category.id.toString(),
            title: category.title[currentUser?.language || Language.Russian],
            multilanguageTitle: category.title,
            alias: category.alias,
            color: category.color,
            icon: category.icon || null,
        };
    }
}

export type CategoryResponseDto = {
    id: HexString;
    title: string;
    multilanguageTitle: {
        ru: string;
        uz: string;
        en: string;
    };
    alias: string;
    color: string;
    icon: string | null;
};
