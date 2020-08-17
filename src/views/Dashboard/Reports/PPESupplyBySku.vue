<template>
  <div class="ppe-supply-by-sku__wrapper">
    <div class="ppe-supply-by-sku">
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
                    'text-right': !['category', 'subCategory', 'sku', 'description']
                      .includes(header.value),
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
              <td>{{ item.subCategory }}</td>
              <td>{{ item.sku }}</td>
              <td>{{ item.description }}</td>
              <td
                :class="{
                  'text-right font-weight-bold': true,
                  'red-lighten-4-bg-only red--text text--darken-4': ReportUtil.isZeroOrNegative(
                    item.peakCurrentInStock
                  ),
                }"
              >
                {{ formatComma(item.peakCurrentInStock) }}
              </td>
              <td class="text-right">
                {{ formatComma(item.averageDailyOrder) }}
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
import dateTimeRangeCalculator, { CalculatedDateTimeRange } from '@/lib/DateTimeRangeCalculator';
import { ReportComponent, ReportAction } from './classes/ReportComponent';
import { DataTableHeader } from 'vuetify';
import { UserService, ReportService } from '@/services';

let isAlternateCategory = false;

@Component({
  name: 'PPESupplyBySku',
})
export default class PPESupplyBySku extends ReportComponent {
  private readonly userService = UserService.getInstance();

  private readonly reportService = ReportService.getInstance();

  private calculatedDateTimeRange: CalculatedDateTimeRange | null = null;

  private rawData: any[] = [];

  private headers: DataTableHeader[] = [
    {
      text: 'Category',
      value: 'category',
    },
    {
      text: 'Sub-Category',
      value: 'subCategory',
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
      text: 'PEAK CURRENT IN STOCK',
      value: 'peakCurrentInStock',
    },
    {
      text: 'AVERAGE DAILY ORDER',
      value: 'averageDailyOrder',
    },
  ];

  private formatComma = d3.format(',');

  protected data: any[] = [];

  public readonly name: string = 'PPE Supply By SKU Report';

  public readonly description = 'Summary of the PPE Supplies being ordered and organized by SKU';

  public readonly enabledControls = {
    search: true,
    dateTimeRange: true,
    displayByContainers: true,
    distChannels: false,
  }

  public actions: ReportAction[] = [
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
    this.calculatedDateTimeRange = dateTimeRangeCalculator.calcDateTimeRange(this.dateTimeRange);
    this.toggleControls();
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
    this.calculatedDateTimeRange = dateTimeRangeCalculator.calcDateTimeRange(this.dateTimeRange);
    this.$nextTick(() => this.init());
  }

  protected async fetchData(): Promise<any> {
    if (!this.calculatedDateTimeRange) {
      throw Error('Unable to fetch Report data without calculated date-range');
    }
    const authenticationToken = this.userService.getActiveToken();
    const response = await this.reportService.api.ppeSupply({
      authentication_token: authenticationToken,
      report_params: {
        startDate: this.calculatedDateTimeRange.startDateTime,
        endDate: this.calculatedDateTimeRange.endDateTime,
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
    const data = this.data.map((row) => [
      row.category,
      row.subCategory,
      row.sku,
      row.description,
      row.peakCurrentInStock,
      row.averageDailyOrder,
    ]);
    const headers = this.headers.map((head) => head.text);
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
    const data = [headers].concat(this.rawData.map((row) => Object.values(row)));
    reportDownloader.downloadCsv(filename, data);
  }

  /**
   * Format Data
   */
  private formatData(data: any) {
    let nestedReportData;
    if (this.displayByContainers) {
      nestedReportData = d3
        .nest<any, any>()
        .key((d) => d.item_category)
        .key((d) => d.sku)
        .rollup((leaves) => ({
          subCategory: leaves[0].item_subcategory,
          description: leaves[0].description,
          peakCurrentInStock: d3.mean(leaves, (o) => parseInt(o.packs_on_hand_main, 10)),
          averageDailyOrder: d3.mean(leaves, (o) => parseInt(o.average_daily_shipment, 10)),
          minSkuPriority: d3.min(leaves, (o) => parseInt(o.sku_priority, 10)),
        }))
        .entries(data);
    } else {
      nestedReportData = d3
        .nest<any, any>()
        .key((d) => d.item_category)
        .key((d) => d.sku)
        .rollup((leaves) => ({
          subCategory: leaves[0].item_subcategory,
          description: leaves[0].description,
          peakCurrentInStock: d3.mean(leaves, (o) => (
            ReportUtil.calculateTotalUnits(o.packs_on_hand_main, o.unit_by_container)
          )),
          averageDailyOrder: d3.mean(leaves, (o) => (
            ReportUtil.calculateTotalUnits(o.average_daily_shipment, o.unit_by_container)
          )),
          minSkuPriority: d3.min(leaves, (o) => parseInt(o.sku_priority, 10)),
        }))
        .entries(data);
    }
    // sort category and skus based on ascending sku priority
    nestedReportData.sort((a, b) => d3.ascending(
      ReportUtil.getCategoryMinSkuPriority(a),
      ReportUtil.getCategoryMinSkuPriority(b),
    ));
    nestedReportData.forEach((sku) => {
      sku.values.sort((a: any, b: any) => d3.ascending(a.minSkuPriority, b.minSkuPriority));
    });
    // flatten report data for v-data-table component
    let flatReportData: any[] = [];
    nestedReportData.forEach((d) => {
      flatReportData = flatReportData.concat(
        d.values.map((o: any) => ({
          category: d.key.toString(),
          subCategory: o.value.subCategory.toString(),
          sku: o.key.toString(),
          description: o.value.description,
          peakCurrentInStock: o.value.peakCurrentInStock,
          averageDailyOrder: o.value.averageDailyOrder,
        })),
      );
    });

    const meanDailyOrder = d3.mean(flatReportData, (o) => o.averageDailyOrder);
    if (typeof meanDailyOrder !== 'number') {
      throw Error('Unable to calculate mean daily order');
    }

    flatReportData.push({
      category: 'Grand Total',
      subCategory: '',
      sku: '',
      description: '',
      peakCurrentInStock: d3.sum(flatReportData, (o) => o.peakCurrentInStock),
      averageDailyOrder: d3.format('.2f')(meanDailyOrder),
    });

    return flatReportData;
  }

  /**
   * Is current item a different cat
   */
  private alternateCategory(items: any[], i: number) {
    if (i !== 0 && items[i - 1].category !== items[i].category) {
      isAlternateCategory = !isAlternateCategory;
    }
    return isAlternateCategory;
  }
}
</script>

<style lang="scss">
.ppe-supply-by-sku {
  .red-lighten-4-bg-only {
    background-color: #FFCDD2;
  }
  .blue-lighten-5-bg-only {
    background-color: #E3F2FD;
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
}
</style>
