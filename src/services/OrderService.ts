import { ModelService } from './ModelService';
import { Order } from '@/models/internal';
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
 * Service class for interacting with the Order model
 */
export class OrderService extends ModelService<Order> {
  protected model = Order;

  protected path = '/draft_orders';

  /**
   * Cached instance of the service
   */
  private static instance: OrderService | null = null;

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
      this.instance = new OrderService();
      return this.instance;
    }
    return this.instance;
  }

  /**
   * Process/parse data from the server before inserting into Model.
   * @param data Order data from server
   */
  public static mapData(data: any) {
    const lastFormState = data.previous_form_states[data.previous_form_states.length - 1];
    return {
      id: data.id,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      submitters_email: data.submitters_email,
      order_form_endpoint_id: data.order_form_endpoint_id,
      previous_form_states: data.previous_form_states,
      approvals: lastFormState.form_data.approvals,
      ship_address: lastFormState.form_data.ship_address,
      bill_address: lastFormState.form_data.bill_address,
      order_detail: lastFormState.form_data.order_detail,
      order_items: lastFormState.form_data.order_items,
      comments: data.comments ?? [],
      section_counts: data.section_counts,
    };
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

  public find(options: string | number | (string | number)[]): Item<Order> {
    return this.model.find(options);
  }

  public findIn(options: (string | number | (string | number)[])[]): Collection<Order> {
    return this.model.findIn(options);
  }

  public all(): Collection<Order> {
    return this.model.all();
  }

  public query(): Query<Order> {
    return this.model.query();
  }

  public getActive(): Item<Order> {
    return this.model.getActive();
  }

  public get api(): IApiService {
    return {
      /**
       * Create a Order on the server via POST request
       */
      create: async (args) => {
        return this.apiService.post(this.path, args);
      },

      /**
       * Find one Order on the server via GET request
       */
      findOne: async (args) => {
        const { data } = await this.apiService.get(`${this.path}/${args.id}`, args);
        return data.draft_order;
      },

      /**
       * Find a list of Customers on the server via GET request
       */
      find: async (args) => {
        const { data } = await this.apiService.get(this.path, args);
        return data.draft_orders;
      },

      /**
       * Update an existing Order on the server via PUT request
       */
      update: async (args) => {
        return this.apiService.patch(`${this.path}/${args.id}`, args);
      },

      /**
       * Delete an existing Order on the server via DELETE request
       */
      destroy: async (args) => {
        return this.apiService.delete(`${this.path}/${args.id}`, args);
      },
    };
  }
}
