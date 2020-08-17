import { ModelService, AuthService } from '.';
import { Create, UpdateObject, Insert, InsertOrUpdate } from '@vuex-orm/core/lib/modules/payloads/Actions';
import { Collection, Query, Collections } from '@vuex-orm/core';
import { Item } from '@/lib/types';
import { User } from '@/models/internal';
import { IApiService } from '@/lib/interfaces';

export class UserService extends ModelService<User> {

  protected model = User;

  protected path = '/order_form_users';

  /**
   * Cached instance of the service
   */
  private static instance: UserService | null = null;

  /**
   * Constructor
   */
  private constructor() {
    super();
  }

  private readonly authService: AuthService = AuthService.getInstance();

  /**
   * Get an instance of the UserService
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new UserService();
      return this.instance;
    }
    return this.instance;
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

  public find(options: string | number | (string | number)[]): Item<User> {
    return this.model.find(options);
  }

  public findIn(options: (string | number | (string | number)[])[]): Collection<User> {
    return this.model.findIn(options);
  }

  public query(): Query<User> {
    return this.model.query();
  }

  public all(): Collection<User> {
    return this.model.all();
  }

  /**
   * Get the active User
   */
  public getActive(): Item<User> {
    return this.model
      .query()
      .with('auth')
      .whereId(User.active)
      .first();
  }

  /**
   * Get the active User
   */
  public getActiveToken(): string {
    const activeUser = this.getActive();
    if (!activeUser) {
      throw Error('Unable to get an authentication token. No current User found');
    }
    return activeUser?.authentication_token;
  }

  /**
   * Set the active User
   */
  public setActive(record: User | string | number | null): Item<User> {
    return this.model.setActive(record);
  }

  /**
   * Get this User's associated Auth record or return null if not found
   * @param user
   */
  public getAuth(user: User) {
    return this.authService
      .query()
      .where('user_id', user.id)
      .first();
  }

  public get api(): IApiService {
    return {
      /**
       * Find a list of Users on the server via GET request
       */
      find: async (args) => this.apiService.get(this.path, args),

      /**
       * Create a Customer on the server via POST request
       */
      create: async () => {
        throw Error('This method has no implementation yet');
      },

      /**
       * Find one Customer on the server via GET request
       */
      findOne: async () => {
        throw Error('This method has no implementation yet');
      },

      /**
       * Update an existing Customer on the server via PUT request
       */
      update: async () => {
        throw Error('This method has no implementation yet');
      },

      /**
       * Delete an existing Customer on the server via DELETE request
       */
      destroy: async () => {
        throw Error('This method has no implementation yet');
      },
    };
  }
}
