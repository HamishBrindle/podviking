<template>
  <div class="report-container__wrapper">
    <div class="report-container">
      <v-card
        class="px-4 py-4"
        elevation="0"
        outlined
      >
        <div ref="header">
          <v-fade-transition
            group
            leave-absolute
          >
            <div key="name-description">
              <v-card-title>
                <span class="display-1 font-weight-light">{{ reportName }}</span>
              </v-card-title>

              <v-card-text>
                <span class="body-1 grey--text text--darken-1">{{ reportDescription }}</span>
              </v-card-text>
            </div>
            <v-progress-circular
              v-if="!reportName || !reportDescription"
              key="loader"
              indeterminate
              color="primary"
            />
          </v-fade-transition>
        </div>
        <!-- Report Actions -->
        <v-card-actions class="my-0">
          <report-controls
            ref="controls"
            :actions="reportActions"
            @on-reload="onReload"
            @on-action="onAction"
          />
        </v-card-actions>

        <v-skeleton-loader
          v-show="loading"
          key="loader"
          type="table-tbody"
          width="100%"
          :height="reportHeight"
        />

        <div v-show="!loading">
          <slot />
        </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { Get, Sync } from 'vuex-pathify';
import ReportControls from './ReportControls.vue';
import { ReportAction } from '../classes/ReportComponent';

@Component({
  name: 'ReportContainer',
  components: {
    ReportControls,
  },
})
export default class ReportContainer extends Vue {
  @Ref('header')
  private readonly headerRef!: HTMLElement;

  @Ref('controls')
  private readonly controlsRef!: Vue;

  @Get('reports/loading')
  private loading!: boolean;

  @Get('layout/totalHeight')
  private totalHeight!: number;

  @Get('layout/appBarHeight')
  private appBarHeight!: number;

  @Sync('layout/reportHeight')
  private reportHeight!: number;

  @Prop({ required: true, default: '[Report Name]' })
  private reportName!: string;

  @Prop({ required: true, default: '[Report Description]' })
  private reportDescription!: string;

  @Prop({ required: false, default: null })
  private reportActions!: ReportAction[];

  beforeUpdate() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  destroyed() {
    window.removeEventListener('resize', this.onResize);
  }

  /**
   * Calculate the height of the Report we want to render
   */
  calculateReportHeight(offset: number): number {
    const headerHeight = this.headerRef.getBoundingClientRect().height;
    const controlsHeight = this.controlsRef.$el.getBoundingClientRect().height;
    return this.totalHeight - this.appBarHeight - headerHeight - controlsHeight - offset;
  }

  setReportHeight(height: number) {
    this.$nextTick(() => {
      this.reportHeight = this.calculateReportHeight(height);
    });
  }

  onResize() {
    this.setReportHeight(110);
  }

  onReload() {
    this.$emit('on-reload');
  }

  onAction(action: string) {
    this.$emit('on-action', action);
  }
}
</script>

<style lang="scss">
.report-container {
  height: inherit;
  &__wrapper {
    height: 100%;
  }
}

@media print {
  .report-container {
    height: inherit;
    &__wrapper {
      height: 100%;
    }
    &__header-wrapper {
      display: none;
    }
  }
}
</style>
