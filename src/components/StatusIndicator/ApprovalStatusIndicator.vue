<template>
  <span class="approval-status-indicator d-flex align-center">
    <div
      v-if="$slots.prepend"
      class="approval-status-indicator__prepend pr-2 body-2"
    >
      <slot name="prepend" />
    </div>
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-icon
          :class="getClassObject(status)"
          v-on="on"
        >
          {{ getIcon(status) }}
        </v-icon>
      </template>
      <span>{{ (!empty) ? formatStatus(status) : emptyStatus }}</span>
    </v-tooltip>

    <div
      v-if="$slots.append"
      class="approval-status-indicator__append pl-2 body-2"
    >
      <slot name="append" />
    </div>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ApprovalStatus } from '@/lib/enum';
import util from '@/tools/Utilities';

@Component({
  name: 'ApprovalStatusIndicator',
})
export default class ApprovalStatusIndicator extends Vue {
  /**
   * Status used to render status indicator
   */
  @Prop({ required: true, default: ApprovalStatus.Pending })
  private readonly status!: ApprovalStatus;

  /**
   * Status used to render status indicator
   */
  @Prop({ required: false, default: false })
  private readonly empty!: boolean;

  /**
   * Indicator-text for an Order without items in a particular
   * section
   */
  private readonly emptyStatus = 'N/A';

  /**
   * Get class-name of the status indicator based on status
   */
  private getClassObject(status: ApprovalStatus) {
    if (this.empty) return { 'grey--text text--lighten-2': true };
    return {
      'text--darken-2': true,
      'yellow--text': status === ApprovalStatus.Pending,
      'cyan--text': status === ApprovalStatus.Reviewed,
      'green--text': !status || status === ApprovalStatus.Approved,
      'red--text': status === ApprovalStatus.Denied,
    };
  }

  /**
   * Get the icon related to the Order's status
   */
  private getIcon(status: ApprovalStatus) {
    if (this.empty) return 'mdi-circle-off-outline';
    if (!status) return 'mdi-check-circle';
    switch (status) {
    case ApprovalStatus.Pending:return 'mdi-alpha-p-circle';
    case ApprovalStatus.Reviewed: return 'mdi-alpha-r-circle';
    case ApprovalStatus.Approved: return 'mdi-check-circle';
    case ApprovalStatus.Denied: return 'mdi-close-circle';
    default: return 'mdi-checkbox-blank-circle';
    }
  }

  /**
   * Format status label for the status indicator's tooltip
   */
  private formatStatus(status: string) {
    if (!status) {
      return util.titleCase(ApprovalStatus.Approved);
    }
    return util.titleCase(status);
  }
}
</script>

<style lang="scss">
.approval-status-indicator {
  display: flex;
}
</style>
