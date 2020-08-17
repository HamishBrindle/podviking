<template>
  <div class="customers-create__wrapper">
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
      <v-card-text>
        {{ subtitle }}
        <span class="font-weight-bold">All fields are required.</span>
      </v-card-text>

      <customers-form
        ref="customer-form"
        :model.sync="model"
        :schema="schema"
        @save="save"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import { ICreateFormView } from '@/lib/interfaces';
import { User, Customer } from '@/models/internal';
import { CustomerForm } from '@/models/forms';
import { CustomerService, UserService } from '@/services';
import CustomersForm from './components/CustomersForm.vue';

@Component({
  name: 'CustomersCreate',
  components: {
    CustomersForm,
  },
})
export default class CustomersCreate extends Vue implements ICreateFormView<Customer> {

  @Ref('customer-form') readonly formRef!: any;

  isAlertVisible = false;

  isDisplaySuccessAlert = true;

  alertMessages = {
    success: 'Site has been created successfully!',
    error: 'Sorry, there was an error while saving this site.',
  };

  title = 'Create Site';

  subtitle = 'Create a Site record and save it.';

  /**
   * Customer Service
   */
  private readonly customerService: CustomerService = CustomerService.getInstance();

  /**
   * User Service
   */
  private readonly userService: UserService = UserService.getInstance();

  /**
   * Loading indicators for components
   */
  loading = {
    overlay: false,
    form: false,
  };

  form!: CustomerForm;

  get schema() {
    return this.form.getSchema();
  }

  get model() {
    return this.form.getModel();
  }

  set model(model) {
    this.form.setModel(model);
  }

  created() {
    const user = this.userService.getActive() as User;
    const customer = new Customer();
    if (user.roles.includes('site_user')) {
      this.title = 'Request Customer';
      this.subtitle = 'Request a Customer to be added.';
      this.alertMessages.success = 'Site request has been sent successfully!';

      // set site_requester if active user is site_user
      customer.site_requester = user.email.toString();
    }
    if (customer) {
      this.form = new CustomerForm(customer);
    }
  }

  async save(): Promise<any> {
    this.loading.overlay = true;
    const user = this.userService.getActive() as User;
    const token = this.userService.getActiveToken();
    if (!token) throw Error('Unable to get token from active User');
    try {
      let response;
      if (user.roles?.includes('site_user')) {
        response = await this.customerService.api.request({
          authentication_token: token,
          customer: this.model,
        });
      } else {
        response = await this.customerService.api.create({
          authentication_token: token,
          customer: this.model,
        });
      }
      this.isAlertVisible = true;
      setTimeout(() => {
        this.$router.push({
          name: 'customers-list',
        });
      }, 3000);
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
