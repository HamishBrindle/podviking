<template>
  <div class="ppe-supply-by-category__wrapper">
    <div class="ppe-supply-by-category">
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
                    'text-right': !['category', 'subCategory'].includes(header.value),
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
                'font-weight-bold category-highlight': !item.subCategory,
              }"
            >
              <td>
                <span v-if="!item.subCategory">{{ item.category }}</span>
              </td>
              <td>{{ item.subCategory }}</td>
              <td class="text-right">
                {{ formatComma(item.peakOnOrder) }}
              </td>
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
              <!-- <td class="text-right">
                    {{ formatComma(item.directCurrentInStock) }}
                  </td> -->
              <td class="text-right">
                {{ formatComma(item.averageDailyOrder) }}
              </td>
              <td class="text-right">
                {{ formatComma(item.onOrder) }}
              </td>
              <td class="text-right">
                {{ formatComma(item.backOrder) }}
              </td>
              <td class="text-right">
                {{ formatComma(item.shipped) }}
              </td>
              <td class="text-right">
                {{ item.fill }}
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
import { CalculatedDateTimeRange } from '@/lib/types/DateTime.type';
import { ReportComponent } from './classes/ReportComponent';
import { DataTableHeader } from 'vuetify';
import { UserService, ReportService } from '@/services';

let isAlternateCategory = false;

@Component({
  name: 'PPESupplyByCategory',
})
export default class PPESupplyByCategory extends ReportComponent {
  private readonly userService = UserService.getInstance();

  private readonly reportService = ReportService.getInstance();

  private calculatedDateTimeRange: CalculatedDateTimeRange | null = null;

