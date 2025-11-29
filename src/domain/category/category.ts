import { BaseEntity, BaseModel, Identifier, MultiLanguage } from 'domain/_core';
import { CategoryStatus } from 'domain/category/category-state';

export interface CategoryModel extends BaseModel {
  title: MultiLanguage;
  alias: string;
  color: string;
  icon?: string;
  userId: Identifier;
  status: CategoryStatus;
  deleted: boolean;
  deletedAt?: Date;
}

export class Category extends BaseEntity<CategoryModel> {
  public get title(): MultiLanguage {
    return this.model.title;
  }

  public set title(value: MultiLanguage) {
    this.model.title = value;
  }

  public get alias(): string {
    return this.model.alias;
  }

  public set alias(value: string) {
    this.model.alias = value;
  }

  public get color(): string {
    return this.model.color;
  }

  public set color(value: string) {
    this.model.color = value;
  }

  public get icon(): string | undefined {
    return this.model.icon;
  }

  public set icon(value: string | undefined) {
    this.model.icon = value;
  }

  public get userId(): Identifier {
    return this.model.userId;
  }

  public set userId(value: Identifier) {
    this.model.userId = value;
  }

  public get status(): CategoryStatus {
    return this.model.status;
  }

  public set status(value: CategoryStatus) {
    this.model.status = value;
  }

  public get deleted(): boolean {
    return this.model.deleted;
  }

  public set deleted(value: boolean) {
    this.model.deleted = value;
  }

  public get deletedAt(): Date | undefined {
    return this.model.deletedAt;
  }

  public set deletedAt(value: Date | undefined) {
    this.model.deletedAt = value;
  }
}
