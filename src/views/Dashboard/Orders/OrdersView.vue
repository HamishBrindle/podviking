<template>
  <div
    ref="root"
    class="orders-view"
  >
    <!-- Drawer for displaying an Order's activity timeline -->
    <orders-timeline
      v-if="data.id"
      v-model="isTimelineOpen"
      class="orders-edit__timeline"
      :order="data"
    />

    <v-card
      class="pa-4"
      elevation="0"
      outlined
    >
      <v-row justify="space-between">
        <div>
          <v-card-title>
            <span class="display-1 font-weight-light">{{ title }}</span>
          </v-card-title>

          <v-card-text>
            <span class="body-1 grey--text text--darken-1">{{ subtitle }}</span>
          </v-card-text>
        </div>

        <v-card-actions>
          <!-- Edit Button -->
          <template v-if="canUpdate(data)">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  fab
                  small
                  elevation="0"
                  @click="edit(data)"
                  v-on="on"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Edit</span>
            </v-tooltip>
          </template>

          <!-- Approve/Deny Buttons -->
          <template v-if="canUpdateStatus(data)">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  fab
                  small
                  elevation="0"
                  color="success"
                  @click="onClickApprove(data)"
                  v-on="on"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </template>
              <span>Approve</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  fab
                  small
                  elevation="0"
                  color="error"
                  @click="onClickDeny(data)"
                  v-on="on"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>Deny</span>
            </v-tooltip>
          </template>
        </v-card-actions>
      </v-row>

      <v-divider class="mt-4" />

      <info-list-sections :sections="sections">
        <template v-slot:after>
          <!-- Status indicator and information -->
          <v-row justify="space-between">
            <v-col>
              <v-list two-line>
                <v-list-item>
                  <v-list-item-icon>
                    <order-status-indicator :status="data.status" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ status }}
                    </v-list-item-title>
                    <v-list-item-subtitle>Order Status</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </template>
      </info-list-sections>
    </v-card>

    <!-- Order Items -->
    <v-card
      class="pa-4"
      elevation="0"
      outlined
    >
      <v-card-title>
        <span>Order Items</span>
      </v-card-title>

      <orders-item-list
        ref="orders-item-list"
        :items="items"
        :hide-sections="getSections(data)"
        disabled
      />
    </v-card>
    <!-- Timeline Button -->
    <v-btn
      large
      top
      fab
      right
      fixed
      class="orders-view__timeline-btn"
      color="primary"
      @click="isTimelineOpen = !isTimelineOpen"
    >
      <v-icon>mdi-clock</v-icon>
    </v-btn>
    <div ref="comment-view" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { Sync } from 'vuex-pathify';
import { OrderStatus } from '@/lib/enum/Status.enum';
import { IModelView } from '@/lib/interfaces/ModelView.interface';
import { InfoListSection, InfoList as InfoListType } from '@/lib/types';
import { OrderService, UserService } from '@/services';
import prepareData from '@/models/functions/prepareData';
import CommentsView, { showComments } from '@/views/Dashboard/Comments/CommentsView.vue';
import InfoListSections from '@/components/InfoList/InfoListSections.vue';
import Logger from '@/tools/Logger';
import { Order, Sku } from '@/models/internal';
import OrdersItemList from './components/OrdersItemList.vue';
import OrderStatusIndicator from '@/components/StatusIndicator/OrderStatusIndicator.vue';
import OrdersTimeline from './components/OrdersTimeline/OrdersTimeline.vue';
import util from '@/tools/Utilities';

@Component({
  name: 'OrdersView',
  components: {
    CommentsView,
    InfoListSections,
    OrdersItemList,
    OrdersTimeline,
    OrderStatusIndicator,
  },
})
export default class OrdersView extends Vue implements IModelView<Order> {
  @Ref('root')
  readonly rootRef!: Element;

  @Ref('comment-view')
  readonly commentViewRef!: Element;

  @Prop({ required: true })
  readonly id!: number | string;

  @Prop({ required: true }) private readonly canUpdate!: (order: Order) => boolean;

  @Prop({ required: true }) private readonly canUpdateStatus!: (order: Order) => boolean;

  @Prop({ required: true }) private readonly edit!: (order: Order) => void;

  @Prop({ required: true }) private readonly approve!: (order: Order) => Promise<any>;

  @Prop({ required: true }) private readonly deny!: (order: Order) => Promise<any>;

  @Prop({ required: true }) private readonly promptForOrderNotes!: () => Promise<string>;

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

  readonly title = 'View Order';

  readonly subtitle = `
    Review an Order's details that were usedduring the initial placement of
    the Order.
  `;

  data = new Order();

  /**
   * Is the timeline drawer open
   */
  isTimelineOpen = false;

