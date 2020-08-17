<template>
  <div class="orders">
    <v-row justify="center">
      <v-col
        xl="6"
        lg="8"
        md="10"
        sm="12"
      >
        <v-alert
          ref="alert"
          v-model="alert.show"
          :type="alert.type"
          transition="scale-transition"
          prominent
          dismissible
        >
          <div
            v-for="message in alert.messages"
            :key="message"
          >
            {{ message }}
          </div>
        </v-alert>
      </v-col>
    </v-row>
    <router-view
      :can-create="canCreate"
      :can-read="canRead"
      :can-update="canUpdate"
      :can-update-status="canUpdateStatus"
      :edit="edit"
      :view="view"
      :save="save"
      :approve="approve"
      :deny="deny"
      :prompt-for-order-notes="promptForOrderNotes"
      :show-alert="showAlert"
      :reset-alert="resetAlert"
      :get-sections="getSections"
      :validate-items="validateItems"
      :has-items="hasItems"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import { Sync } from 'vuex-pathify';
import { Logger } from '@/tools';
import { ApprovalStatus } from '@/lib/enum/Status.enum';
import { LazyPromise } from '@/lib/LazyPromise';
import { Order, Sku } from '@/models/internal';
import { OrderService, UserService } from '@/services';
import CommentCreateDialog from '@/views/Dashboard/Comments/components/CommentCreateDialog.vue';
import { VueConstructor } from 'vue/types';
import { InstanceOf } from '@/lib/types';
import { IAlert } from '@/lib/interfaces/Alert.interface';

export type CanUpdateStatusActions = 'review'|'approve'|'approve_part_a'|'approve_part_c';

@Component({
  name: 'Orders',
})
export default class Orders extends Vue {

  @Ref('alert')
  readonly alertRef!: InstanceOf<VueConstructor<Vue>>;

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

  /**
   * Alert object responsible for rendering the alert component
   */
  private alert: IAlert = {
    type: 'info',
    show: false,
    messages: [],
  }

  /**
   * Navigate to the Order edit form
   */
  edit(order: Order) {
    this.$router.push({
      name: 'orders-edit',
      params: {
        id: String(order.id),
      },
    });
  }

  /**
   * Navigate to a static summary of the Order
   */
  view(order: Order): void {
    this.$router.push({
      name: 'orders-view',
      params: {
        id: String(order.id),
      },
    });
  }

  /**
   * Check if User can create a new Order
   */
  canCreate() {
    return this.$ability.can('create', Order);
  }

  /**
   * Check if User can view an Order
   */
  canRead() {
    return this.$ability.can('read', Order);
  }

  /**
   * User can update a Order record
   */
  private canUpdate(order: Order): boolean {
    if (order?.id) {
      return this.$ability.can('update', order);
    }
    return false;
  }

  /**
   * Check if this user has permission to an approval action.
   * If no action is specified, checks all approval actions.
   *
   * @param {string} [action]  Which form action they can perform
   * @returns {boolean} Can approve one or any action
   */
  canUpdateStatus(
    order: Order,
    action?: CanUpdateStatusActions,
  ) {
    if (order?.id) {
      if (action) {
        return this.$ability.can(action, order);
      }
      return (
        this.$ability.can('review', order)
        || this.$ability.can('approve', order)
        || this.$ability.can('approve_part_a', order)
        // || this.$ability.can('approve_part_b', order)
        || this.$ability.can('approve_part_c', order)
      );
    }
    return false;
  }

  /**
   * Approve order
   * @return {Promise<boolean>} form was updated
   */
  async approve(order: Order) {
    if (this.$ability.can('review', order)) {
      order.approvals.info = ApprovalStatus.Reviewed;
    }
    if (this.$ability.can('approve', order)) {
      order.approvals.info = ApprovalStatus.Approved;
    }
    if (this.hasItems('part_a', order) &&
        this.$ability.can('approve_part_a', order)) {
      order.approvals.part_a = ApprovalStatus.Approved;
    }
    // if (this.$ability.can('approve_part_b', order)) {
    //   order.approvals.part_b = ApprovalStatus.Approved;
    // }
    if (this.hasItems('part_c', order) &&
        this.$ability.can('approve_part_c', order)) {
      order.approvals.part_c = ApprovalStatus.Approved;
    }
    return this.save(order);
  }

