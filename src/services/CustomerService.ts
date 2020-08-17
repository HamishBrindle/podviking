import { Customer } from '@/models/Customer';
import {
  Create,
  Insert,
  InsertOrUpdate,
  UpdateObject,
} from '@vuex-orm/core/lib/modules/payloads/Actions';
import { ModelService } from '@/services/ModelService';
import {
  ICreateArguments,
  IUpdateArguments,
  IApiService,
  IFindArguments,
} from '@/lib/interfaces';
import { Item, Collection } from '@/lib/types';
/**
 * Service class for interacting with the Customer model
 */
export class CustomerService extends ModelService<Customer> {

  protected model = Customer;

  protected path = '/customers';

  /**
   * Cached instance of the service
   */
  private static instance: CustomerService | null = null;

  private constructor() {
    super();
  }

  /**
   * Get an instance of the CustomerService
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new CustomerService();
      return this.instance;
    }
    return this.instance;
  }

  /**
   * Function for mapping data during the `prepareData` phase of record
   * creation/updating
   *
   * If this method isn't defined, it no longer get's used in the pipeline
   *
   * @param data
   */
  public static mapData(data: any) {
    return {
      id: data.Customer.newid,
      address: data.Customer.address,
      city: data.Customer.city,
      contact_email: data.Customer.email,
      contact_phone: data.Customer.phone,
      contact: data.Customer.contact,
      country: data.Customer.country,
      approval_status: data.Customer.custom1,
      site_requester: data.Customer.custom2,
      name: data.Customer.name,
      phone: data.Customer.phone,
      postal_zip: data.Customer.postal_zip,
      prov_state: data.Customer.prov_state,
      dist_channel: data.Customer.dist_channel,
      cost_center: data.Customer.cost_centre,
      bt_address: data.Customer.bt_address,
      bt_city: data.Customer.bt_city,
      bt_contact: data.Customer.bt_contact,
      bt_country: data.Customer.bt_country,
      bt_email: data.Customer.bt_email,
      bt_fax: data.Customer.bt_fax,
      bt_name: data.Customer.bt_name,
      bt_phone: data.Customer.bt_phone,
      bt_postal_zip: data.Customer.bt_postal_zip,
      bt_prov_state: data.Customer.bt_prov_state,
      bt_web: data.Customer.bt_web,
      btsame: data.Customer.btsame,
      on_credit_hold: data.Customer.on_credit_hold,
      general_notes: data.Customer.general_notes,
    };
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

  public all(): Collection<Customer> {
    return this.model.all();
  }

  public getActive(): Item<Customer> {
    return (this.model.getActive() as Customer);
  }

  public get api(): IApiService {
    enum ErrorMessage {
      NoCustomerError = 'Missing \'customer\' param',
      NoSiteRequesterError = 'Customer site_requester missing',
      ApproveNonPendingCustomerError = 'Cannot approve customer that is not in pending status',
      DenyNonPendingCustomerError = 'Cannot deny customer that is not in pending status',
    }

    return {
      /**
       * Find a list of unique distribution channels that Customers belong to
       */
      distributionChannels: async (args: IFindArguments) => {
        const { data } = await this.apiService.get('/customer_channels', args);
        return data;
      },

      /**
       * Create a Customer on the server via POST request
       */
      create: async (args) => {
        if (!args.customer) throw Error(ErrorMessage.NoCustomerError);

        return this.apiService.post(this.path, {
          ...args,
          customer: {
            ...args.customer,
            approval_status: 'approved',
          },
        });
      },

      /**
       * Create a Customer on the server via POST request
       */
      request: async (args: ICreateArguments) => {
        if (!args.customer) throw Error(ErrorMessage.NoCustomerError);
        if (!args.customer.site_requester) throw Error(ErrorMessage.NoSiteRequesterError);

        return this.apiService.post(this.path, {
          ...args,
          customer: {
            ...args.customer,
            site_requester: args.customer.site_requester,
            approval_status: 'pending',
          },
        });
      },

      /**
       * Find one Customer on the server via GET request
       */
      findOne: async (args) => this.apiService.get(`${this.path}/${args.id}`, args),

      /**
       * Find a list of Customers on the server via GET request
       */
      find: async (args) => this.apiService.get(this.path, args),

      /**
       * Update an existing Customer on the server via PATCH request
       */
      update: async (args) => this.apiService.patch(`${this.path}/${args.id}`, args),

      /**
       * Delete an existing Customer on the server via DELETE request
       */
      destroy: async (args) => this.apiService.delete(`${this.path}/${args.id}`, args),

      /**
       * Approve a pending Customer on the server via PATCH
       */
      approve: async (args: IUpdateArguments) => {
        if (!args.customer) throw Error(ErrorMessage.NoCustomerError);
        if (args.customer.approval_status !== 'pending')
          throw Error(ErrorMessage.ApproveNonPendingCustomerError);

        return this.apiService.patch(`${this.path}/${args.id}`, {
          ...args,
          customer: {
            ...args.customer,
            approval_status: 'approved',
          },
        });
      },

      /**
       * Deny a pending Customer on the server via PATCH
       */
      deny: async (args: IUpdateArguments) => {
        if (!args.customer) throw Error(ErrorMessage.NoCustomerError);
        if (args.customer.approval_status !== 'pending')
          throw Error(ErrorMessage.DenyNonPendingCustomerError);

        return this.apiService.patch(`${this.path}/${args.id}`, {
          ...args,
          customer: {
            ...args.customer,
            approval_status: 'denied',
          },
        });
      },
    };
  }
}
