<template>
  <div class="customers-view__wrapper">
    <v-alert
      v-model="isAlertVisible"
      :color="isDisplaySuccessAlert ? 'success' : 'error'"
      dark
      icon="mdi-check-circle"
      border="left"
      prominent
    >
      <div class="title">
        <span v-if="isDisplaySuccessAlert">{{ alertMessages.success }}</span>
        <span v-else> {{ alertMessages.error }}</span>
      </div>
    </v-alert>
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
      <v-row justify="space-between">
        <!-- Card title/subtitles with Customer name -->
        <v-list>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="headline">
                {{ name }}
              </v-list-item-title>
              <v-list-item-subtitle>View Site details</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-actions v-if="canUpdate()">
          <!-- Edit Button -->
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                color="primary"
                text
                fab
                :to="{ name: 'customers-edit', params: { id } }"
                v-on="on"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit Site</span>
          </v-tooltip>
        </v-card-actions>
      </v-row>

      <v-divider />

      <info-list-sections :sections="sections">
        <template v-slot:after>
          <!-- ApprovalStatus indicator and information -->
          <v-row>
            <v-col>
              <v-list two-line>
                <v-list-item>
                  <v-list-item-icon>
                    <approval-status-indicator :status="data.approval_status" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ status }}
                    </v-list-item-title>
                    <v-list-item-subtitle>Status</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col
              v-if="canUpdateStatus() && data.approval_status === 'pending'"
              class="d-flex justify-end align-end"
            >
              <!-- Approve Button -->
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    color="success"
                    @click="approve"
                    v-on="on"
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </template>
                <span>Approve</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <!-- Deny Button -->
                  <v-btn
                    class="ml-2"
                    fab
                    color="error"
                    @click="deny"
                    v-on="on"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>Deny</span>
              </v-tooltip>
            </v-col>
          </v-row>

          <!-- On Credit Hold indicator -->
          <v-row>
            <v-col>
              <v-list two-line>
                <v-list-item>
                  <v-list-item-icon>
                    <approval-status-indicator :status="creditHold" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ (creditHold === 'approved') ? 'No' : 'Yes' }}
                    </v-list-item-title>
                    <v-list-item-subtitle>On Hold</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </template>
      </info-list-sections>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ApprovalStatusIndicator from '@/components/StatusIndicator/ApprovalStatusIndicator.vue';
import { Customer } from '@/models/internal';
import { CustomerService, UserService } from '../../../services';
import Logger from '@/tools/Logger';
import { IModelView } from '@/lib/interfaces';
import { ApprovalStatus } from '@/lib/enum';
import util from '@/tools/Utilities';
import { InfoList, InfoListSection } from '@/lib/types';
import InfoListSections from '@/components/InfoList/InfoListSections.vue';

@Component({
  name: 'CustomersView',
  components: {
    ApprovalStatusIndicator,
    InfoListSections,
  },
})
export default class CustomersView extends Vue implements IModelView<Customer> {

  isAlertVisible = false;

  isDisplaySuccessAlert = true;

  alertMessages = {
    success: 'Site approval status has been updated successfully!',
    error: 'Sorry, there was an error while updating this Site.',
  };

  /**
   * View title
   */
  private readonly title = 'View Site'

  /**
   * ID of the Customer
   */
  @Prop({ required: true })
  private readonly id!: string | number;

  /**
   * Customer service
   */
  private readonly customerService: CustomerService = CustomerService.getInstance();

  /**
   * User service
   */
  private readonly userService: UserService = UserService.getInstance();

  private readonly titleCase = util.titleCase;

  /**
   * Customer object and data to be rendered
   */
  data!: Customer;

  /**
   * Loading state handlers
   */
  loading = {
    overlay: false,
  };

  created() {
    this.init();
  }

  /**
   * Name
   */
  get name() {
    return util.titleCase(this.data.name || '?');
  }

  /**
   * Phone
   */
  get phone() {
    return util.formatPhone(this.data.phone || '?');
  }

  /**
   * Address
   */
  get address() {
    const address = this.data.address || '?';
    const postalZip = this.data.postal_zip || '?';
    return `${address}, ${postalZip}`;
  }

  /**
   * City
   */
  get city() {
    return util.titleCase(this.data.city || '?');
  }

  /**
   * Province
   */
  get province() {
    return this.data.prov_state?.toLocaleUpperCase() || '?';
  }

  /**
   * Country
   */
  get country() {
    return util.titleCase(this.data.country || '?');
  }

  /**
   * Status
   */
  get status() {
    return util.titleCase(this.data.approval_status || ApprovalStatus.Approved);
  }

  /**
   * Contact Name
   */
  get contactName() {
    return util.titleCase(this.data.contact || '?');
  }

  /**
   * Contact Phone
   */
  get contactPhone() {
    return util.formatPhone(this.data.contact_phone || '?');
  }

