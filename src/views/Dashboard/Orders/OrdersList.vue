<template>
  <div class="orders-list">
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
        height="10rem"
      />
      <v-data-table
        v-show="!loading.table"
        v-model="selected"
        :single-select="false"
        :headers="headers"
        :items="data"
        :search="search"
        sort-desc
        sort-by="updated_at"
        item-key="id"
        show-select
      >
        <template v-slot:top="{ items: orders }">
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
                        color="info"
                        text
                        fab
                        v-on="on"
                        @click="selectSubmitted(orders)"
                      >
                        <v-icon>mdi-check-box-multiple-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Select all orders that have not been reviewed</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="success"
                        :disabled="selected.length === 0"
                        text
                        fab
                        v-on="on"
                        @click="onClickApproveSelectedOrders"
                      >
                        <v-icon>mdi-clipboard-check-multiple</v-icon>
                      </v-btn>
                    </template>
                    <span>Approve selected orders</span>
                  </v-tooltip>

                  <!-- Create new Order button -->
                  <template v-if="canCreate()">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <router-link
                          v-slot="{ navigate }"
                          :to="{ name: 'orders-setup' }"
                        >
                          <v-btn
                            small
                            elevation="0"
                            color="success"
                            fab
                            v-on="on"
                            @click="navigate"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </router-link>
                      </template>
                      <span>Create Order</span>
                    </v-tooltip>
                  </template>
                </v-row>
              </v-col>
            </v-row>
          </v-card-actions>
        </template>

        <!-- Formatted `created_at` date string -->
        <template v-slot:item.created_at="{ item: order }">
          {{ formatDate(order.created_at, true) }}
        </template>

        <!-- Formatted `updated_at` date string -->
        <template v-slot:item.updated_at="{ item: order }">
          {{ formatDate(order.updated_at, true) }}
        </template>

        <!-- CA Approval Status (Finalized) -->
        <template v-slot:item.status="{ item: order }">
          <order-status-indicator :status="order.status" />
        </template>

        <!-- Approval Status Indicators -->
        <template v-slot:item.status_part_a="{ item: order }">
          <approval-status-indicator
            :status="order.approvals.part_a"
            :empty="!hasItems('part_a', order)"
          />
        </template>

        <!-- <template v-slot:item.status_part_b="{ item: order }">
          <approval-status-indicator :status="order.approvals.part_b" />
          <v-icon v-else>
            mdi-circle-off-outline
          </v-icon>
        </template> -->

        <template v-slot:item.status_part_c="{ item: order }">
          <approval-status-indicator
            :status="order.approvals.part_c"
            :empty="!hasItems('part_c', order)"
          />
        </template>
        <!-- END OF Approval Status Indicators -->

        <!-- Buttons for each row in the table -->
        <template v-slot:item.actions="{ item: order }">
          <table-row-actions
            :record="order"
            :view="view"
            :edit="edit"
            :approve="onClickApprove"
            :deny="onClickDeny"
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
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { DataTableHeader } from 'vuetify';
import { OrderStatus } from '@/lib/enum/Status.enum';
import { OrderService, UserService } from '@/services';
import { ITableView } from '@/lib/interfaces';
import { Logger } from '@/tools';
import prepareData from '@/models/functions/prepareData';
import { Order } from '@/models/internal';
import ApprovalStatusIndicator from '@/components/StatusIndicator/ApprovalStatusIndicator.vue';
import OrderStatusIndicator from '@/components/StatusIndicator/OrderStatusIndicator.vue';
import TableRowActions from '@/components/Table/TableRowActions.vue';
import { OrderAbilities } from '../../../lib/types';
import util from '@/tools/Utilities';

/**
 * Columns in header
 */
type PermitableTableHeader<T> = (DataTableHeader<any> & { ability?: T });

@Component({
  name: 'OrdersList',
  components: {
    ApprovalStatusIndicator,
    OrderStatusIndicator,
    TableRowActions,
  },
})
export default class OrdersList extends Vue implements ITableView<Order> {

  @Prop({ required: true }) private readonly canCreate!: () => boolean;

  @Prop({ required: true }) private readonly canRead!: () => boolean;

  @Prop({ required: true }) private readonly canUpdate!: (order: Order) => boolean;

  @Prop({ required: true }) private readonly canUpdateStatus!: (order: Order) => boolean;

  @Prop({ required: true }) private readonly edit!: (order: Order) => void;

