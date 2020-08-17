<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      sm="10"
      md="6"
    >
      <v-card class="elevation-12">
        <v-toolbar
          color="primary"
          dark
          flat
        >
          <span class="headline">
            Setup
          </span>
          <v-spacer />
          <v-toolbar-title>
            PodViking COVID-19 Order Form
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="form.valid">
            <h4 class="title">
              Site Selection
            </h4>
            <p class="subtitle">
              Choose a site from the provided list that you would like to request
              an order for. We can help you prepare your order form using the site's
              details.
            </p>
            <v-switch
              v-model="form.isContracted"
              :disabled="isContractedToggleDisabled"
              label="Contract Service Provider?"
              @change="onContractedChange"
            />
            <v-autocomplete
              v-model="form.customer"
              :loading="loading.customers"
              :disabled="loading.customers"
              :items="customers"
              :rules="[form.rules.required]"
              :hint="selectCustomerHint"
              persistent-hint
              clearable
              label="Site"
              name="site"
              prepend-icon="mdi-map-marker"
            >
              <template
                v-if="!activeUser.roles.includes('contract_advisor')"
                v-slot:no-data
              >
                <template v-if="form.isContracted">
                  <v-list-item>
                    <v-list-item-title>
                      <div class="d-flex flex-column">
                        <span>Cannot find the site you were looking for? </span>
                        <strong>Contact an advisor to place your order:</strong>
                      </div>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-for="user in usersData.filter(user => user.roles.includes('contract_advisor'))"
                    :key="user.email"
                  >
                    <v-list-item-icon>
                      <v-icon color="primary">
                        mdi-account
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <div class="d-flex justify-space-between">
                        <span>{{ user.name }}</span>
                        <a
                          :href="`mailto:${user.email}`"
                        >{{ user.email }}</a>
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <v-list-item v-else>
                  <v-list-item-title>
                    <div class="d-flex flex-column">
                      <span>
                        Cannot find the site you were looking for?
                      </span>
                      <strong>Email <a :href="`mailto:${nonContractedSiteNotFoundContactEmail}`">{{ nonContractedSiteNotFoundContactEmail }}</a> to register a new site</strong>
                    </div>
                    <!-- <router-link :to="{ name: 'customers-create'}">
                      <strong>Click here to request the site to be added.</strong>
                    </router-link> -->
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-autocomplete>
            <template v-if="canOrderFor()">
              <h4 class="title pt-8">
                User Selection
              </h4>
              <p class="subtitle">
                Place an order for another user. A notification email will be sent to the user once the order is submitted.
              </p>
              <v-switch
                v-model="form.isOrderOnBehalf"
                label="Order for user"
              />
              <template v-if="form.isOrderOnBehalf">
                <v-autocomplete
                  v-model="form.orderOnBehalfUser"
                  :loading="loading.users"
                  :disabled="loading.users"
                  :items="users"
                  :rules="[form.rules.required]"
                  :hint="selectUserHint"
                  persistent-hint
                  clearable
                  label="Users"
                  name="orderOnBehalfUser"
                  prepend-icon="mdi-account"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        Cannot find the user you were looking for?
                        Please ask them to sign up for an account first.
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </template>
            </template>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="loading.customers || loading.users || !form.valid"
            color="primary"
            text
            depressed
            large
            @click="onContinue"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Loading } from '@/lib/types';
import { User, Order, Customer } from '@/models/internal';
import { UserService, CustomerService, OrderService } from '@/services';
import { Logger } from '@/tools';
import prepareData from '@/models/functions/prepareData';
import { ApprovalStatus } from '../../../lib/enum';
import { IFindArguments } from '@/lib/interfaces';

@Component({
  name: 'OrdersSetup',
})
export default class OrdersSetup extends Vue {

  private readonly userService: UserService = UserService.getInstance();

  private readonly customerService: CustomerService = CustomerService.getInstance();

  private readonly orderService: OrderService = OrderService.getInstance();

  private readonly loading: Loading = {
    customers: false,
    users: false,
  }

  private activeUser: User = new User();

  private customersData: Customer[] = [];

  private usersData: User[] = [];