  private formatComma = d3.format(',');

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
      text: 'Peak On Order',
      value: 'peakOnOrder',
    },
    {
      text: 'Peak Current In Stock',
      value: 'peakCurrentInStock',
    },
    {
      text: 'Average Daily Order',
      value: 'averageDailyOrder',
    },
    {
      text: 'Total Order',
      value: 'onOrder',
    },
    {
      text: 'Total Back Order',
      value: 'backOrder',
    },
    {
      text: 'Total Shipped',
      value: 'shipped',
    },
    {
      text: 'Fill',
      value: 'fill',
    },
  ];

  /**
   * Raw, original data pulled from API for this Report
   */
  private rawData: any[] = [];

  protected data: any[] = [];

  public readonly name = 'PPE Supply By Category';

  public readonly description = 'Summary of the PPE Supplies being ordered and organized by category';

  public readonly enabledControls = {
    search: true,
    dateTimeRange: true,
    distChannels: true,
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
    {
      label: 'Export Raw Data (Public)',
      value: 'export_raw_data_for_audit',
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
  @Watch('distChannels')
  private async onControlChange() {
    this.calculatedDateTimeRange = dateTimeRangeCalculator.calcDateTimeRange(this.dateTimeRange);
    this.$nextTick(() => this.init());
  }

  protected async fetchData(): Promise<any> {
    if (!this.calculatedDateTimeRange) {
      throw Error('Unable to fetch data without valid calculated date-range');
    }
    const request = (this.distChannels.length === 0)
      ? this.reportService.api.ppeSupply
      : this.reportService.api.distChannelPpeSupply;
    const authenticationToken = this.userService.getActiveToken();
    const response = await request({
      authentication_token: authenticationToken,
      report_params: {
        startDate: this.calculatedDateTimeRange.startDateTime,
        endDate: this.calculatedDateTimeRange.endDateTime,
        distChannel: this.distChannels.map((dc) => (dc === '(None)') ? '' : dc).join(',') ?? undefined,
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
      return;
    }
    if (command === 'export_raw_data_for_audit') {
      this.downloadCsvRawDataForAudit();
    }
  }

  /**
   * Download Csv Data for Report
   */
  private downloadCsvReport() {
    const { startDate, endDate } = this.dateTimeRange;
    const filename = `${this.name} [${startDate} - ${endDate}]`;
    const headers = this.headers.map((head) => head.text);
    const data = [headers].concat(this.data.map((row) => [
      row.category,
      row.subCategory,
      row.peakOnOrder,
      row.peakCurrentInStock,
      // row.directCurrentInStock,
      row.averageDailyOrder,
      row.onOrder,
      row.backOrder,
      row.shipped,
      row.fill,
    ]));
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
   * Download Csv Raw Data for Audit
   */
  private downloadCsvRawDataForAudit() {
    const { startDate, endDate } = this.dateTimeRange;
    const filename = `${this.name} [${startDate} - ${endDate}] (raw)`;
    const headers = [
      'start_date',
      'start_time',
      'end_date',
      'end_time',
      'item_category',
      'item_subcategory',
      'sku',
      'description',
      'unit_by_container',
      'packs_on_hand_main',
      'created_packs',
      'back_ordered_packs',
      'fill_rate',
      'packs_shipped_main',
    ];
    const data = [headers].concat(this.rawData.map((row) => [
      row.start_date,
      row.start_time,
      row.end_date,
      row.end_time,
      row.item_category,
      row.item_subcategory,
      row.sku,
      row.description,
      row.unit_by_container,
      row.packs_on_hand_main,
      row.created_packs,
      row.back_ordered_packs,
      row.fill_rate,
      row.packs_shipped_main,
    ]));
    reportDownloader.downloadCsv(filename, data);
  }

  /**
   * Calculate the fill-rate
   */
  private calculateFillRate(onOrderQuantity: number, backOrderQuantity: number) {
    const fillRate = (onOrderQuantity - backOrderQuantity) / onOrderQuantity;
    if (Number.isNaN(fillRate)) {
      return 0;
    }
    return fillRate;
  }

  /**
   * Format data for Report before rendering in table
   */
  private formatData(data: any[]) {
    // group data
    let nestedReportData;
    if (this.displayByContainers) {
      nestedReportData = d3
        .nest<any, any>()
        .key((d: any) => d.item_category)
        .key((d: any) => d.item_subcategory)
        .rollup((leaves: any) => {
          const onOrder = d3.sum(leaves, (o: any) => parseInt(o.created_packs, 10));
          const backOrder = d3.sum(leaves, (o: any) => parseInt(o.back_ordered_packs, 10));
          return {
            onOrder,
            backOrder,
            peakOnOrder: d3.sum(leaves, (o: any) => parseInt(o.on_open_purchase_order_main, 10)),
            peakCurrentInStock: d3.sum(leaves, (o: any) => parseInt(o.packs_on_hand_main, 10)),
            // directCurrentInStock: d3.sum(leaves, (o: any) => parseInt(o.on_hand_evf_direct, 10)),
            averageDailyOrder: d3.sum(leaves, (o: any) => parseInt(o.average_daily_shipment, 10)),
            shipped: d3.sum(leaves, (o: any) => parseInt(o.packs_shipped_main, 10)),
            fill: this.calculateFillRate(onOrder, backOrder),
            minSkuPriority: d3.min(leaves, (o: any) => parseInt(o.sku_priority, 10)),
          };
        })
        .entries(data);
    } else {
      nestedReportData = d3
        .nest<any, any>()
        .key((d: any) => d.item_category)
        .key((d: any) => d.item_subcategory)
        .rollup((leaves: any) => {
          const onOrder = d3.sum(leaves, (o: any) => (
            ReportUtil.calculateTotalUnits(o.created_packs, o.unit_by_container)
          ));
          const backOrder = d3.sum(leaves, (o: any) => (
            ReportUtil.calculateTotalUnits(o.back_ordered_packs, o.unit_by_container)
          ));
          return {
            onOrder,
            backOrder,
            peakOnOrder: d3.sum(leaves, (o: any) => (
              ReportUtil.calculateTotalUnits(o.on_open_purchase_order_main, o.unit_by_container)
            )),
            peakCurrentInStock: d3.sum(leaves, (o: any) => (
              ReportUtil.calculateTotalUnits(o.packs_on_hand_main, o.unit_by_container)
            )),
            averageDailyOrder: d3.sum(leaves, (o: any) => (
              ReportUtil.calculateTotalUnits(o.average_daily_shipment, o.unit_by_container)
            )),
            shipped: d3.sum(leaves, (o: any) => (
              ReportUtil.calculateTotalUnits(o.packs_shipped_main, o.unit_by_container)
            )),
            fill: this.calculateFillRate(onOrder, backOrder),
            minSkuPriority: d3.min(leaves, (o: any) => parseInt(o.sku_priority, 10)),
          };
        })
        .entries(data);
    }
    // sort category and sub-category based on ascending sku priority
    nestedReportData.sort((a: any, b: any) => d3.ascending(
      ReportUtil.getCategoryMinSkuPriority(a),
      ReportUtil.getCategoryMinSkuPriority(b),
    ));
    nestedReportData.forEach((category: any) => {
      category.values.sort((a: any, b: any) => d3.ascending(a.minSkuPriority, b.minSkuPriority));
    });
    // flatten report data for v-data-table component
    let flatReportData: any[] = [];
    nestedReportData.forEach((d: any) => {
      // category overall row
      const categoryData: any = {
        category: d.key,
        subCategory: '',
        peakOnOrder: d3.sum(d.values, (o: any) => o.value.peakOnOrder),
        peakCurrentInStock: d3.sum(d.values, (o: any) => o.value.peakCurrentInStock),
        // directCurrentInStock: d3.sum(
        //   d.values,
        //   (o: any) => o.value.directCurrentInStock,
        // ),
        averageDailyOrder: d3.sum(d.values, (o: any) => o.value.averageDailyOrder),
        onOrder: d3.sum(d.values, (o: any) => o.value.onOrder),
        backOrder: d3.sum(d.values, (o: any) => o.value.backOrder),
        shipped: d3.sum(d.values, (o: any) => o.value.shipped),
      };
      categoryData.fill = this.calculateFillRate(categoryData.onOrder, categoryData.backOrder);
      flatReportData.push(categoryData);
      // subcategories
      flatReportData = flatReportData.concat(
        d.values.map((o: any) => ({
          category: d.key,
          subCategory: o.key,
          peakOnOrder: o.value.peakOnOrder,
          peakCurrentInStock: o.value.peakCurrentInStock,
          // directCurrentInStock: o.value.directCurrentInStock,
          averageDailyOrder: o.value.averageDailyOrder,
          onOrder: o.value.onOrder,
          backOrder: o.value.backOrder,
          shipped: o.value.shipped,
          fill: o.value.fill,
        })),
      );
    });
    // grand total
    const subCategoryData = flatReportData.filter((o: any) => o.subCategory);
    const grandTotalData: any = {
      category: 'Grand Total',
      subCategory: '',
      peakOnOrder: d3.sum(subCategoryData, (o: any) => o.peakOnOrder),
      peakCurrentInStock: d3.sum(subCategoryData, (o: any) => o.peakCurrentInStock),
      averageDailyOrder: d3.sum(subCategoryData, (o: any) => o.averageDailyOrder),
      onOrder: d3.sum(subCategoryData, (o: any) => o.onOrder),
      backOrder: d3.sum(subCategoryData, (o: any) => o.backOrder),
      shipped: d3.sum(subCategoryData, (o: any) => o.shipped),
    };
    grandTotalData.fill = this.calculateFillRate(grandTotalData.onOrder, grandTotalData.backOrder);
    flatReportData.push(grandTotalData);

    // format fill rate
    flatReportData.forEach((d, index) => {
      if (d.fill > 0 && d.fill < 1)
        flatReportData[index].fill = d3.format('.2%')(d.fill);
      else
        flatReportData[index].fill = d3.format('.0%')(d.fill);
    });

    return flatReportData;
  }

  /**
   * Alternate the color of rows for changes in category
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
.ppe-supply-by-category {
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
  .category-highlight > td {
    border-color: grey !important;
  }
}
</style>
