import { Comment } from '@/models/internal';
import { Create, Insert, InsertOrUpdate, UpdateObject } from '@vuex-orm/core/lib/modules/payloads/Actions';
import { ModelService } from '@/services/ModelService';
import {
  ICreateArguments,
  IFindOneArguments,
  IFindArguments,
  IUpdateArguments,
  IDestroyArguments,
  IApiService,
  IRequestArguments,
} from '@/lib/interfaces';
import { Item, Collection } from '@/lib/types';
import { AxiosResponse } from 'axios';

/**
 * Service class for interacting with the Comment model
 */
export class CommentService extends ModelService<Comment> {

  protected model = Comment;

  protected path = (args: ICommentPathArguments) => `/${args.entity}/${args.entity_id}/comments`;

  /**
   * Cached instance of the service
   */
  private static instance: CommentService | null = null;

  private constructor() {
    super();
  }

  /**
   * Get an instance of the CustomerService
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new CommentService();
      return this.instance;
    }
    return this.instance;
  }

  public async create(payload: Create) {
    return this.model.create(payload);
  }

  public async update(payload: UpdateObject) {
    return this.model.update(payload);
  }

  public async insert(payload: Insert) {
    return this.model.insert(payload);
  }

  public async insertOrUpdate(payload: InsertOrUpdate) {
    return this.model.insertOrUpdate(payload);
  }

  public find(options: string | number | (string | number)[]) {
    return this.model.find(options);
  }

  public findIn(options: (string | number | (string | number)[])[]) {
    return this.model.findIn(options);
  }

  public query() {
    return this.model.query();
  }

  public all(): Collection<Comment> {
    return this.model.all();
  }

  public getActive(): Item<Comment> {
    return (this.model.getActive() as Comment);
  }

  public get api(): ICommentService {
    return {
      /**
       * Create a Customer on the server via POST request
       */
      create: async (args) => {
        const path = this.path(args);
        return this.apiService.post(path, args);
      },

      /**
       * Find one Customer on the server via GET request
       */
      findOne: async (args) => {
        const path = this.path(args);
        return this.apiService.get(`${path}/${args.id}`, args);
      },

      /**
       * Find a list of Customers on the server via GET request
       */
      find: async (args) => {
        const path = this.path(args);
        return this.apiService.get(path, args);
      },

      /**
       * Update an existing Customer on the server via PUT request
       */
      update: async (args) => {
        const path = this.path(args);
        return this.apiService.patch(`${path}/${args.id}`, args);
      },

      /**
       * Delete an existing Customer on the server via DELETE request
       */
      destroy: async (args) => {
        const path = this.path(args);
        return this.apiService.delete(`${path}/${args.id}`, args);
      },
    };
  }
}

/**
 * Args for building a specific URL to make requests to server.
 * Provide an `entity` string which acts as the resource name
 * the comments belong to (ex. "draft_orders"). Also, provide
 * the `entity_id` of the `entity` to target a specific record.
 */
interface ICommentPathArguments extends IRequestArguments {
  /**
   * Parent entity name used in creating endpoints to make
   * requests to
   * @example GET "api/v1/<entity>/<entity_id>/comments"
   */
  entity: string;
  /**
   * Parent entity ID
   */
  entity_id: string | number;
}

/**
 * Extension of API service for commentable ModelServices
 */
interface ICommentService extends IApiService {
  /**
   * Create a record on the server
   */
  create(args: ICreateArguments & ICommentPathArguments): Promise<AxiosResponse<any>>;

  /**
   * Find a single record from the server
   */
  findOne(args: IFindOneArguments & ICommentPathArguments): Promise<AxiosResponse<any>>;

  /**
   * Find a list of records from the server
   */
  find(args: IFindArguments & ICommentPathArguments): Promise<AxiosResponse<any>>;

  /**
   * Update an existing record on the server
   */
  update(args: IUpdateArguments & ICommentPathArguments): Promise<AxiosResponse<any>>;

  /**
   * Destroy an existing record on the server
   */
  destroy(args: IDestroyArguments & ICommentPathArguments): Promise<AxiosResponse<any>>;
}
