<template>
  <div class="eoc-ppe-supply__wrapper">
    <div class="eoc-ppe-supply">
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
                    'text-right': header.value === 'peakWarehouse',
                  }"
                >
                  {{ header.text }}
                </div>
              </th>
            </tr>
          </thead>
        </template>

        <template
          v-if="rawData.length"
          v-slot:body="{ items }"
        >
          <tbody>
            <tr
              v-for="(item, i) in items"
              :key="item.sku"
              :class="{
                'yellow-lighten-5-bg-only': !$vuetify.theme.dark && i === items.length - 1,
                'yellow-darken-3-bg-only': $vuetify.theme.dark && i === items.length - 1,
                'font-weight-bold': i === items.length - 1,
              }"
            >
              <td class="align-start">
                {{ item.customCategory }}
              </td>
              <td
                :class="{
                  'text-right font-weight-bold': true,
                }"
              >
                {{ formatComma(item.peakWarehouse) }}
              </td>
              <td>
                <span
                  v-if="(i === 0)
                    || (items[i - 1].category !== item.category
                      || items[i -1].customCategory !== item.customCategory)"
                >{{ item.category }}</span>
              </td>
              <td>
                <div
                  v-for="subCategory in item.subCategories.split('\n')"
                  :key="subCategory"
                >
                  {{ subCategory }}
                </div>
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
import { ReportComponent, ReportAction } from './classes/ReportComponent';
import { DataTableHeader } from 'vuetify';
import { UserService, ReportService } from '@/services';
import { CalculatedDateTimeRange } from '@/lib/types/DateTime.type';

@Component({
  name: 'EOCPPESupply',
})
export default class EOCPPESupply extends ReportComponent {
  private readonly reportService = ReportService.getInstance();

  private readonly userService = UserService.getInstance();

  private formatComma = d3.format(',');

  private headers: DataTableHeader[] = [
    {
      text: 'Custom Category',
      value: 'customCategory',
    },
    {
      text: 'Peak Warehouse',
      value: 'peakWarehouse',
    },
    {
      text: 'Category',
      value: 'category',
    },
    {
      text: 'Sub-Categories',
      value: 'subCategories',
    },
  ];

  protected calculatedDateTimeRange: CalculatedDateTimeRange | null = null;

  protected rawData: any[] = [];

  protected data: any[] = [];

  public readonly name = 'EOC PPE Supply';

  public readonly description = 'Report of supply data for EOC PPE';

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

  public enabledControls = {
    search: true,
    dateTimeRange: true,
    distChannels: false,
    displayByContainers: true,
  };

  beforeCreate() {
    this.ReportUtil = ReportUtil;
  }

  created() {
    this.toggleControls();
  }

  mounted() {
    this.calculatedDateTimeRange = dateTimeRangeCalculator.calcDateTimeRange(this.dateTimeRange);
    this.init();
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
   * Callback for date-range watcher; reloads data from server
   * with new query parameters
   */
  @Watch('dateTimeRange')
  @Watch('displayByContainers')
  private async onControlChange() {
    this.$nextTick(() => this.init());
  }

  /**
   * Download CSV Report
   */
  private downloadCsvReport() {
    const { startDate, endDate } = this.dateTimeRange;
    const filename = `${this.name} [${startDate} - ${endDate}]`;
    const headers = this.headers.map((head) => head.text);
    const data = [headers].concat(this.data.map((row) => [
      row.customCategory,
      row.peakWarehouse,
      row.category,
      row.subCategories,
    ]));
    reportDownloader.downloadCsv(filename, data);
  }

  /**
   * Download CSV Report as raw data
   */
  private downloadCsvRawData() {
    const { startDate, endDate } = this.dateTimeRange;
    const filename = `${this.name} [${startDate} - ${endDate}] (raw)`;
    const headers = Object.keys(this.rawData[0]);
    const data = [headers].concat(this.rawData.map((row) => Object.values(row)));
    reportDownloader.downloadCsv(filename, data);
  }

  protected async fetchData() {
    const authenticationToken = this.userService.getActiveToken();
    const data = await this.reportService.api.eocPpeSupply({
      authentication_token: authenticationToken,
      report_params: {
        startDate: this.calculatedDateTimeRange?.startDateTime,
        endDate: this.calculatedDateTimeRange?.endDateTime,
      },
    });
    this.rawData = data;
    return this.formatData(data);
  }

  private formatData(rawData: any) {
    const data = rawData.filter((d: any) => d.custom_category !== null);
    // group data
    let nestedReportData;
    if (this.displayByContainers) {
      nestedReportData = d3
        .nest()
        .key((d: any) => d.custom_category)
        .rollup((leaves: any) => ({
          category: leaves[0].item_category,
          subCategories: leaves
            .map((o: any) => o.item_subcategory)
            .filter((item: any, index: number, array: any[]) => array.indexOf(item) === index)
            .join('\n'),
          peakWarehouse: d3.sum(leaves, (o: any) => parseInt(o.packs_on_hand_main, 10)),
          minSkuPriority: d3.min(leaves, (o: any) => parseInt(o.sku_priority, 10)),
        }) as any)
        .entries(data);
    } else {
      nestedReportData = d3
        .nest()
        .key((d: any) => d.custom_category)
        .rollup((leaves: any) => ({
          category: leaves[0].item_category,
          subCategories: leaves
            .map((o: any) => o.item_subcategory)
            .filter((item: any, index: number, array: any[]) => array.indexOf(item) === index)
            .join('\n'),
          peakWarehouse: d3.sum(leaves, (o: any) => (
            ReportUtil.calculateTotalUnits(o.packs_on_hand_main, o.unit_by_container)
          )),
          minSkuPriority: d3.min(leaves, (o: any) => parseInt(o.sku_priority, 10)),
        }) as any)
        .entries(data);
    }
    // sort category and sub-category based on ascending sku priority
    nestedReportData.sort((a: any, b: any) => (a.value.minSkuPriority - b.value.minSkuPriority));
    // flatten report data for v-data-table component
    let flatReportData: any[] = [];
    nestedReportData.forEach((d: any) => {
      flatReportData = flatReportData.concat({
        customCategory: d.key,
        category: d.value.category,
        subCategories: d.value.subCategories,
        peakWarehouse: d.value.peakWarehouse,
      });
    });
    // grand total
    flatReportData.push({
      customCategory: 'Grand Total',
      category: '',
      subCategories: '',
      peakWarehouse: d3.sum(flatReportData, (o) => o.peakWarehouse),
    });

    return flatReportData;
  }
}
</script>

<style lang="scss">
.eoc-ppe-supply {
  .yellow-lighten-5-bg-only {
    background-color: #fffde7;
  }
  .yellow-darken-3-bg-only {
    background-color: #f9a825;
  }
}
</style>