  /**
   * Deny order
   * @return {Promise<boolean>} form was updated
   */
  async deny(order: Order) {
    if (this.$ability.can('review', order)) {
      order.approvals.info = ApprovalStatus.Denied;
    }
    if (this.$ability.can('approve', order)) {
      order.approvals.info = ApprovalStatus.Denied;
    }
    if (this.hasItems('part_a', order) &&
        this.$ability.can('approve_part_a', order)) {
      order.approvals.part_a = ApprovalStatus.Denied;
    }
    // if (this.$ability.can('approve_part_b', order)) {
    //   order.approvals.part_b = ApprovalStatus.Denied;
    // }
    if (this.hasItems('part_c', order) &&
        this.$ability.can('approve_part_c', order)) {
      order.approvals.part_c = ApprovalStatus.Denied;
    }
    return this.save(order);
  }

  /**
   * Display a confirmation dialog modal and allow for input
   * of notes before submitting to server
   */
  async showConfirmationModal(): Promise<any> {
    const lazyPromise = new LazyPromise();
    const instance = new CommentCreateDialog({
      parent: this,
      propsData: {
        promise: lazyPromise,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      },
    });
    instance.$mount();
    return await lazyPromise;
  }

  /**
   * Prompts the user for order comments
   */
  async promptForOrderNotes(): Promise<string> {
    const { comment } = await this.showConfirmationModal();
    return comment;
  }

  /**
   * Save Order changes to the server
   */
  async save(order: Order): Promise<any> {
    this.resetAlert();

    const isValid = await this.validateItems(order.order_items);
    if (!isValid) return;

    const token = this.userService.getActiveToken();
    if (!token) throw Error('Unable to get token from active User');

    try {
      this.isOverlayVisible = true;

      order.order_detail.date = new Date().toISOString();

      const params = {
        id: order.id,
        authentication_token: token,
        draft_order: order,
      };
      // remove previous form states to reduece request payload size
      delete params.draft_order.previous_form_states;
      const { data } = await this.orderService.api.update(params);
      const response = await this.orderService.insert({
        data: data.draft_order,
        insertOrUpdate: ['users'],
      });
      return response;
    } catch (error) {
      Logger.error(error);
      this.showAlert('error', [`Sorry, there was an error while saving order #${order.id}`]);
    } finally {
      this.isOverlayVisible = false;
    }
  }

  /**
   * Show an alert by affecting the alert object that is
   * bound to the alert component
   */
  showAlert(
    type: 'info' | 'success' | 'error' | 'warning',
    messages: string[],
  ): void {
    this.alert.messages = messages;
    this.alert.type = type;
    this.alert.show = true;

    // Scroll to our alert
    this.$nextTick(() => {
      const { documentElement } = document;
      const { left, top } = this.alertRef.$el.getBoundingClientRect();
      const height = 100;
      window.scrollTo(
        left + (window.pageXOffset || documentElement.scrollLeft || 0),
        top + (window.pageYOffset || documentElement.scrollTop || 0) - height,
      );
    });
  }

  /**
   * Hide an alert by affecting the alert object that is
   * bound to the alert component
   */
  resetAlert(): void {
    this.alert.show = false;
    this.alert.messages = [];
  }

  /**
   * Validate order items to ensure quantities are valid
   */
  async validateItems(items: Sku[]): Promise<boolean> {
    let valid = true;
    const messages = [];
    const quantities = items.map((item) => item.quantity);

    // Check for empty quantities
    const isEmpty = quantities.every((quantity) => quantity <= 0);
    if (isEmpty) {
      messages.push('Unable to place an Order without at quantities least one item');
      valid = false;
    }

    // Check for negative quantities
    const hasNegative = quantities.some((quantity) => quantity < 0);
    if (hasNegative) {
      messages.push('Unable to place an Order with negative quantities in any items');
      valid = false;
    }

    if (!valid) {
      this.showAlert('error', messages);
      await this.$vuetify.goTo(this.alertRef, {
        easing: 'easeInOutQuint',
      });
    }
    return valid;
  }

  /**
   * Get the authorized sections of the form
   */
  getSections(order: Order) {
    const hiddenSections = [];
    const canManagePartA = this.$ability.can('manage_part_a', order);
    // const canManagePartB = this.$ability.can('manage_part_b', order);
    const canManagePartC = this.$ability.can('manage_part_c', order);
    if (!canManagePartA) hiddenSections.push('part_a');
    // if (!canManagePartB) hiddenSections.push('part_b');
    if (!canManagePartC) hiddenSections.push('part_c');
    return hiddenSections;
  }

  /**
   * Check if an Order has an item-count in a given section.
   */
  hasItems(section: 'part_a'|'part_c', order: Order) {
    const [s] = order.section_counts.filter((sc) => sc.name === section);
    return s?.total_units > 0;
  }
}

</script>
