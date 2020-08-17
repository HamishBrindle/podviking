<template>
  <v-navigation-drawer
    class="orders-timeline"
    :value="value"
    fixed
    right
    width="400"
    @input="onInput"
  >
    <v-container>
      <div class="d-flex align-center justify-space-between">
        <span class="title">
          Order Timeline
        </span>
        <v-btn
          text
          fab
          @click="onClose"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-divider />
      <orders-timeline-item
        v-for="(item, idx) in items"
        :key="idx"
        :item="item"
      />
      <template v-if="order.status === OrderStatus.Complete ">
        <v-divider />
        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="auto">
            <span class="text-subtitle-2 grey--text">Order Completed</span>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import OrdersTimelineItem, { IOrdersTimelineItem } from './OrdersTimelineItem.vue';
import { Order } from '@/models/internal';
import { OrderStatus } from '@/lib/enum/Status.enum';

@Component({
  name: 'OrdersTimeline',
  components: {
    OrdersTimelineItem,
  },
})
export default class OrdersTimeline extends Vue {
  /**
   * Is timeline drawer open
   */
  @Prop({ required: true })
  value!: boolean;

  /**
   * Order to display timeline for
   */
  @Prop({ required: true })
  order!: Order;

  private readonly OrderStatus = OrderStatus;

  /**
   * Timeline items
   */
  private get items(): IOrdersTimelineItem[] {
    return this.order.previous_form_states.map((state) => ({
      action: state.action,
      approvals: state.form_data.approvals,
      date: state.form_data.order_detail.date,
      note: state.form_data.notes,
    }));
  }

  onInput(event: Event) {
    return this.$emit('input', event);
  }

  onClose() {
    return this.$emit('input', false);
  }
}
</script>
