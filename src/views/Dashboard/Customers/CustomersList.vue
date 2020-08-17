<template>
  <div class="customers-list__wrapper">
    <v-overlay :value="loading.overlay">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
    <v-row>
      <v-col>
        <span class="display-1 font-weight-light">{{ title }}</span>
      </v-col>
    </v-row>

    <v-card
      class="pa-4"
      elevation="0"
      outlined
    >
      <v-skeleton-loader
        v-show="loading.table"
        type="table-tbody"
        width="100%"
        height="20rem"
      />
      <v-data-table
        v-show="!loading.table"
        v-model="selected"
        :single-select="false"
        :headers="headers"
        :items="customers"
        :search="search"
        :sort-by="['approval_status', 'name']"
        :sort-desc="[true, false]"
        item-key="id"
        show-select
      >
        <!-- Table actions and buttons at the top -->
        <template v-slot:top>
          <v-card-actions>
            <v-row
              align="baseline"
              justify="space-between"
            >
              <!-- Search field -->
              <v-col
                cols="12"
                sm="12"
                md="6"
                lg="4"
                xl="4"
              >
                <v-text-field
                  v-model="search"
                  class="ma-2"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                />
              </v-col>

              <!-- Table Controls -->
              <v-col
                cols="12"
                sm="12"
                md="6"
                lg="4"
                xl="4"
              >
                <v-row
                  align="center"
                  justify="end"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        :color="(showDeniedCustomers) ? 'error' : 'grey lighten-1'"
                        text
                        fab
                        @click="onClickShowDeniedCustomers"
                        v-on="on"
                      >
                        <v-icon>mdi-minus-circle</v-icon>
                      </v-btn>
                    </template>
                    <span>Show denied Sites</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="info"
                        text
                        fab
                        v-on="on"
                        @click="selectPendingStatus"
                      >
                        <v-icon>mdi-check-box-multiple-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Select pending Sites</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="success"
                        :disabled="selected.length === 0"
                        text
                        fab
                        v-on="on"
                      >
                        <v-icon>mdi-clipboard-check-multiple</v-icon>
                      </v-btn>
                    </template>
                    <span>Approve selected Sites</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        elevation="0"
                        color="success"
                        fab
                        :to="{ name: 'customers-create' }"
                        v-on="on"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Create Site</span>
                  </v-tooltip>
                </v-row>
              </v-col>
            </v-row>
          </v-card-actions>
        </template>

        <template v-slot:item.phone="{ item: record }">
          <span>{{ formatPhone(record.phone) }}</span>
        </template>

        <template v-slot:item.on_credit_hold="{ item: record }">
          <span>{{ (!!record.on_credit_hold) ? 'Yes' : 'No' }}</span>
        </template>

        <template v-slot:item.approval_status="{ item: record }">
          <approval-status-indicator
            :status="record.approval_status"
          />
        </template>

        <!-- Buttons for each row in the table -->
        <template v-slot:item.actions="{ item: record }">
          <table-row-actions
            :record="record"
            :view="viewCustomer"
            :edit="editCustomer"
            :approve="approveCustomer"
            :deny="denyCustomer"
            :can-read="canRead"
            :can-update="canUpdate"
            :can-update-status="canUpdateStatus"
          />
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Customer } from '@/models/internal';
import { CustomerService } from '@/services/CustomerService';
import { DataTableHeader } from 'vuetify';
import { ITableView, IFindArguments } from '@/lib/interfaces';
import TableRowActions from '@/components/Table/TableRowActions.vue';
import ApprovalStatusIndicator from '@/components/StatusIndicator/ApprovalStatusIndicator.vue';
import { ApprovalStatus } from '@/lib/enum';
import Logger from '@/tools/Logger';
import { UserService } from '@/services';
import util from '@/tools/Utilities';
import prepareData from '@/models/functions/prepareData';

@Component({
  name: 'CustomersList',
  components: {
    TableRowActions,
    ApprovalStatusIndicator,
  },
})
export default class CustomersList extends Vue implements ITableView<Customer> {
  /**
   * Title to be displayed at top of component/view
   */
  private readonly title = 'Sites List';

  /**
   * Customer Service
   */
  private readonly customerService: CustomerService = CustomerService.getInstance();

  /**
   * User Service
   */
  private readonly userService: UserService = UserService.getInstance();

  /**
   * Loading state handlers
   */
  loading = {
    overlay: false,
    table: false,
  };

  /**
   * Search string for querying table data
   */
  search = '';