  /**
   * Contact Email
   */
  get contactEmail() {
    return util.titleCase(this.data.contact_email || '?');
  }

  /**
   * Iterable list of Customer fields to be rendered
   */
  get customerInfo(): InfoList {
    return [
      {
        label: 'Name',
        value: this.name,
        icon: 'mdi-domain',
        divider: true,
      }, {
        label: 'Phone',
        value: this.phone,
        icon: 'mdi-phone',
        divider: true,
      }, {
        label: 'City',
        value: this.city,
        icon: 'mdi-city',
        divider: true,
      }, {
        label: 'Address',
        value: this.address,
        icon: 'mdi-map-marker',
        divider: true,
        siblings: [
          {
            label: 'Province',
            value: this.province,
          }, {
            label: 'Country',
            value: this.country,
          },
        ],
      },
    ];
  }

  /**
   * Iterable list of a Customer's contact fields to be rendered
   */
  get contactInfo(): InfoList {
    return [
      {
        label: 'Name',
        value: this.contactName,
        icon: 'mdi-account',
        divider: true,
      }, {
        label: 'Phone',
        value: this.contactPhone,
        icon: 'mdi-phone',
        divider: true,
      }, {
        label: 'Email',
        value: this.formatEmails(this.contactEmail),
        icon: 'mdi-email',
        divider: false,
      },
    ];
  }

  /**
   * All the columns in the Customer details card to be iterated
   * on by section
   */
  get sections(): InfoListSection[] {
    return [
      {
        label: 'Customer Information',
        items: this.customerInfo,
      }, {
        label: 'Contact Information',
        items: this.contactInfo,
      },
    ];
  }

  /**
   * Give a status (approved/denied) for the Customer's `on_credit_hold` flag,
   * and default a null or unset value to approved.
   */
  get creditHold(): ApprovalStatus {
    if (this.data.on_credit_hold === null) return ApprovalStatus.Approved;
    return (this.data.on_credit_hold) ? ApprovalStatus.Denied : ApprovalStatus.Approved;
  }

  /**
   * User can update a Customer record
   */
  private canUpdate() {
    return this.$ability.can('update', Customer);
  }

  /**
   * User can update a Customer record's status
   */
  private canUpdateStatus() {
    return this.$ability.can('approve', Customer);
  }


  /**
   * Fetch Customer data from the server
   */
  async fetchData(): Promise<any> {
    const token = this.userService.getActiveToken();
    return this.customerService.api.findOne({
      id: this.id,
      authentication_token: token,
    });
  }

  async init(): Promise<void> {
    this.loading.overlay = true;
    try {
      const customer = this.customerService.find(this.id);
      if (customer) this.data = customer;
    } catch (error) {
      Logger.error(error);
    } finally {
      this.loading.overlay = false;
    }
  }

  /**
   * Look for and split a comma-delimited list of emails,
   * returning just one if no commas are found
   *
   * NOTE: This is merely for handling inconsistencies in
   * email formats coming from Blastramp
   */
  formatEmails(email: string) {
    return email
      .split(',')
      .map((e: string) => `<div>${e.trim().toLocaleLowerCase()}</div><br />`)
      .join('\n');
  }

  async approve() {
    this.loading.overlay = true;
    const token = this.userService.getActiveToken();
    if (!token) throw Error('Unable to get token from active User');
    try {
      const response = await this.customerService.api.approve({
        id: this.id,
        authentication_token: token,
        customer: this.data,
      });

      // update customer data displayed
      const { data: { customer }} = response;
      await this.customerService.update({ data: customer });
      const updatedCustomer = this.customerService.find(customer.id);
      if (updatedCustomer) this.data = updatedCustomer;

      this.isAlertVisible = true;

      return response;
    } catch (error) {
      this.isDisplaySuccessAlert = false;
      this.isAlertVisible = true;
      throw Error('Sorry, there was an error while saving this record.');
    } finally {
      this.loading.overlay = false;
    }
  }

  async deny() {
    this.loading.overlay = true;
    const token = this.userService.getActiveToken();
    if (!token) throw Error('Unable to get token from active User');
    try {
      const response = await this.customerService.api.deny({
        id: this.id,
        authentication_token: token,
        customer: this.data,
      });

      // update customer data displayed
      const { data: { customer }} = response;
      await this.customerService.update({ data: customer });
      const updatedCustomer = this.customerService.find(customer.id);
      if (updatedCustomer) this.data = updatedCustomer;

      this.isAlertVisible = true;

      return response;
    } catch (error) {
      this.isDisplaySuccessAlert = false;
      this.isAlertVisible = true;
      throw Error('Sorry, there was an error while saving this record.');
    } finally {
      this.loading.overlay = false;
    }
  }
}
</script>
