import { BaseEntity, BaseModel, EntityId, Identifier, Language, MultiLanguage } from 'domain/_core';
import { UserStatus } from 'domain/user/user-state';
import { RoleAlias } from 'domain/role/role';

export type UserWithRole = { user: User, role: { id: Identifier, name: MultiLanguage, alias: RoleAlias } };

export type UserNameObject = {
  first: string;
  last: string;
};

export interface UserModel extends BaseModel {
  name: UserNameObject,
  email: string,
  phone: string,
  password: string,
  role: Identifier,
  status: UserStatus,
  language: Language,
  companyIds: Identifier[],
  deleted: boolean,
  deletedAt?: Date,
  lastLoggedInAt?: Date,
  refreshToken?: string,
}

export class User extends BaseEntity<UserModel> {
  public get name(): UserNameObject {
    return this.model.name;
  }

  public set name(value: UserNameObject){
    this.model.name = value;
  }

  public get firstName(): string {
    return this.model.name.first;
  }

  public set firstName(value: string){
    this.model.name.first = value;
  }

  public get lastName(): string {
    return this.model.name.last;
  }

  public set lastName(value: string){
    this.model.name.last = value;
  }

  public get email(): string {
    return this.model.email;
  }

  public set email(value: string){
    this.model.email = value;
  }

  public get phone(): string {
    return this.model.phone;
  }

  public set phone(value: string){
    this.model.phone = value;
  }

  public get password(): string {
    return this.model.password;
  }

  public set password(value: string){
    this.model.password = value;
  }

  public get role(): Identifier {
    return this.model.role;
  }

  public set role(value: Identifier){
    this.model.role = value;
  }

  public get status(): UserStatus {
    return this.model.status;
  }

  public set status(value: UserStatus){
    this.model.status = value;
  }

  public get language(): Language {
    return this.model.language;
  }

  public set language(value: Language){
    this.model.language = value;
  }
  public get companyIds(): Identifier[] {
    return this.model.companyIds || [];
  }
  public set companyIds(value: Identifier[]) {
    this.model.companyIds = value || [];
  }

  public get deleted(): boolean {
    return this.model.deleted;
  }

  public set deleted(value: boolean){
    this.model.deleted = value;
  }

  public get deletedAt(): Date | undefined {
    return this.model.deletedAt;
  }

  public set deletedAt(value: Date | undefined){
    this.model.deletedAt = value;
  }

  public get lastLoggedInAt(): Date | undefined {
    return this.model.lastLoggedInAt;
  }

  public set lastLoggedInAt(value: Date | undefined){
    this.model.lastLoggedInAt = value;
  }

  public get refreshToken(): string | undefined {
    return this.model.refreshToken;
  }

  public set refreshToken(value: string){
    this.model.refreshToken = value;
  }
}
