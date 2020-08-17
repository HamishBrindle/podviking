
<template>
  <div class="report order-summary">
    <v-data-table
      v-if="!loading"
      :headers="headers"
      :items="data"
      :search="search"
      :height="reportHeight"
      fixed-header
      disable-sort
      disable-pagination
      hide-default-footer
      hide-default-header
      dense
    >
      <template v-slot:header="{ props: { headers } }">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header.value"
            >
              <div :class="{ 'text-right': !['distribution_channel'].includes(header.value) }">
                {{ header.text }}
              </div>
            </th>
          </tr>
        </thead>
      </template>

      <template v-slot:body="{ items }">
        <tbody>
          <tr
            v-for="(item, i) in items"
            :key="item.distribution_channel"
            :class="{
              'yellow-lighten-5-bg-only': !$vuetify.theme.dark && i === items.length -1 ,
              'yellow-darken-3-bg-only': $vuetify.theme.dark && i === items.length -1,
              'font-weight-bold': i === items.length -1,
            }"
            @dblclick="viewDistChannelOrderSummary(item.distribution_channel)"
          >
            <td>{{ item.distribution_channel }}</td>
            <td class="text-right">
              {{ formatComma(item.count_rush_created) }}
            </td>
            <td class="text-right">
              {{ formatComma(item.count_standard_created) }}
            </td>
            <td class="text-right">
              {{ formatComma(item.count_orders_created) }}
            </td>
            <td class="text-right">
              {{ formatComma(item.count_rush_shipped) }}
            </td>
            <td class="text-right">
              {{ formatComma(item.count_standard_shipped) }}
            </td>
            <td class="text-right">
              {{ formatComma(item.count_orders_shipped) }}
            </td>
            <td class="text-right">
              {{ formatComma(item.count_orders_not_filled_100) }}
            </td>
            <td class="text-right">
              {{ formatComma(item.sla_met_rush) }}
            </td>
            <td class="text-right">
              {{ formatComma(item.sla_met_standard) }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import * as d3 from 'd3';
import reportDownloader from '@/lib/ReportDownloader';
import dateTimeRangeCalculator from '@/lib/DateTimeRangeCalculator';
import { ReportComponent, ReportAction } from './classes/ReportComponent';
import { DataTableHeader } from 'vuetify';
import { ReportService } from '@/services/ReportService';
import { UserService } from '@/services/UserService';
import { EnabledReportControls } from '../../../store/modules/reports';

@Component({
  name: 'OrderSummary',
})
export default class OrderSummary extends ReportComponent {
  private readonly reportService = ReportService.getInstance();

  private readonly userService = UserService.getInstance();

  private formatComma = d3.format(',');

  private headers: DataTableHeader[] = [
    {
      text: 'Distribution Channel',
      value: 'distribution_channel',
    },
    {
      text: 'Count Rush Created',
      value: 'count_rush_created',
    },
    {
      text: 'Count Standard Created',
      value: 'count_standard_created',
    },
    {
      text: 'Count Orders Created',
      value: 'count_orders_created',
    },
    {
      text: 'Count Rush Shipped',
      value: 'count_rush_shipped',
    },
    {
      text: 'Count Standard Shipped',
      value: 'count_standard_shipped',
    },
    {
      text: 'Count Orders Shipped',
      value: 'count_orders_shipped',
    },
    {
      text: 'Count Orders Not Filled 100',
      value: 'count_orders_not_filled_100',
    },
    {
      text: 'SLA MET Rush',
      value: 'sla_met_rush',
    },
    {
      text: 'SLA MET Standard',
      value: 'sla_met_standard',
    },
  ];

  protected data: any[] = [];

  public readonly enabledControls: EnabledReportControls = {
    search: true,
    dateTimeRange: true,
    distChannels: false,
    displayByContainers: false,
  }

  public readonly name = 'Order Summary';

  public readonly description = 'Summary of Order data organized by distribution channels. Double-click a row to see more...';

  public actions: ReportAction[] = [
    {
      label: 'Export as CSV',
      value: 'export_csv',
      icon: 'mdi-file-delimited',
    },
  ];

  created() {
    this.toggleControls();
  }

  mounted() {
    this.init();
  }

  public execute(command: string): void {
    if (command === 'export_csv') {
      return this.downloadCsvReport();
    }
  }

  protected async fetchData() {
    if (!this.dateTimeRange) throw Error('Unable to fetch data without `dateTimeRange`');
    const { startDateTime, endDateTime } = dateTimeRangeCalculator.calcDateTimeRange(this.dateTimeRange);
    return this.reportService.api.rushSummary({
      authentication_token: this.userService.getActiveToken(),
      report_params: {
        startDate: startDateTime,
        endDate: endDateTime,
      },
    });
  }

  /**
   * Callback for date-range watcher; reloads data from server
   * with new query parameters
   */
  @Watch('dateTimeRange')
  @Watch('displayByContainers')
  private async onControlChange() {
    this.$nextTick(() => this.init());
  }

  /**
   * Download CSV file of Report data
   */
  private downloadCsvReport() {
    if (!this.dateTimeRange) throw Error('Unable to download CSV without `dateTimeRange`');
    const dateRangeText = `${this.dateTimeRange.startDate} - ${this.dateTimeRange.endDate}`;
    const filename = `${this.name} [${dateRangeText}]`;
    const data = this.data.map((row) => [
      row.distribution_channel,
      row.count_rush_created,
      row.count_standard_created,
      row.count_orders_created,
      row.count_rush_shipped,
      row.count_standard_shipped,
      row.count_orders_shipped,
      row.count_orders_not_filled_100,
      row.sla_met_rush,
      row.sla_met_standard,
    ]);
    const headers = this.headers.map((head) => head.text);
    data.unshift(headers);
    reportDownloader.downloadCsv(filename, data);
  }

  async viewDistChannelOrderSummary(distChannel: string) {
    if (distChannel === 'All Channels') return;
    await this.$router.push({
      name: 'dist-channel-order-summary',
      query: {
        distChannel,
      },
    });
    this.$destroy();
  }
}
</script>

<style lang="scss">
@import '../../../assets/styles/scss/print-report.scss';

.order-summary {
  .yellow-lighten-5-bg-only {
    background-color: #fffde7;
  }
  .yellow-darken-3-bg-only {
    background-color: #f9a825;
  }
  .v-data-table > .v-data-table__wrapper > table > tbody > tr {
    &:hover {
      cursor: pointer;
    }
  }

}

@media print {
  // Remove search, filters, buttons from top of Report's card
  #podviking-dashboard > div > div.fluid-layout.fill-height > main > div > div > div > div > div.order-summary__card.px-4.py-4.v-card.v-sheet.v-sheet--outlined.theme--light.elevation-0 > div.v-card__actions {
    display: none;
  }
  // Remove the `height` restriction on the table
  #podviking-dashboard > div > div.fluid-layout.fill-height > main > div > div > div > div > div.order-summary__card.px-4.py-4.v-card.v-sheet.v-sheet--outlined.theme--light.elevation-0 > div.v-card__text > div.v-data-table.v-data-table--dense.v-data-table--fixed-header.theme--light > div {
    height: auto !important;
  }
}
</style>
