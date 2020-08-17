<template>
  <div class="orders-create">
    <template>
      <v-card
        class="pa-4"
        elevation="0"
        outlined
      >
        <v-card-title>
          <span class="display-1 font-weight-light">{{ title }}</span>
        </v-card-title>

        <v-card-text>
          <span class="body-1">{{ subtitle }}</span>
        </v-card-text>

        <v-divider class="my-4" />

        <orders-form
          ref="orders-form"
          :model.sync="model"
          :schema="schema"
          @save="save"
        />

        <v-divider class="my-4" />

        <orders-item-list
          ref="orders-item-list"
          :items="model.order_items"
          :hide-sections="getSections(model)"
        />

        <v-row
          justify="end"
          class="mr-2"
        >
          <v-btn
            text
            color="primary"
            class="mx-2"
            @click="onResetForm"
          >
            Reset Form
          </v-btn>
          <v-btn
            color="success"
            @click="onSaveForm"
          >
            Save
          </v-btn>
        </v-row>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop } from 'vue-property-decorator';
import { ICreateFormView } from '@/lib/interfaces';
import { Sku, Order } from '@/models/internal';
import { OrderService, UserService } from '@/services';
import OrdersForm from './components/OrdersForm.vue';
import OrdersItemList from './components/OrdersItemList.vue';
import Logger from '@/tools/Logger';
import skuData from '@/../.data/skus';
import { OrderForm } from '@/models/forms/OrderForm';
import { Sync } from 'vuex-pathify';

@Component({
  name: 'OrdersCreate',
  components: {
    OrdersForm,
    OrdersItemList,
  },
})
export default class OrdersCreate extends Vue implements ICreateFormView<Order> {

  @Ref('orders-form')
  readonly formRef!: any;

  /**
   * A Order than has been previous created and hydrated,
   * or a brand new Order object
   */
  @Prop({ required: false, default: () => new Order() })
  private readonly order!: Order;

  @Prop({ required: true }) private readonly canUpdate!: () => boolean;

  @Prop({ required: true }) private readonly canUpdateStatus!: () => boolean;

  @Prop({ required: true })
  private readonly showAlert!: (type: string, messages: string[]) => void;

  @Prop({ required: true }) private readonly resetAlert!: () => void;

  @Prop({ required: true }) private readonly getSections!: (order: Order) => string[];

  @Prop({ required: true }) private readonly validateItems!: (items: Sku[]) => boolean;

  @Sync('context/overlay@visible')
  isOverlayVisible!: boolean;

  /**
   * Customer Service
   */
  private readonly orderService: OrderService = OrderService.getInstance();

  /**
   * User Service
   */
  private readonly userService: UserService = UserService.getInstance();

  private readonly title = 'Create Order';

  private readonly subtitle = 'Create a new Order request and save it to be reviewed.';

  form!: OrderForm;

  get schema() {
    return this.form?.getSchema();
  }

  get model() {
    return this.form?.getModel();
  }

  set model(model) {
    this.form?.setModel(model);
  }

  created() {
    const skus = skuData.map((sku) => new Sku({ ...sku }));
    this.order.order_items.push(...skus);
    this.form = new OrderForm(this.order);
  }

  /**
   * Listener for Save button click
   */
  onSaveForm() {
    this.formRef.save();
  }

  /**
   * Listener for Reset button click
   */
  onResetForm() {
    this.formRef.reset();
    this.model.order_items.forEach((item) => {
      item.quantity = 0;
    });
  }

  async save(): Promise<any> {
    this.resetAlert();

    const isValid = await this.validateItems(this.model.order_items);
    if (!isValid) return;

    const token = this.userService.getActiveToken();
    if (!token) throw Error('Unable to get token from active User');

    try {
      this.isOverlayVisible = true;

      const response = await this.orderService.api.create({
        authentication_token: token,
        draft_order: this.model,
        submitters_email: this.model.submitters_email,
      });
      await this.orderService.insert({
        data: this.model,
        insertOrUpdate: ['users'],
      });
      this.$router.push({
        name: 'orders-list',
      });
      return response;
    } catch (error) {
      this.showAlert('error', ['Sorry, there was an error while saving this record.']);
      Logger.error(error);
    } finally {
      this.isOverlayVisible = false;
    }
  }
}
</script>
