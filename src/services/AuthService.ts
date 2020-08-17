import { Create, UpdateObject, Insert, InsertOrUpdate } from '@vuex-orm/core/lib/modules/payloads/Actions';
import { Collection, Query, Collections } from '@vuex-orm/core';
import { IAuthService } from '@/lib/interfaces';
import { Item } from '@/lib/types';
import { ModelService } from '@/services';
import { Auth } from '@/models/internal';
import { User } from '@/models/internal';
import util from '@/tools/Utilities';
import { AppAbility } from '@/lib/types';
import { defineAbility } from '@/models/internal';

export class AuthService extends ModelService<Auth> {
  /**
   * App abilities
   */
  private ability: AppAbility = new AppAbility();

  protected model = Auth;

  protected path = '/order_form_users';

  /**
   * Cached instance of the service
   */
  private static instance: AuthService | null = null;

  /**
   * Constructor
   */
  private constructor() {
    super();
  }

  /**
   * Get an instance of the UserService
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new AuthService();
      return this.instance;
    }
    return this.instance;
  }

  /**
   * Update the abilities available to a User that can be checked
   * throughout the application.
   * @param user
   */
  public defineAbility(auth: Auth): AppAbility {
    if (!this.ability) {
      this.ability = defineAbility(auth);
      return this.ability;
    }
    const { rules } = defineAbility(auth);
    this.ability.update(rules);
    return this.ability;
  }

  public create(payload: Create): Promise<Collections> {
    return this.model.create(payload);
  }

  public update(payload: UpdateObject): Promise<Collections> {
    return this.model.update(payload);
  }

  public insert(payload: Insert): Promise<Collections> {
    return this.model.insert(payload);
  }

  public insertOrUpdate(payload: InsertOrUpdate): Promise<Collections> {
    return this.model.insertOrUpdate(payload);
  }

  public find(options: string | number | (string | number)[]): Item<Auth> {
    return this.model.find(options);
  }

  public findIn(options: (string | number | (string | number)[])[]): Collection<Auth> {
    return this.model.findIn(options);
  }

  public query(): Query<Auth> {
    return this.model.query();
  }

  public all(): Collection<Auth> {
    return this.model.all();
  }

  /**
   * Get the active Auth
   */
  public getActive(): Item<Auth> {
    return this.model.getActive();
  }

  /**
   * Set the active Auth
   */
  public setActive(record: Auth | string | number | null): Item<Auth> {
    return this.model.setActive(record);
  }

  /**
   * Get app abilities object
   */
  public getAbility(): AppAbility {
    return this.ability;
  }

  /**
   * Set app abilities object
   * @param value
   */
  public setAbility(value: AppAbility) {
    this.ability = value;
  }

  /**
   * Login as a User to the API and recieve user/auth data
   */
  public async login(email: string /*password: string*/): Promise<Item<User>> {
    await User.create({
      data: {
        id: '123',
        email: email,
        name: 'Young & Shameless',
        created_at: new Date().toUTCString(),
        updated_at: new Date().toUTCString(),
        avatar: 'https://i1.sndcdn.com/avatars-000249162379-ohg77t-t500x500.jpg',
        roles: ['ADMIN'],
        auth: {
          user_id: '123',
          authentication_token: 'abc123',
        },
      },
    });

    const user = User.query().whereId('123').with('auth').first();

    console.log('user :>> ', user);

    return this.setActiveUser(user);
  }

  /**
   * Logout of the application and remove User and Auth
   * data
   */
  public async logout(): Promise<void> {
    await User.deleteAll();
    await Auth.deleteAll();
    this.setActive(null);
  }

  /**
   * Register a new User to the API
   */
  public async register(
    email: string,
    name: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<boolean> {
    const config = await util.fetchConfig();
    const { access_token } = config.order_form_endpoint;
    const credentials = {
      access_token,
      order_form_user: {
        email: email,
        name: name,
        password: password,
        password_confirmation: passwordConfirmation,
      },
    };
    await this.api.register(credentials);
    return true;
  }

  /**
   * Confirms user registration then login on success
   * @param confirmationToken confirmation token
   */
  public async confirmRegistrationThenlogin(confirmationToken: string): Promise<Item<User>> {
    const userData = await this.api.confirmation({
      confirmation_token: confirmationToken,
    });
    return this.setActiveUser(userData);
  }

  /**
   * Sends a password reset email containing a link to reset the User's password
   */
  public async sendPasswordResetEmail(email: string): Promise<boolean> {
    const config = await util.fetchConfig();
    const { access_token } = config.order_form_endpoint;
    await this.api.sendPasswordResetEmail({
      access_token,
      email,
    });
    return true;
  }

  /**
   * Resets the User's password using a password reset token
   * (via link from password reset email)
   * @param resetPasswordToken reset password token
   */
  public async resetPassword(
    resetPasswordToken: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<boolean> {
    const credentials = {
      reset_password_token: resetPasswordToken,
      password,
      password_confirmation: passwordConfirmation,
    };
    await this.api.resetPassword(credentials);
    return true;
  }

  public get api(): IAuthService {
    return {
      /**
       * Sign in with an existing user's credentials
       */
      login: async (args) => {
        const { data: { order_form_user}} =  await this.apiService.post(`${this.path}/sign_in`, args);
        return this.getAuthorizedUserData(order_form_user);
      },

      /**
       * Register a new User with the API and recieve a token for
       * confirming an email
       */
      register: async (args) => this.apiService.post(this.path, args),

      /**
       * Sends confirmation token back to the server in exchange for
       * a User data object and authentication token
       */
      confirmation: async (args) => {
        const { data: { order_form_user}} = await this.apiService.get(`${this.path}/confirmation`, args);
        return this.getAuthorizedUserData(order_form_user);
      },

      /**
       * Sends a password reset email containing a link to reset the User's password
       */
      sendPasswordResetEmail: async (args) => this.apiService.post(`${this.path}/password`, args),

      /**
       * Resets the User's password using a password reset token
       * (via link from password reset email)
       */
      resetPassword: async (args) => this.apiService.patch(`${this.path}/password`, args),
    };
  }

  /**
   * Returns User with valid Auth
   * @param user user data
   */
  private getAuthorizedUserData(user: any): User {
    // Create Auth data object from response
    const auth = {
      authentication_token: user.authentication_token,
      user_id: user.id,
      permissions: user.permissions ?? {},
    };

    // We don't need these fields on the User anymore
    delete user.authentication_token;
    delete user.permissions;

    // Nest the Auth object inside the User and let the ORM take
    // care of creating the association(s)
    user.auth = auth;
    return user;
  }

  /**
   * Creates User and sets active User/Auth
   * @param userData authorized user data
   */
  private async setActiveUser(userData: any): Promise<User> {
    const user = new User(userData);

    if (!user?.auth?.authentication_token) {
      throw Error('Uh-oh! An unexpected problem occured, please try again later');
    }

    await User.insert({ data: user });

    User.active = user.id;
    Auth.active = user.auth.authentication_token;

    this.defineAbility(user.auth);

    return user;
  }
}

