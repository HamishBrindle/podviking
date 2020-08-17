<template>
  <div class="timeline-item">
    <v-list-group
      v-model="active"
      no-action
    >
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title
            v-for="action in actions"
            :key="action"
            class="d-flex flex-row align-center"
          >
            <v-icon class="flex-1">
              {{ getIcon(action) }}
            </v-icon>
            <span class="pl-4">{{ getAction(action) }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </template>

      <!-- Date -->
      <template v-if="date">
        <v-list-item>
          <v-list-item-icon>
            <v-icon v-text="date.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="date.label" />
            <v-list-item-subtitle v-text="date.value" />
          </v-list-item-content>
        </v-list-item>
      </template>

      <!-- Notes -->
      <template v-if="comment">
        <v-list-item>
          <v-list-item-icon>
            <v-icon v-text="comment.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="comment.label" />
            <span
              class="text--secondary body-2"
              v-text="comment.value"
            />
          </v-list-item-content>
        </v-list-item>
      </template>

      <!-- Approvals -->
      <template v-if="approvals">
        <v-list-item>
          <v-list-item-icon>
            <v-icon v-text="approvals.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              class="mb-2"
              v-text="approvals.label"
            />
            <v-list-item-subtitle
              v-for="([section, status]) in approvals.value"
              :key="section"
              class="d-flex align-end justify-space-between"
            >
              <approval-status-indicator
                :status="status"
              >
                <template slot="append">
                  <span class="px-2 font-weight-bold">{{ getSection(section) }}</span>
                </template>
              </approval-status-indicator>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list-group>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { OrderApprovals } from '@/models/Order';
import ApprovalStatusIndicator from '@/components/StatusIndicator/ApprovalStatusIndicator.vue';
import util from '@/tools/Utilities';

/**
 * Contract for what the OrdersTimelineItem component expects
 */
export interface IOrdersTimelineItem {
  action: string | string[];
  approvals: OrderApprovals;
  date: string;
  note: string;
}

@Component({
  name: 'OrdersTimelineItem',
  components: {
    ApprovalStatusIndicator,
  },
})
export default class OrdersTimelineItem extends Vue {
  @Prop({ required: true })
  item!: IOrdersTimelineItem;

  @Prop({ required: false, default: () => ({}) })
  approval!: any;

  /**
   * Item is expanded
   */
  active = false;

  private get actions() {
    if (Array.isArray(this.item.action))
      return this.item.action;
    return [this.item.action];
  }

  private get date() {
    if (!this.item.date) return null;
    return {
      label: 'Date',
      value: util.formatDate(this.item.date, true),
      icon: 'mdi-calendar',
    };
  }

  private get comment() {
    if (!this.item.note) return null;
    return {
      label: 'Comment',
      value: this.item.note, // note == comment in this sense
      icon: 'mdi-clipboard',
    };
  }

  private get approvals() {
    if (!this.item.approvals) return null;
    return {
      label: 'Approvals',
      value: Object.entries(this.item.approvals),
      icon: 'mdi-order-bool-descending',
    };
  }

  getIcon(action: string) {
    switch (action) {
    case 'create':
      return 'mdi-timeline-plus';
    case 'update':
      return 'mdi-timeline-text';
    case 'review':
    case 'approve':
      return 'mdi-timeline-check';
    case 'deny':
      return 'mdi-timeline-remove';
    case 'finalize':
      return 'mdi-timeline-alert';
    case 'send_part_a':
    case 'send_part_c':
      return 'mdi-timeline-check-outline';
    case 'reject_part_a':
    case 'reject_part_c':
      return 'mdi-timeline-remove-outline';
    default:
      return 'mdi-timeline';
    }
  }

  getAction(action: string) {
    switch (action) {
    case 'create':
      return 'Create';
    case 'update':
      return 'Update';
    case 'review':
      return 'Review Submission';
    case 'approve':
      return 'Approve Submission';
    case 'deny':
      return 'Deny Submission';
    case 'finalize':
      return 'Finalize';
    case 'send_part_a':
      return 'Send PPE Order to Warehouse';
    case 'send_part_c':
      return 'Send N95 Order to Warehouse';
    case 'reject_part_a':
      return 'Reject PPE Supplies Order';
    case 'reject_part_c':
      return 'Reject N95 Masks Order';
    default:
      throw Error('Unknown action');
    }
  }

  getSection(section: string) {
    switch (section) {
    case 'info':
      return 'Site Info';
    case 'part_a':
      return 'PPE Status';
    // case 'part_b':
    //   return 'Swabs';
    case 'part_c':
      return 'N95 Masks';
    default:
      throw Error('Unknown section');
    }
  }
}
</script>

<style lang="scss">
.timeline-item {
  & > .v-list-group > .v-list-group__items > .v-list-item {
    padding-left: 2rem;
  }
}
</style>