  data: Customer[] = [];

  selected: Customer[] = [];

  headers: DataTableHeader[] = [
    { text: 'Name', value: 'name', width: 180 },
    { text: 'Phone', value: 'phone', width: 200 },
    { text: 'Contact', value: 'contact' },
    { text: 'Address', value: 'address' },
    { text: 'City', value: 'city' },
    { text: 'On Hold', value: 'on_credit_hold', width: 100 },
    { text: 'Status', value: 'approval_status', width: 100 },
    { text: 'Actions', value: 'actions', width: 200, sortable: false, filterable: false },
  ];

  showDeniedCustomers = false;

  get customers() {
    if (this.showDeniedCustomers) {
      return this.data.filter((customer) => customer.approval_status === ApprovalStatus.Denied);
    }
    return this.data.filter((customer) => customer.approval_status !== ApprovalStatus.Denied);
  }

  created() {
    this.init();
  }

  async fetchData() {
    const token = this.userService.getActiveToken();
    const user = this.userService.getActive();
    const params: IFindArguments = {
      authentication_token: token,
    };
    if (user?.roles.includes('site_user')) {
      params.show_site_requests = true;
    }
    return this.customerService.api.find(params);
  }

  async init() {
    this.loading.table = true;
    try {
      const { data: { customers }} = await this.fetchData();
      const preparedData = prepareData(customers, CustomerService.mapData);
      await this.customerService.insert({ data: preparedData });
      this.data = this.customerService.findIn(customers.map((data: any) => data.Customer.newid));
    } catch (error) {
      Logger.error(error);
    } finally {
      this.loading.table = false;
    }
  }

  /**
   * Navigate to a summary of this Customer's data
   * @param customer
   */
  async viewCustomer(customer: Customer) {
    return this.$router.push({
      name: 'customers-view',
      params: {
        id: String(customer.id),
      },
    });
  }

  /**
   * Edit a Customer record from the data table
   * @param customer
   */
  async editCustomer(customer: Customer) {
    return this.$router.push({
      name: 'customers-edit',
      params: {
        id: String(customer.id),
      },
    });
  }

  /**
   * Approve a Customer record's status from the data table
   * @param customer
   */
  async approveCustomer(customer: Customer) {
    this.loading.overlay = true;
    const token = this.userService.getActiveToken();
    if (!token) throw Error('Unable to get token from active User');
    try {
      const response = await this.customerService.api.approve({
        id: customer.id,
        authentication_token: token,
        customer,
      });

      await this.customerService.update({ data: response.data.customer });
      const updatedCustomer = this.customerService.find(response.data.customer.id);
      if (updatedCustomer) {
        const i = this.data.findIndex((customer) => customer.id === updatedCustomer.id);
        this.data[i] = updatedCustomer;
      }

      return response;
    } catch (error) {
      throw Error('Sorry, there was an error while saving this record.');
    } finally {
      this.loading.overlay = false;
    }
  }

  /**
   * Deny a Customer record's status from the data table
   * @param customer
   */
  async denyCustomer(customer: Customer) {
    this.loading.overlay = true;
    const token = this.userService.getActiveToken();
    if (!token) throw Error('Unable to get token from active User');
    try {
      const response = await this.customerService.api.deny({
        id: customer.id,
        authentication_token: token,
        customer,
      });

      await this.customerService.update({ data: response.data.customer });
      const updatedCustomer = this.customerService.find(response.data.customer.id);
      if (updatedCustomer) {
        const i = this.data.findIndex((customer) => customer.id === updatedCustomer.id);
        this.data[i] = updatedCustomer;
      }

      return response;
    } catch (error) {
      throw Error('Sorry, there was an error while saving this record.');
    } finally {
      this.loading.overlay = false;
    }
  }

  /**
   * Select all the visible Customer rows where the status is
   * pending
   */
  selectPendingStatus() {
    this.selected = this.data.filter((item) => item.approval_status === ApprovalStatus.Pending);
  }

  /**
   * Format the phone number
   */
  formatPhone(phone: string) {
    return util.formatPhone(phone);
  }

  onClickShowDeniedCustomers() {
    this.showDeniedCustomers = !this.showDeniedCustomers;
  }

  canRead() {
    return this.$ability.can('read', Customer);
  }

  canUpdate(customer: Customer) {
    return this.$ability.can('update', customer);
  }

  canUpdateStatus(customer: Customer) {
    return this.$ability.can('approve', customer);
  }
}
</script>
