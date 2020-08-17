<template>
  <div class="reports__wrapper">
    <div class="reports">
      <report-container
        :report-name="reportName"
        :report-description="reportDescription"
        :report-actions="reportActions"
        @on-action="onAction"
        @on-reload="onReload"
      >
        <router-view
          ref="report"
          :height="reportHeight"
          @setup="onReportSetup"
        />
      </report-container>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator';
import ReportContainer from './components/ReportContainer.vue';
import { Get } from 'vuex-pathify';
import { IReportsState } from '@/store/modules/reports';
import { ReportComponent, ReportAction } from './classes/ReportComponent';

@Component({
  name: 'Reports',
  components: {
    ReportContainer,
  },
})
export default class Reports extends Vue {
  @Ref('report')
  private readonly reportRef!: ReportComponent;

  @Get('reports/loading')
  private loading!: IReportsState['loading'];

  @Get('layout/reportHeight')
  private reportHeight!: number;

  /**
   * Name of the `ReportComponent` via the `<router-view>`
   */
  private reportName = '';

  /**
   * Brief description of the current report
   */
  private reportDescription = '';

  /**
   * Report action(s) in the `ReportControls` component's
   * overflow-menu.
   */
  private reportActions: ReportAction[] = [];

  /**
   * Reset some of the Report data used in `ReportsContainer` when
   * the route changes to avoid stale data from rendering confusing
   * UI elements (wrong title & description, etc.)
   */
  @Watch('$route', { deep: true })
  private onRouteChange() {
    this.reportName = '';
    this.reportDescription = '';
    this.reportActions = [];
  }

  /**
   * Callback for `ReportComponent` setup data bubbling up
   * through the `router-view`
   */
  private onReportSetup(data: any) {
    if (data.name) this.reportName = data.name;
    if (data.name) this.reportDescription = data.description;
    if (data.actions) this.reportActions = data.actions;
  }

  /**
   * Callback to send an action (or command) to be executed in the
   * implementation of `ReportComponent`
   */
  private onAction(action: string) {
    this.reportRef.execute(action);
  }

  /**
   * Callback to reload the data in the Report
   */
  private onReload() {
    this.reportRef.reload();
  }
}
</script>

<style lang="scss">
.reports {
  height: inherit;
  &__wrapper {
    height: 100%;
  }
}
</style>