  private readonly form: any = {
    valid: false,
    isContracted: false,
    email: '',
    customer: null,
    isOrderOnBehalf: false,
    orderOnBehalfUser: '',
    rules: {
      required: (value: string) => !!value || 'Required.',
      email: (value: string) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail';
      },
    },
  }

  private readonly nonContractedSiteNotFoundContactEmail = 'vchcovid-19centralsupply@podviking.ca';

  get isContractedToggleDisabled(): boolean {
    return this.activeUser.roles.includes('contract_advisor') || this.activeUser.roles.includes('site_user');
  }

  get customers(): any[] {
    let customers: Customer[] = [];
    if (this.form.isContracted) {
      customers = this.customersData.filter((customer) => customer.dist_channel.match(/^CP\s\w+/g));
    } else {
      customers = this.customersData.filter((customer) => !customer.dist_channel.match(/^CP\s\w+/g));
    }
    return this.formatCustomersData(customers);
  }

  get users(): any[] {
    return this.usersData.map((user: any) => ({
      text: `${user.name} - ${user.email}`,
      value: user.email,
    }));
  }

  get selectCustomerHint(): string | undefined {
    if (this.form.customer?.id) {
      return undefined;
    }
    return 'Select the site for your order';
  }

  get selectUserHint(): string | undefined {
    if (this.form.orderOnBehalfUser) {
      return undefined;
    }
    return 'Select the user to order on behalf';
  }

  created() {
    const user = this.userService.getActive();
    if (!user) throw Error('Unable to find active User');
    this.activeUser = user;
    if (this.isContractedToggleDisabled && user.dist_channels.length > 0) this.form.isContracted = true;
    this.form.email = user.email;
    this.init();
  }

  init() {
    this.fetchCustomers();
    if (this.canOrderFor()) this.fetchUsers();
  }

  /**
   * Fetch Customer data from server and populate ORM
   */
  async fetchCustomers() {
    this.loading.customers = true;
    const params: IFindArguments = {
      authentication_token: this.activeUser.authentication_token,
      approval_status: ['', ApprovalStatus.Approved, ApprovalStatus.Pending],
    };

    // If logged in user is a site user, only show associated sites in autocomplete
    if (this.activeUser.roles.includes('site_user')) {
      params.show_site_requests = true;
    }

    try {
      const { data: { customers }} = await this.customerService.api.find(params);
      const preparedData = prepareData(customers, CustomerService.mapData);
      await this.customerService.insert({ data: preparedData });
      this.customersData = this.customerService.findIn(preparedData.map((customer: Customer) => customer.id));
    } catch (error) {
      Logger.error(error);
    } finally {
      this.loading.customers = false;
    }
  }

  /**
   * Fetch User data from server and populate ORM
   */
  async fetchUsers() {
    this.loading.users = true;
    try {
      const { data: { order_form_users: users } } = await this.userService.api.find({
        authentication_token: this.activeUser.authentication_token,
      });
      await this.userService.insertOrUpdate({ data: users });
      this.usersData = this.userService.all();
    } catch (error) {
      Logger.error(error);
    } finally {
      this.loading.users = false;
    }
  }

  /**
   * User can place an Order for a Customer and/or another User
   */
  canOrderFor() {
    return this.$ability.can('order_for', User);
  }

  /**
   * OnChange handler for isContracted switch.
   */
  onContractedChange() {
    this.form.customer = null;
  }

  /**
   * Create Order model data and navigate to orders-create
   */
  async onContinue() {
    const order = new Order();

    if (this.form.customer) {
      order.customer = this.form.customer;
      order.submitters_email = this.form.email;
      order.ship_address = {
        facility_name: this.form.customer.name,
        city: this.form.customer.city,
        delivery_address: this.form.customer.address,
        postal: this.form.customer.postal_zip,
        country: this.form.customer.country,
        province: this.form.customer.prov_state,
        contact_name: this.form.customer.contact,
        contact_phone: this.form.customer.contact_phone,
        contact_email: this.form.customer.contact_email,
        cost_center: this.form.customer.cost_center,
      };
      order.bill_address = {
        facility_name: this.form.customer.bt_name,
        city: this.form.customer.bt_city,
        delivery_address: this.form.customer.bt_address,
        postal: this.form.customer.bt_postal_zip,
        country: this.form.customer.bt_country,
        province: this.form.customer.bt_prov_state,
        contact_name: this.form.customer.bt_contact,
        contact_phone: this.form.customer.bt_phone,
        contact_email: this.form.customer.bt_email,
      };
      if (this.form.customer.general_notes !== 'null') {
        order.order_detail.delivery_instructions = this.form.customer.general_notes;
      }
      if (this.form.isOrderOnBehalf) {
        order.submitters_email = this.form.orderOnBehalfUser;
      }
    } else {
      if (this.form.isOrderOnBehalf) {
        order.submitters_email = this.form.orderOnBehalfUser;
      } else {
        order.submitters_email = this.form.email;
      }
    }

    this.$router.push({
      name: 'orders-create',
      query: {
        order: JSON.stringify(order),
      },
    });
  }

  /**
   * Sort and format Customer data for display in v-data-table component
   */
  formatCustomersData(customers: Customer[]) {
    return customers
      .sort((a, b) => ((a.name < b.name) ? -1 : 1))
      .map((customer) => ({
        text: (customer.approval_status === ApprovalStatus.Pending) ?
          `${customer.name} - (Pending Approval)` :
          customer.name,
        value: customer,
        disabled: customer.approval_status === ApprovalStatus.Pending,
      }));
  }
}
</script>