  /**
   * Order's shipping address
   */
  get shipping(): InfoListType {
    return [
      {
        label: 'Contact Name',
        value: this.data.ship_address.contact_name,
        icon: 'mdi-account',
        divider: true,
      }, {
        label: 'Contact Phone',
        value: util.formatPhone(this.data.ship_address.contact_phone),
        icon: 'mdi-phone',
        divider: true,
      }, {
        label: 'Contact Email',
        value: this.data.ship_address.contact_email,
        icon: 'mdi-email',
        divider: true,
      }, {
        label: 'Company Name',
        value: this.data.ship_address.facility_name,
        icon: 'mdi-domain',
        divider: true,
      }, {
        label: 'Address',
        value: this.data.ship_address.delivery_address,
        icon: 'mdi-map-marker',
        divider: false,
        siblings: [
          {
            label: 'City',
            value: this.data.ship_address.city,
          }, {
            label: 'Postal Code / Zip',
            value: this.data.ship_address.postal,
          }, {
            label: 'Province',
            value: this.data.ship_address.province,
          }, {
            label: 'Country',
            value: this.data.ship_address.country,
          },
        ],
      }, {
        label: 'Cost Center #',
        value: this.data.ship_address.cost_center,
        icon: 'mdi-domain',
        divider: true,
      },
    ];
  }

  /**
   * Order's billing address
   */
  get billing(): InfoListType {
    return [
      {
        label: 'Contact Name',
        value: this.data.bill_address.contact_name,
        icon: 'mdi-account',
        divider: true,
      }, {
        label: 'Contact Phone',
        value: util.formatPhone(this.data.bill_address.contact_phone),
        icon: 'mdi-phone',
        divider: true,
      }, {
        label: 'Contact Email',
        value: this.data.bill_address.contact_email,
        icon: 'mdi-email',
        divider: true,
      }, {
        label: 'Company Name',
        value: this.data.bill_address.facility_name,
        icon: 'mdi-domain',
        divider: true,
      }, {
        label: 'Address',
        value: this.data.bill_address.delivery_address,
        icon: 'mdi-map-marker',
        divider: false,
        siblings: [
          {
            label: 'City',
            value: this.data.bill_address.city,
          }, {
            label: 'Postal Code / Zip',
            value: this.data.bill_address.postal,
          }, {
            label: 'Province',
            value: this.data.bill_address.province,
          }, {
            label: 'Country',
            value: this.data.bill_address.country,
          },
        ],
      },
    ];
  }

  /**
   * Order's details: date, priority, etc.
   */
  get details(): InfoListType {
    return [
      {
        label: 'Date',
        value: this.data.order_detail.date,
        icon: 'mdi-calendar',
        divider: true,
      }, {
        label: 'Priority',
        value: util.titleCase(this.data.order_detail.priority),
        icon: 'mdi-truck-fast-outline',
        divider: true,
      }, {
        label: 'Delivery Instructions',
        value: this.data.order_detail.delivery_instructions,
        icon: 'mdi-playlist-edit',
        divider: true,
      },
    ];
  }

  /**
   * All of the items on an Order
   */
  get items(): Sku[] {
    return this.data.order_items.filter((sku) => sku.quantity > 0);
  }

  /**
   * All the columns in the Customer details card to be iterated
   * on by section
   */
  get sections(): InfoListSection[] {
    return [
      {
        label: 'Shipping Address',
        items: this.shipping,
      }, {
        label: 'Billing Address',
        items: this.billing,
      }, {
        label: 'Order Details',
        items: this.details,
      },
    ];
  }

  get status() {
    if (this.data.status === OrderStatus.Reviewed) {
      return util.titleCase('reviewed');
    }
    return util.titleCase(this.data.status);
  }

  created() {
    this.init();
  }

  async fetchData(): Promise<Order> {
    const order = await this.orderService.api.findOne({
      authentication_token: this.userService.getActiveToken(),
      id: this.id,
    });
    if (!order) throw Error('Unable to fetch existing order');
    return order;
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
      this.data = new Order(preparedData);
      const boundShowComments = showComments.bind(this);
      boundShowComments<Order>(this.commentViewRef, {
        parentId: parseInt(this.id as string, 10),
        parentEntity: 'draft_orders',
      });
    } catch (error) {
      Logger.error(error);
    } finally {
      this.isOverlayVisible = false;
    }
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
.orders-view {
  // Give some space between card-views on this page
  & > div.v-card:not(:last-child) {
    margin-bottom: 1rem;
  }

  // Give card action buttons some room to breath
  .v-card__actions > .v-btn:not(:last-child) {
    margin-right: 0.5rem;
  }

  // Bring down timeline button from top of screen
  &__timeline-btn {
    top: 7rem !important;
    z-index: 3 !important;
  }

  @media only screen and (max-width: 117.5rem) {
    &__timeline-btn {
      top: 12.5rem !important;
    }
  }
}
</style>
