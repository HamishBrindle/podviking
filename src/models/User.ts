import { AttrField, OrmModel, PrimaryKey, HasOneField } from 'vuex-orm-decorators';
import { BaseModel, Auth } from '@/models/internal';

@OrmModel('users')
export class User extends BaseModel {
  /**
   * Model name (used for CASL subject detection)
   */
  static get modelName() {
    return 'User';
  }

  /**
   * Unique identifier for this User on the API.
   */
  @PrimaryKey()
  @AttrField(undefined)
  public id!: number | string;

  /**
   * Unique email string for the User.
   */
  @AttrField()
  public email!: string;

  /**
   * User's name.
   */
  @AttrField()
  public name!: string;

  /**
   * Date this User was created on the server.
   */
  @AttrField()
  public created_at!: string;

  /**
   * Date this User was updated on the server.
   */
  @AttrField()
  public updated_at!: string;

  /**
   * User's avatar
   */
  @AttrField()
  public avatar?: string;

  /**
   * List of roles this User has.
   */
  @AttrField([])
  public roles!: Array<string>;

  /**
   * List of distribution channels the User is associated with
   */
  @AttrField([])
  public dist_channels!: Array<string>;

  /**
   * Auth association
   */
  @HasOneField(Auth, 'user_id', 'id')
  public auth?: Auth;

  /**
   * Gets associated Auth object, if not already attached
   * to this instance, and returns it's `authentication_token`
   * field.
   */
  public get authentication_token() {
    if (this.auth?.authentication_token) {
      return this.auth.authentication_token;
    }
    const user = User
      .query()
      .with('auth')
      .whereId(this.id)
      .first();
    this.auth = user?.auth;
    return user?.auth?.authentication_token ?? '';
  }

  /**
   * Gets associated Auth object, if not already attached
   * to this instance, and returns it's `permissions` data.
   */
  public get permissions() {
    if (this.auth?.permissions) {
      return this.auth.permissions;
    }
    const user = User
      .query()
      .with('auth')
      .whereId(this.id)
      .first();
    this.auth = user?.auth;
    return user?.auth?.permissions ?? '';
  }
}

export default User;