  @Prop({ required: true }) private readonly view!: (order: Order) => void;

  @Prop({ required: true }) private readonly approve!: (order: Order) => Promise<any>;

  @Prop({ required: true }) private readonly deny!: (order: Order) => Promise<any>;

  @Prop({ required: true }) private readonly promptForOrderNotes!: () => Promise<string>;

  @Prop({ required: true })
  private readonly hasItems!: (section: 'part_a'|'part_c', order: Order) => boolean;

  /**
   * Customer Service
   */
  private readonly orderService: OrderService = OrderService.getInstance();

  /**
   * User Service
   */
  private readonly userService: UserService = UserService.getInstance();

  private title ='Orders List';

  private loading = {
    table: true,
  };

  private formatDate = util.formatDate;

  private search = '';

  public selected: Order[] = [];

  public data: Order[] = [];

  public headers: PermitableTableHeader<OrderAbilities>[] = [
    {
      text: 'Order ID',
      value: 'id',
      width: 100,
    },
    {
      text: 'Site Name',
      value: 'bill_address.facility_name',
    },
    {
      text: 'Created At',
      value: 'created_at',
      width: 180,
    },
    {
      text: 'Updated At',
      value: 'updated_at',
      width: 180,
    },
    {
      text: 'Order Type',
      value: 'order_detail.priority',
      width: 120,
    },
    {
      text: 'Status',
      value: 'status',
      width: 80,
    },
    {
      text: 'PPE Status',
      value: 'status_part_a',
      width: 80,
      ability: ['manage_part_a', Order],
    },
    // {
    //   text: 'Part B Status',
    //   value: 'status_part_b',
    //   width: 80,
    //   ability: ['manage_part_b', Order],
    // },
    {
      text: 'N95 Status',
      value: 'status_part_c',
      width: 80,
      ability: ['manage_part_c', Order],
    },
    {
      text: 'Actions',
      value: 'actions',
      width: 200,
    },
  ];

  /**
   * Watcher for change in table filtering
   */
  @Watch('filterByPending')
  onFilterChange() {
    this.init();
  }

  created() {
    this.filterHeaders();
    this.init();
  }

  async init(): Promise<void> {
    this.loading.table = true;
    try {
      const data = await this.fetchData();
      const preparedData = prepareData(data, OrderService.mapData);
      const orders = preparedData.map((datum: any) => new Order(datum));
      this.data = orders;
    } catch (error) {
      Logger.error(error);
    } finally {
      this.loading.table = false;
    }
  }

  async fetchData(): Promise<any> {
    const orders = await this.orderService.api.find({
      authentication_token: this.userService.getActiveToken(),
    });
    if (!orders) throw Error('Unable to fetch a list of Orders');
    return orders;
  }

  /**
   * In the Orders visible in the table, select all that have
   * a `submitted` status, meaning they're awaiting to be reviewed
   */
  selectSubmitted(orders: Order[]) {
    this.selected = orders.filter((order) => order.status === OrderStatus.Submitted);
  }

  /**
   * Filter out any table headers this User cannot see or interact
   * with
   */
  filterHeaders() {
    this.headers = this.headers.filter((header) => {
      if (!header.ability) return true;
      return this.$ability.can(...header.ability);
    });
  }

  /**
   * Click handler for TableRowActions approve button
   */
  async onClickApprove(order: Order) {
    order.notes = await this.promptForOrderNotes();
    await this.approve(order);
    this.init();
  }

  /**
   * Click handler for TableRowActions deny button
   */
  async onClickDeny(order: Order) {
    order.notes = await this.promptForOrderNotes();
    await this.deny(order);
    this.init();
  }

  /**
   * Click handler for "Approve selected orders" button.
   *
   * Approves any selected orders that can be approved;
   * does nothing if no selected orders can be approved
   * (e.g. only approved/denied orders are selected).
   */
  async onClickApproveSelectedOrders() {
    const orders = this.selected.filter(order=> this.canUpdateStatus(order));
    if (orders.length) {
      const notes = await this.promptForOrderNotes();
      const approvals = orders.map((order) => this.approve({
        ...order,
        notes,
      } as Order));
      await Promise.all(approvals);
      this.init();
    }
    return;
  }
}
</script>

<style lang="scss">
.orders-list {
  &__row-controls {
    min-width: 8rem;
  }
}
</style>
