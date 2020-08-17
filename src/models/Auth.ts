import { BaseModel, User } from '@/models/internal';
import { AttrField, OrmModel, PrimaryKey } from 'vuex-orm-decorators';

@OrmModel('auths')
export class Auth extends BaseModel {
  /**
   * Model name (used for CASL subject detection)
   */
  static get modelName() {
    return 'Auth';
  }

  /**
   * Token required for this User to communicate with
   * the server. Must be sent in with practically every
   * request to the backend.
   */
  @PrimaryKey()
  @AttrField(undefined)
  public authentication_token!: string;

  /**
   * User's ID.
   */
  @AttrField(undefined)
  public user_id!: string;

  /**
   * Permissions attached to this User and their roles.
   */
  @AttrField({})
  public permissions!: any;

  //TODO: Resolve circular dependency issue and add belongsToField association to User

  /**
   * Gets associated User object, and returns it's `roles` data.
   */
  public get user() {
    return User
      .query()
      .whereId(this.user_id)
      .first();
  }

  /**
   * Gets associated User's roles
   */
  public get roles() {
    return this.user?.roles ?? [];
  }
}

export default Auth;
