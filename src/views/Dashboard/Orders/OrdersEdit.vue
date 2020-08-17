<template>
  <div
    ref="root"
    class="orders-edit"
  >
    <!-- Drawer for displaying an Order's activity timeline -->
    <orders-timeline
      v-if="model.id"
      v-model="isTimelineOpen"
      class="orders-edit__timeline"
      :order="model"
    />
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
        :disabled="!canUpdate(model)"
        @save="onClickSave(model)"
      />

      <v-divider class="my-4" />

      <orders-item-list
        ref="orders-item-list"
        :items="model.order_items"
        :hide-sections="getSections(model)"
        :disabled="!canUpdate(model)"
      />
    </v-card>
    <!-- Timeline Button -->
    <v-btn
      large
      top
      fab
      right
      fixed
      class="orders-edit__timeline-btn"
      color="primary"
      @click="isTimelineOpen = !isTimelineOpen"
    >
      <v-icon>mdi-clock</v-icon>
    </v-btn>
    <!-- Form Action Buttons -->
    <orders-form-controls
      class="orders-edit__controls"
      :show-update-status="canUpdateStatus(model)"
      :show-update="canUpdate(model)"
      @save="onClickSave(model)"
      @approve="onClickApprove(model)"
      @deny="onClickDeny(model)"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop } from 'vue-property-decorator';
import { Order } from '@/models/internal';
import { OrderForm } from '@/models/forms/OrderForm';
import { OrderService, UserService } from '@/services';
import { IEditFormView } from '@/lib/interfaces';
import prepareData from '@/models/functions/prepareData';
import Logger from '@/tools/Logger';
import OrdersForm from './components/OrdersForm.vue';
import OrdersFormControls from './components/OrdersFormControls.vue';
import OrdersItemList from './components/OrdersItemList.vue';
import OrdersTimeline from './components/OrdersTimeline/OrdersTimeline.vue';
import { Sync } from 'vuex-pathify';

@Component({
  name: 'OrdersEdit',
  components: {
    OrdersForm,
    OrdersItemList,
    OrdersFormControls,
    OrdersTimeline,
  },
})
export default class OrdersEdit extends Vue implements IEditFormView<Order> {

  @Ref('orders-form')
  readonly formRef!: any;

  @Prop({ required: true })
  id!: string | number;

  @Prop({ required: true }) private readonly canUpdate!: (order: Order) => boolean;

  @Prop({ required: true }) private readonly canUpdateStatus!: (order: Order) => boolean;

  @Prop({ required: true }) private readonly edit!: (order: Order) => void;

  @Prop({ required: true }) readonly save!: (order: Order) => Promise<any>;

  @Prop({ required: true }) private readonly approve!: (order: Order) => Promise<any>;

  @Prop({ required: true }) private readonly deny!: (order: Order) => Promise<any>;

  @Prop({ required: true }) private readonly promptForOrderNotes!: () => Promise<string>;

  @Prop({ required: true })
  private readonly showAlert!: (type: string, messages: string[]) => void;

  @Prop({ required: true }) private readonly resetAlert!: () => void;

  @Prop({ required: true }) private readonly getSections!: () => string[];

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

  readonly title = 'Edit Order';

  readonly subtitle = 'Make changes to an existing Order and save. All fields are required.';

  /**
   * Is the timeline drawer open
   */
  isTimelineOpen = false;

  form = new OrderForm(new Order());

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

  async init(): Promise<void> {
    this.isOverlayVisible = true;
    try {
      const data = await this.fetchData();
      const preparedData = prepareData(data, OrderService.mapData);

      await this.orderService.insert({
        data: preparedData,
        insertOrUpdate: ['users'],
      });
      const order = this.orderService
        .query()
        .with('order_items')
        .with('comments')
        .whereId(preparedData.id)
        .first() as Order;
      this.model = order;
    } catch (error) {
      Logger.error(error);
      this.showAlert(
        'error',
        [
          'Sorry, there was an error loading this order.',
          'Please try again later.',
        ]);
    } finally {
      this.isOverlayVisible = false;
    }
  }

  async fetchData(): Promise<Order> {
    const order = await this.orderService.api.findOne({
      authentication_token: this.userService.getActiveToken(),
      id: this.id,
    });
    if (!order) throw Error('Unable to fetch existing order');
    return order;
  }

  async onClickSave(order: Order) {
    order.notes = await this.promptForOrderNotes();
    await this.save(order);
    this.$router.push({ name: 'orders-list' });
  }

  /**
   * Click handler for TableRowActions approve button
   */
  async onClickApprove(order: Order) {
    order.notes = await this.promptForOrderNotes();
    await this.approve(order);
    this.$router.push({ name: 'orders-list' });
  }

  /**
   * Click handler for TableRowActions deny button
   */
  async onClickDeny(order: Order) {
    order.notes = await this.promptForOrderNotes();
    await this.deny(order);
    this.$router.push({ name: 'orders-list' });
  }
}
</script>

<style lang="scss">
.orders-edit {
  // Bring down timeline button from top of screen
  &__timeline-btn {
    top: 5.5rem !important;
    z-index: 3 !important;
  }

  // Keep Buttons underneath Timeline
  &__controls {
    z-index: 3 !important;
  }
}
</style>
