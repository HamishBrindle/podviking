<template>
  <div class="orders-form-controls">
    <template v-show="!loading">
      <slot />
    </template>

    <!-- Form Actions -->
    <v-speed-dial
      v-if="hasActions"
      v-model="isOpen"
      bottom
      right
      fixed
      class="orders-form-controls__speed-dial mb-8"
      direction="top"
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn
          v-model="isOpen"
          color="accent"
          :loading="loading"
          large
        >
          <span>Form Actions</span>
        </v-btn>
      </template>

      <!-- Save/Update Button -->
      <template v-if="showUpdate">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              dark
              small
              color="primary"
              @click="save"
              v-on="on"
            >
              <v-icon>mdi-content-save-outline</v-icon>
            </v-btn>
          </template>
          <span>Save Order</span>
        </v-tooltip>
      </template>

      <!-- Update Status Buttons (Approve, Deny) -->
      <template v-if="showUpdateStatus">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              dark
              small
              color="success"
              @click="approve"
              v-on="on"
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </template>
          <span>Approve Order</span>
        </v-tooltip>

        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              dark
              small
              color="error"
              @click="deny"
              v-on="on"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Deny Order</span>
        </v-tooltip>
      </template>
    </v-speed-dial>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'OrdersFormControls',
})
export default class OrdersFormControls extends Vue {
  @Prop({ required: false, default: false })
  private showCreate!: boolean;

  @Prop({ required: false, default: false })
  private showUpdateStatus!: boolean;

  @Prop({ required: false, default: false })
  private showRead!: boolean;

  @Prop({ required: false, default: false })
  private showUpdate!: boolean;

  @Prop({ required: false, default: false })
  private loading!: boolean;

  private isOpen = false;

  /**
   * There are available actions for these controls
   */
  private get hasActions() {
    return this.showCreate
      || this.showUpdateStatus
      || this.showRead
      || this.showUpdate;
  }

  private save(): void {
    this.$emit('save', undefined);
  }

  private approve(): void {
    this.$emit('approve', undefined);
  }

  private deny(): void {
    this.$emit('deny', undefined);
  }
}
</script>

<style lang="scss">
.orders-form-controls {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;

  &__speed-dial {
    z-index: inherit !important;
  }

  // First set of controls at the top of the page
  &:first-of-type {
    margin-bottom: 2em;
  }

  // Second set of controls at the bottom
  &:last-of-type {
    margin-top: 4em;
  }

  & > *:not(:last-child) {
    margin-right: 1em;
  }
}
</style>
