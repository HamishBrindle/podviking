<template>
  <div class="phsa-order-calculation__wrapper">
    <div class="phsa-order-calculation">
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
                <div
                  :class="{
                    'text-right': !['category', 'sku', 'description'].includes(header.value),
                    'phsa-order-calculation__color--calculated': header.calculated,
                    'phsa-order-calculation__color--phsa-order': header.value === 'phsaOrder',
                  }"
                >
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
              :key="item.sku"
              :class="{
                'blue-lighten-5-bg-only': !$vuetify.theme.dark
                  && alternateCategory(items, i) && i !== items.length - 1,
                'primary-darken-3-bg-only': $vuetify.theme.dark
                  && alternateCategory(items, i) && i !== items.length - 1,
                'yellow-lighten-5-bg-only': !$vuetify.theme.dark
                  && i === items.length - 1,
                'yellow-darken-3-bg-only': $vuetify.theme.dark
                  && i === items.length - 1,
                'font-weight-bold': i === items.length - 1,
              }"
            >
              <td>
                <span
                  v-if="i === 0 || items[i - 1].category !== item.category"
                  class="font-weight-bold"
                >{{ item.category }}</span>
              </td>
              <td>{{ item.sku }}</td>
              <td>{{ item.description }}</td>
              <td class="text-right">
                {{ formatComma(item.currentStock) }}
              </td>
              <td class="text-right">
                {{ formatComma(item.backOrder) }}
              </td>
              <td class="text-right">
                {{ formatComma(item.totalShipped) }}
              </td>
              <td
                class="text-right phsa-order-calculation__color--calculated"
              >
                {{ formatComma(item.averageDailyShippedx2) }}
              </td>
              <td
                class="text-right phsa-order-calculation__color--calculated"
              >
                {{ formatComma(item.estimatedPhsaOrder) }}
              </td>
              <td
                class="text-right phsa-order-calculation__color--phsa-order"
              >
                {{ formatComma(item.phsaOrder) }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import * as d3 from 'd3';
import ReportUtil from '@/lib/ReportUtil';
import reportDownloader from '@/lib/ReportDownloader';
import dateTimeRangeCalculator from '@/lib/DateTimeRangeCalculator';
import { ReportComponent } from './classes/ReportComponent';
import { CalculatedDateTimeRange } from '../../../lib/types';
import { ReportService, UserService } from '@/services';
import { DataTableHeader } from 'vuetify';

let isAlternateCategory = false;

@Component({
  name: 'PHSAOrderCalculation',
})
export default class PHSAOrderCalculation extends ReportComponent {
  private readonly reportService = ReportService.getInstance();

  private readonly userService = UserService.getInstance();

  private calculatedDateTimeRange: CalculatedDateTimeRange | null = null;

  private headers: (DataTableHeader & { calculated?: boolean })[] = [
    {
      text: 'Category',
      value: 'category',
    },
    {
      text: 'SKU',
      value: 'sku',
    },
    {
      text: 'Description',
      value: 'description',
    },
    {
      text: 'Current Stock',
      value: 'currentStock',
    },
    {
      text: 'Back order',
      value: 'backOrder',
    },
    {
      text: 'Sum of shipped',
      value: 'totalShipped',
    },
    {
      text: 'Min on hand (2 days)',
      value: 'averageDailyShippedx2',
      calculated: true,
    },
    {
      text: 'Est PHSA order',
      value: 'estimatedPhsaOrder',
      calculated: true,
    },
    {
      text: 'PHSA order',
      value: 'phsaOrder',
    },
  ];

  private formatComma = d3.format(',');

  private rawData: any[] = [];

  protected data: any[] = [];

  public readonly name = 'PHSA Order Calculation Report';

  public readonly description = 'Summary of Provincial Health Services Authority order data';

  public readonly enabledControls = {
    search: true,
    dateTimeRange: true,
    distChannels: false,
    displayByContainers: true,
  };

  public actions = [
    {
      label: 'Export as CSV',
      value: 'export_csv',
      icon: 'mdi-file-delimited',
    },
    {
      label: 'Export Raw Data',
      value: 'export_raw_data',
      icon: 'mdi-download',
    },
  ];

  beforeCreate() {
    this.ReportUtil = ReportUtil;
  }

  created() {
    this.toggleControls();
    this.calculatedDateTimeRange = dateTimeRangeCalculator.calcDateTimeRange(this.dateTimeRange);
  }

  mounted() {
    this.init();
  }

  beforeUpdate() {
    isAlternateCategory = false;
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

  protected async fetchData(): Promise<any> {
    const authenticationToken = this.userService.getActiveToken();
    const response = await this.reportService.api.ppeSupply({
      authentication_token: authenticationToken,
      report_params: {
        startDate: this.calculatedDateTimeRange?.startDateTime,
        endDate: this.calculatedDateTimeRange?.endDateTime,
      },
    });
    this.rawData = response;
    return this.formatData(response);
  }

  public execute(command: string): void {
    if (command === 'export_csv') {
      this.downloadCsvReport();
      return;
    }
    if (command === 'export_raw_data') {
      this.downloadCsvRawData();
    }
  }

  /**
   * Download Csv Report
   */
  private downloadCsvReport() {
    const { startDate, endDate } = this.dateTimeRange;
    const filename = `${this.name} [${startDate} - ${endDate}]`;
    const data = this.data.map((row: any) => [
      row.category,
      row.sku,
      row.description,
      row.currentStock,
      row.backOrder,
      row.totalShipped,
      row.averageDailyShippedx2,
      row.estimatedPhsaOrder,
      row.phsaOrder,
    ]);
    const headers = this.headers.map(head => head.text);
    data.unshift(headers);
    reportDownloader.downloadCsv(filename, data);
  }

  /**
   * Download Csv Raw Data
   */
  private downloadCsvRawData() {
    const { startDate, endDate } = this.dateTimeRange;
    const filename = `${this.name} [${startDate} - ${endDate}] (raw)`;
    const headers = Object.keys(this.rawData[0]);
    const data = [headers].concat(this.rawData.map(row => Object.values(row)));
    reportDownloader.downloadCsv(filename, data);
  }

  /**
   * Format Data
   */
  private formatData(data: any) {
    if (!this.calculatedDateTimeRange) {
      throw Error('Unable to format data with calculated date-range');
    }

    const { totalDays } = this.calculatedDateTimeRange;

    // group data
    let nestedReportData;
    if (this.displayByContainers) {
      nestedReportData = d3
        .nest()
        .key((d: any) => d.item_category)
        .key((d: any) => d.sku)
        .rollup((leaves: any) => ({
          description: leaves[0].description,
          currentStock: d3.mean(leaves, (o: any) =>
            parseInt(o.packs_on_hand_main, 10),
          ),
          backOrder: d3.mean(leaves, (o: any) => parseInt(o.back_ordered_packs, 10)),
          totalShipped: d3.mean(leaves, (o: any) =>
            parseInt(o.packs_shipped_main, 10),
          ),
          averageDailyShipped: d3.mean(leaves, (o: any) => {
            const amount = String((1.0 * o.packs_shipped_main) / totalDays);
            return parseInt(amount, 10);
          }),
          minSkuPriority: d3.min(leaves, (o: any) => parseInt(o.sku_priority, 10)),
        }) as any)
        .entries(data);
    } else {
      nestedReportData = d3
        .nest()
        .key((d: any) => d.item_category)
        .key((d: any) => d.sku)
        .rollup((leaves: any) => ({
          description: leaves[0].description,
          currentStock: d3.mean(leaves, (o: any) =>
            ReportUtil.calculateTotalUnits(
              o.packs_on_hand_main,
              o.unit_by_container,
            ),
          ),
          backOrder: d3.mean(leaves, (o: any) =>
            ReportUtil.calculateTotalUnits(
              o.back_ordered_packs,
              o.unit_by_container,
            ),
          ),
          totalShipped: d3.mean(leaves, (o: any) =>
            ReportUtil.calculateTotalUnits(
              o.packs_shipped_main,
              o.unit_by_container,
            ),
          ),
          averageDailyShipped: d3.mean(leaves, (o: any) =>
            ReportUtil.calculateTotalUnits(
              (1.0 * o.packs_shipped_main) / totalDays,
              o.unit_by_container,
            ),
          ),
          minSkuPriority: d3.min(leaves, (o: any) => parseInt(o.sku_priority, 10)),
        }) as any)
        .entries(data);
    }
    // sort category and skus based on ascending sku priority
    nestedReportData.sort((a, b) =>
      d3.ascending(
        ReportUtil.getCategoryMinSkuPriority(a),
        ReportUtil.getCategoryMinSkuPriority(b),
      ),
    );
    nestedReportData.forEach(sku => {
      sku.values.sort((a: any, b: any) =>
        d3.ascending(a.minSkuPriority, b.minSkuPriority),
      );
    });
    // flatten report data for v-data-table component
    let flatReportData: any[] = [];
    nestedReportData.forEach((d: any) => {
      flatReportData = flatReportData.concat(
        d.values.map((o: any) => ({
          category: d.key.toString(),
          sku: o.key.toString(),
          description: o.value.description,
          currentStock: o.value.currentStock,
          backOrder: o.value.backOrder,
          totalShipped: o.value.totalShipped,
          averageDailyShippedx2: o.value.averageDailyShipped * 2,
          estimatedPhsaOrder:
            o.value.currentStock - o.value.averageDailyShipped * 6,
          phsaOrder: this.calculatePhsaOrder(
            o.value.currentStock - o.value.averageDailyShipped * 6,
          ),
        })),
      );
    });
    // grand total
    flatReportData.push({
      category: 'Grand Total',
      sku: '',
      description: '',
      currentStock: d3.sum(flatReportData, o => o.currentStock),
      backOrder: d3.sum(flatReportData, o => o.backOrder),
      totalShipped: d3.sum(flatReportData, o => o.totalShipped),
      averageDailyShippedx2: d3.sum(
        flatReportData,
        o => o.averageDailyShippedx2,
      ),
      estimatedPhsaOrder: d3.sum(flatReportData, o => o.estimatedPhsaOrder),
      phsaOrder: d3.sum(flatReportData, o => o.phsaOrder),
    });
    return flatReportData;
  }

  /**
   * Alternate Category
   */
  private alternateCategory(items: any[], i: number) {
    if (i !== 0 && items[i - 1].category !== items[i].category) {
      isAlternateCategory = !isAlternateCategory;
    }
    return isAlternateCategory;
  }

  /**
   * On Display Type Change
   */
  private onDisplayTypeChange() {
    this.data = this.formatData(this.rawData);
  }

  /**
   * Calculate column PHSA order.
   * @param {number} estimatedPhsaOrder
   * @return {number | string} number or empty string
   */
  private calculatePhsaOrder(estimatedPhsaOrder: number) {
    return estimatedPhsaOrder < 0 ? Math.abs(estimatedPhsaOrder) : '';
  }
}
</script>

<style lang="scss">
.phsa-order-calculation {
  &__color--calculated {
    color: #0077b2;
  }
  &__color--phsa-order {
    color: #f44336;
  }
  .blue-lighten-5-bg-only {
    background-color: #e3f2fd;
  }
  .yellow-lighten-5-bg-only {
    background-color: #fffde7;
  }
  .primary-darken-3-bg-only {
    background-color: #003164;
  }
  .yellow-darken-3-bg-only {
    background-color: #f9a825;
  }
  .category-highlight > td {
    border-color: grey !important;
  }
}
</style>
