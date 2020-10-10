import { AppAbility, Item } from '@/lib/types';
import { ability, Auth, User } from '@/models/internal';
import { ModelService } from '@/services';
import { Collection, Collections, Query } from '@vuex-orm/core';
import { Create, Insert, InsertOrUpdate, UpdateObject } from '@vuex-orm/core/lib/modules/payloads/Actions';

export class AuthService extends ModelService<Auth> {
  /**
   * App abilities
   */
  private ability: AppAbility = new AppAbility();

  protected model = Auth;

  protected path = '/auth';

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
      this.ability = ability(auth);
      return this.ability;
    }
    const { rules } = ability(auth);
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

  public get api() {
    return {
      /**
       * Sign in with an existing user's credentials
       */
      login: async (args: any) => {
        const { data: { order_form_user}} =  await this.apiService.post(`${this.path}/sign_in`, args);
        return this.getAuthorizedUserData(order_form_user);
      },
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

