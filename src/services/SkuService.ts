import { ModelService } from './ModelService';
import { Sku } from '@/models/internal';
import {
  Create,
  UpdateObject,
  Insert,
  InsertOrUpdate,
} from '@vuex-orm/core/lib/modules/payloads/Actions';
import { Query } from '@vuex-orm/core';
import {
  Collection,
  Collections,
  Item,
} from '@/lib/types';
import {
  IApiService,
} from '@/lib/interfaces';

/**
 * Service class for interacting with the Sku model
 */
export class SkuService extends ModelService<Sku> {
  protected model = Sku;

  protected path = '/skus';

  /**
   * Cached instance of the service
   */
  private static instance: SkuService | null = null;

  /**
   * Constructor
   */
  private constructor() {
    super();
  }

  /**
   * Get an instance of the CustomerService
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new SkuService();
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

  public find(options: string | number | (string | number)[]): Item<Sku> {
    return this.model.find(options);
  }

  public findIn(options: (string | number | (string | number)[])[]): Collection<Sku> {
    return this.model.findIn(options);
  }

  public all(): Collection<Sku> {
    return this.model.all();
  }

  public query(): Query<Sku> {
    return this.model.query();
  }

  public get api(): IApiService {
    return {
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
       * Find a list of Customers on the server via GET request
       */
      find: async () => {
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
