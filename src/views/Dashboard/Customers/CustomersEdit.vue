<template>
  <div class="customers-edit__wrapper">
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
        Make changes to this Site and save.
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
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { Loading } from '@/lib/types';
import { IEditFormView } from '@/lib/interfaces';
import { CustomerForm } from '@/models/forms';
import { Customer } from '@/models/internal';
import { CustomerService, UserService } from '@/services';
import CustomersForm from './components/CustomersForm.vue';

@Component({
  name: 'CustomersEdit',
  components: {
    CustomersForm,
  },
})
export default class CustomersEdit extends Vue implements IEditFormView<Customer> {
  @Prop()
  id!: string;

  @Ref('customer-form')
  readonly formRef!: any;

  readonly title = 'Edit Site';

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
  loading: Loading = {
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
    this.init();
  }

  init(): void {
    const customer = this.fetchData(this.id);
    if (!customer) throw Error('Unable to fetch Customer from server');
    this.form = new CustomerForm(customer);
  }

  async save(): Promise<any> {
    this.loading.overlay = true;
    const token = this.userService.getActiveToken();
    if (!token) throw Error('Unable to get token from active User');
    try {
      const response = await this.customerService.api.update({
        id: this.id,
        authentication_token: token,
        customer: this.model,
      });
      return response;
    } catch (error) {
      throw Error('Sorry, there was an error while saving this record.');
    } finally {
      this.loading.overlay = false;
    }
  }

  fetchData(id: string): any {
    return this.customerService.find(id);
  }
}
</script>
