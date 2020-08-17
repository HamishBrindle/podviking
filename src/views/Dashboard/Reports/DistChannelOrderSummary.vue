<template>
  <div class="dist-channel-order-summary__wrapper">
    <div class="dist-channel-order-summary">
      <v-data-table
        v-if="ready"
        :headers="reportHeaders"
        :items="data"
        :search="search"
        :height="reportHeight"
        disable-sort
        disable-pagination
        hide-default-footer
        hide-default-header
        dense
      >
        <template v-slot:body="{ headers, items }">
          <thead>
            <tr>
              <th
                v-for="header in headers"
                :key="header.value"
                :colspan="header.width"
                :class="{
                  'text-right': !['category', 'subCategory'].includes(header.value),
                }"
                :style="tableBgColor"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <!-- PPE Summary -->
          <tbody>
            <!-- Date Range Row -->
            <tr>
              <th :style="tableBgColor" />
              <template
                v-for="(header, i) in headers"
              >
                <template
                  v-if="!['category', 'subCategory'].includes(header.value)"
                >
                  <th
                    :key="`week_${i}`"
                    class="text-right"
                  >
                    Selected Dates
                  </th>
                  <th
                    :key="`all_${i}`"
                    class="text-right"
                  >
                    Total
                  </th>
                </template>
              </template>
            </tr>
            <!-- Data Rows -->
            <template v-for="(item, i) in items">
              <tr
                v-if="renderPPEDataRow(item.sites.grand_total, ppeAllData[i].sites.grand_total)"
                :key="`category_${i}`"
                :class="{
                  'font-weight-bold category-highlight': !item.subCategory,
                  'yellow-lighten-5-bg-only': !$vuetify.theme.dark && i === items.length - 1,
                  'yellow darken-3': $vuetify.theme.dark && i === items.length - 1,
                }"
              >
                <td :style="tableBgColor">
                  <span v-if="!item.subCategory">{{ item.category }}</span>
                  <span v-else>-- {{ item.subCategory }}</span>
                </td>
                <!-- <td>{{ item.subCategory }}</td> -->
                <template
                  v-for="(siteData, siteKey, siteIndex) in item.sites"
                >
                  <td
                    :key="`${siteKey}_week`"
                    :class="getSiteColumnStyle(siteKey, siteIndex)"
                  >
                    {{ formatComma(siteData.shipped) }}
                  </td>
                  <td
                    :key="`${siteKey}_all`"
                    :class="getSiteColumnStyle(siteKey, siteIndex)"
                  >
                    {{ formatComma(ppeAllData[i].sites[siteKey].shipped) }}
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
          <!-- Rush Summary -->
          <tbody>
            <!-- Spacer row -->
            <tr v-if="rushAllData.length">
              <td
                class="spacer-row"
                :colspan="headers.reduce((acc, o) => acc += o.width, 0)"
                :style="tableBgColor"
              />
            </tr>
            <!-- Header Row -->
            <tr
              :class="{
                'rush-summary-header-row-light': !$vuetify.theme.dark,
                'rush-summary-header-row-dark': $vuetify.theme.dark,
              }"
            >
              <th :style="tableBgColor">
                Order Type
              </th>
              <!-- <th /> -->
              <template
                v-for="header in headers"
              >
                <th
                  v-if="!['category', 'subCategory'].includes(header.value)"
                  :key="header.value"
                  :colspan="header.width"
                >
                  <div
                    :class="{
                      'text-right': header.value !== 'ordertype',
                    }"
                  >
                    {{ header.text }}
                  </div>
                </th>
              </template>
            </tr>
            <!-- Date Range Row -->
            <tr>
              <th :style="tableBgColor" />
              <template
                v-for="(header, i) in headers"
              >
                <template
                  v-if="!['category', 'subCategory'].includes(header.value)"
                >
                  <th
                    :key="`week_${i}`"
                    class="text-right"
                  >
                    Selected Dates
                  </th>
                  <th
                    :key="`all_${i}`"
                    class="text-right"
                  >
                    Total
                  </th>
                </template>
              </template>
            </tr>
            <!-- Data Rows -->
            <tr
              v-for="(item, i) in rushSelectedDatesData"
              :key="item.ordertype"
              :class="{
                'font-weight-bold': i === rushSelectedDatesData.length - 1,
                'yellow-lighten-5-bg-only': !$vuetify.theme.dark && i === rushSelectedDatesData.length - 1,
                'yellow darken-3': $vuetify.theme.dark && i === rushSelectedDatesData.length - 1,
              }"
            >
              <td
                colspan="1"
                class="font-weight-bold"
                :style="tableBgColor"
              >
                {{ item.ordertype }}
              </td>
              <template
                v-for="(siteData, siteKey, siteIndex) in item.sites"
              >
                <template
                  v-if="rushAllData.length && item.ordertype === 'Rush Order'"
                >
                  <td
                    :key="`${siteKey}_rush_week`"
                    :class="getSiteColumnStyle(siteKey, siteIndex)"
                  >
                    {{ siteData.count_rush_shipped }}
                  </td>
                  <td
                    :key="`${siteKey}_rush_all`"
                    :class="getSiteColumnStyle(siteKey, siteIndex)"
                  >
                    {{ rushAllData[i].sites[siteKey].count_rush_shipped }}
                  </td>
                </template>
                <template
                  v-else-if="rushAllData.length && item.ordertype === 'Standard Order'"
                >
                  <td
                    :key="`${siteKey}_standard_week`"
                    :class="getSiteColumnStyle(siteKey, siteIndex)"
                  >
                    {{ siteData.count_standard_shipped }}
                  </td>
                  <td
                    :key="`${siteKey}_standard_all`"
                    :class="getSiteColumnStyle(siteKey, siteIndex)"
                  >
                    {{ rushAllData[i].sites[siteKey].count_standard_shipped }}
                  </td>
                </template>
                <template
                  v-else-if="rushAllData.length"
                >
                  <td
                    :key="`${siteKey}_total_week`"
                    :class="getSiteColumnStyle(siteKey, siteIndex)"
                  >
                    {{ siteData.count_orders_shipped }}
                  </td>
                  <td
                    :key="`${siteKey}_total_all`"
                    :class="getSiteColumnStyle(siteKey, siteIndex)"
                  >
                    {{ rushAllData[i].sites[siteKey].count_orders_shipped }}
                  </td>
                </template>
              </template>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator';
import * as d3 from 'd3';
import axios from 'axios';
import reportUtilInstance from '@/lib/ReportUtil';
import DateTimeRangeCalculator from '@/lib/DateTimeRangeCalculator';
import { User } from '@/models/internal';
import { DataTableHeader } from 'vuetify';
import { ReportComponent, ReportAction } from './classes/ReportComponent';
import util from '@/tools/Utilities';

const apiEndpoints = {
  show: (name: string) => `${process.env.VUE_APP_API_ENDPOINT}/reports/${name}`,
};

@Component({
  name: 'DistChannelOrderSummary',
})
export default class DistChannelOrderSummary extends ReportComponent {
  @Prop({ required: true, default: 'All Channels' })
  private readonly distChannel!: string;

  readonly name = 'Distribution Channel Details';

  readonly description = (this.distChannel)
    ? `Order summary data based on the distribution channel, "${this.distChannel}"`
    : 'Order summary data based on all available distribution channels';

  public actions: ReportAction[] = [];

  public enabledControls = {
    search: true,
    dateTimeRange: true,
    distChannels: false,
    displayByContainers: true,
  }

  isIgnoreZeroRows = false;

  reportHeaders: DataTableHeader[] = [];

  ppeSelectedDatesRawData: any = [];

  data: any = [];

  ppeAllRawData: any = [];

  ppeAllData: any = [];

  rushSelectedDatesRawData: any = [];

  rushSelectedDatesData: any = [];

  rushAllRawData: any = [];

  rushAllData: any = [];

  formatComma = d3.format(',');

  reportUtil = reportUtilInstance;

  private get calculatedDateTimeRange() {
    return DateTimeRangeCalculator.calcDateTimeRange(this.dateTimeRange);
  }

  private get allDateTimeRange() {
    const allTimeRange = DateTimeRangeCalculator.getDateTimeRangeAll();
    return DateTimeRangeCalculator.calcDateTimeRange(allTimeRange);
  }

  private get tableBgColor() {
    return {
      background: (this.$vuetify.theme.dark) ? '#1E1E1E' : 'white',
    };
  }

  private get ready() {
    return this.data?.length
      && this.rushAllData?.length
      && this.ppeAllData?.length;
  }

  created() {
    this.toggleControls();
  }

  mounted() {
    this.init();
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

  public execute(): void {
    // Nothing to execute
  }

  async fetchData() {
    await Promise.all([
      this.loadPPEAllData(),
      this.loadRushSelectedDatesData(),
      this.loadRushAllData(),
    ]);

    return this.loadPPESelectedDatesData();
  }

  /**
   * Load Ppe Selected Dates Data
   */
  async loadPPESelectedDatesData() {
    this.reportHeaders = [];
    // fetch week datetime range
    try {
      const user = User.getActive();
      const authenticationToken = user?.authentication_token;
      const response = await axios.get(apiEndpoints.show('dist_channel_ppe_order_summary'), {
        params: {
          authentication_token: authenticationToken,
          report_params: {
            startDate: this.calculatedDateTimeRange.startDateTime,
            endDate: this.calculatedDateTimeRange.endDateTime,
            distChannel: this.distChannel,
          },
        },
      });
      this.ppeSelectedDatesRawData = response.data.data;
      this.reportHeaders = this.getTableHeaders(response.data.data);

      return this.formatData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch PPE week data: ', error);
    }
  }

  /**
   * Load Ppe All Data
   */
  async loadPPEAllData() {
    this.ppeAllData = [];
    // fetch all datetime range
    try {
      const user = User.getActive();
      const authenticationToken = user?.authentication_token;
      const response = await axios.get(apiEndpoints.show('dist_channel_ppe_order_summary'), {
        params: {
          authentication_token: authenticationToken,
          report_params: {
            startDate: this.allDateTimeRange.startDateTime,
            endDate: this.allDateTimeRange.endDateTime,
            distChannel: this.distChannel,
          },
        },
      });
      this.ppeAllRawData = response.data.data;
      this.ppeAllData = this.formatData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch PPE all data: ', error);
    }
  }

  /**
   * Load Rush Selected Dates Data
   */
  async loadRushSelectedDatesData() {
    this.rushSelectedDatesData = [];
    // fetch week datetime range
    try {
      const user = User.getActive();
      const authenticationToken = user?.authentication_token;
      const response = await axios.get(apiEndpoints.show('dist_channel_rush_summary'), {
        params: {
          authentication_token: authenticationToken,
          report_params: {
            startDate: this.calculatedDateTimeRange.startDateTime,
            endDate: this.calculatedDateTimeRange.endDateTime,
            distChannel: this.distChannel,
          },
        },
      });
      this.rushSelectedDatesRawData = response.data.data;
      this.rushSelectedDatesData = this.formatRushSummaryData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch rush summary week data: ', error);
    }
  }

  /**
   * Load Rush All Data
   */
  async loadRushAllData() {
    this.rushAllData = [];
    // fetch all datetime range
    try {
      const user = User.getActive();
      const authenticationToken = user?.authentication_token;
      const response = await axios.get(apiEndpoints.show('dist_channel_rush_summary'), {
        params: {
          authentication_token: authenticationToken,
          report_params: {
            startDate: this.allDateTimeRange.startDateTime,
            endDate: this.allDateTimeRange.endDateTime,
            distChannel: this.distChannel,
          },
        },
      });
      this.rushAllRawData = response.data.data;
      this.rushAllData = this.formatRushSummaryData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch rush summary all data: ', error);
    }
  }

  /**
   * Get Table Headers
   */
  getTableHeaders(data: any) {
    let tableHeaders = [
      {
        text: 'Category',
        value: 'category',
        width: 1,
      },
    ];
    tableHeaders = tableHeaders.concat(this.getTableHeaderSites(data));
    tableHeaders.push({
      text: 'Grand Total',
      value: 'grandTotal',
      width: 2,
    });
    return tableHeaders;
  }

  /**
   * Get Table Header Sites
   */
  getTableHeaderSites(data: any) {
    const sites = d3
      .nest()
      .key((d: any) => d.retailer_code)
      .entries(data);
    return sites.map((site) => ({
      text: util.titleCase(site.values[0].site),
      value: site.key,
      width: 2,
    }));
  }

  /**
   * Format Data
   */
  formatData(data: any) {
    let nestedReportData;
    if (this.displayByContainers) {
      nestedReportData = d3
        .nest()
        .key((d: any) => d.item_category)
        .key((d: any) => d.item_subcategory)
        .key((d: any) => d.retailer_code)
        .rollup((leaves) => ({
          onOrder: d3.sum(leaves, (o: any) => parseInt(o.created_packs, 10)),
          backOrder: d3.sum(leaves, (o: any) => parseInt(o.back_ordered_packs, 10)),
          shipped: d3.sum(leaves, (o: any) => parseInt(o.packs_shipped_main, 10)),
          fill: d3.mean(leaves, (o: any) => parseFloat(o.fill_rate)),
          minSkuPriority: d3.min(leaves, (o: any) => parseInt(o.sku_priority, 10)),
        }) as any)
        .entries(data);
    } else {
      nestedReportData = d3
        .nest()
        .key((d: any) => d.item_category)
        .key((d: any) => d.item_subcategory)
        .key((d: any) => d.retailer_code)
        .rollup((leaves) => ({
          onOrder: d3.sum(leaves, (o: any) => reportUtilInstance.calculateTotalUnits(o.created_packs, o.unit_by_container)),
          backOrder: d3.sum(leaves, (o: any) => reportUtilInstance.calculateTotalUnits(o.back_ordered_packs, o.unit_by_container)),
          shipped: d3.sum(leaves, (o: any) => reportUtilInstance.calculateTotalUnits(o.packs_shipped_main, o.unit_by_container)),
          fill: d3.mean(leaves, (o: any) => parseFloat(o.fill_rate)),
          minSkuPriority: d3.min(leaves, (o: any) => parseInt(o.sku_priority, 10)),
        }) as any)
        .entries(data);
    }
    // flatten report data for v-data-table component
    let flatReportData: any[] = [];
    nestedReportData.forEach((d: any) => {
      // subcategories
      const subCategoryRows = d.values.map((o: any) => ({
        category: d.key,
        subCategory: o.key,
        sites: o.values.reduce((acc: any, site: any) => {
          acc[site.key] = site.value;
          return acc;
        }, {}),
      }));
      // category overall row
      flatReportData.push({
        category: d.key,
        subCategory: '',
        sites: (() => {
          const categorySites = subCategoryRows.reduce((siteMap: any, subCategory: any) => {
            Object.entries(subCategory.sites).forEach(([siteKey, siteData]: [any, any]) => {
              if (!siteMap[siteKey]) {
                siteMap[siteKey] = Object.entries(siteData).reduce((dataMap: any, [key, val]) => {
                  dataMap[key] = [val];
                  return dataMap;
                }, {});
              } else {
                Object.entries(siteData).forEach(([key, val]) => {
                  siteMap[siteKey][key].push(val);
                });
              }
            });
            return siteMap;
          }, {});
          Object.values(categorySites).forEach((siteData: any) => {
            Object.keys(siteData).forEach((key) => {
              switch (key) {
              case 'fill':
                siteData[key] = d3.mean(siteData[key]);
                break;
              case 'minSkuPriority':
                siteData[key] = d3.min(siteData[key]);
                break;
              default:
                siteData[key] = d3.sum(siteData[key]);
                break;
              }
            });
          });
          return categorySites;
        })(),
      });
      flatReportData = flatReportData.concat(subCategoryRows);
    });
    // grand total row
    const subCategoryData = flatReportData.filter((o) => o.subCategory);
    flatReportData.push({
      category: 'Grand Total',
      subCategory: '',
      sites: (() => {
        const categorySites = subCategoryData.reduce((siteMap, subCategory) => {
          Object.entries(subCategory.sites).forEach(([siteKey, siteData]: [any, any]) => {
            if (!siteMap[siteKey]) {
              siteMap[siteKey] = Object.entries(siteData).reduce((dataMap: any, [key, val]) => {
                dataMap[key] = [val];
                return dataMap;
              }, {});
            }
            Object.entries(siteData).forEach(([key, val]) => {
              siteMap[siteKey][key].push(val);
            });
          });
          return siteMap;
        }, {});
        Object.values(categorySites).forEach((siteData: any) => {
          Object.keys(siteData).forEach((key) => {
            switch (key) {
            case 'fill':
              siteData[key] = d3.mean(siteData[key]);
              break;
            case 'minSkuPriority':
              siteData[key] = d3.min(siteData[key]);
              break;
            default:
              siteData[key] = d3.sum(siteData[key]);
              break;
            }
          });
        });
        return categorySites;
      })(),
    });
    // grand total column per row
    flatReportData.forEach((row) => {
      const siteData = Object.values(row.sites);
      const grandTotalCol = {
        onOrder: d3.sum(siteData, (o: any) => o.onOrder),
        backOrder: d3.sum(siteData, (o: any) => o.backOrder),
        shipped: d3.sum(siteData, (o: any) => o.shipped),
        fill: d3.mean(siteData, (o: any) => o.fill),
      };
      row.sites.grand_total = grandTotalCol;
    });
    return flatReportData;
  }

  /**
   * Format Rush Summary Data
   */
  formatRushSummaryData(data: any) {
    const rushSummaryData = [];
    // rush order row
    rushSummaryData.push({
      ordertype: 'Rush Order',
      sites: data.reduce((acc: any, site: any) => {
        const siteKey = site.retailer_code;
        acc[siteKey] = {
          count_rush_created: site.count_rush_created,
          count_rush_shipped: site.count_rush_shipped,
          sla_met_rush: site.sla_met_rush,
        };
        return acc;
      }, {}),
    });
    // standard order row
    rushSummaryData.push({
      ordertype: 'Standard Order',
      sites: data.reduce((acc: any, site: any) => {
        const siteKey = site.retailer_code;
        acc[siteKey] = {
          count_standard_created: site.count_standard_created,
          count_standard_shipped: site.count_standard_shipped,
          sla_met_standard: site.sla_met_standard,
        };
        return acc;
      }, {}),
    });
    // grand total row
    rushSummaryData.push({
      ordertype: 'Grand Total',
      sites: data.reduce((acc: any, site: any) => {
        const siteKey = site.retailer_code;
        acc[siteKey] = {
          count_orders_shipped: site.count_orders_shipped,
        };
        return acc;
      }, {}),
    });
    // grand total column per row
    rushSummaryData.forEach((row) => {
      const siteData = Object.values(row.sites);
      const grandTotalCol: any = {};
      switch (row.ordertype) {
      case 'Rush Order':
        grandTotalCol.count_rush_created = d3.sum(siteData, (o: any) => o.count_rush_created);
        grandTotalCol.count_rush_shipped = d3.sum(siteData, (o: any) => o.count_rush_shipped);
        grandTotalCol.sla_met_rush = d3.sum(siteData, (o: any) => o.sla_met_rush);
        break;
      case 'Standard Order':
        grandTotalCol.count_standard_created = d3.sum(siteData, (o: any) => o.count_standard_created);
        grandTotalCol.count_standard_shipped = d3.sum(siteData, (o: any) => o.count_standard_shipped);
        grandTotalCol.sla_met_standard = d3.sum(siteData, (o: any) => o.sla_met_standard);
        break;
      case 'Grand Total':
        grandTotalCol.count_orders_shipped = d3.sum(siteData, (o: any) => o.count_orders_shipped);
        break;
      default:
        break;
      }
      row.sites.grand_total = grandTotalCol;
    });
    return rushSummaryData;
  }

  /**
   * Get a Site-column key
   */
  getSiteColumnStyle(colKey: any, colIndex: any) {
    if (colKey === 'grand_total') {
      return {
        'yellow-lighten-5-bg-only': !this.$vuetify.theme.dark,
        'yellow-darken-3-bg-only': this.$vuetify.theme.dark,
        'text-right': true,
      };
    }
    if (colIndex % 2) {
      return {
        'text-right': true,
      };
    }
    return {
      'blue-lighten-5-bg-only': !this.$vuetify.theme.dark,
      'primary-darken-3-bg-only': this.$vuetify.theme.dark,
      'text-right': true,
    };
  }

  /**
   * Render a PPE data row
   */
  renderPPEDataRow(selectedDatesGrandTotal: any, allDatesGrandTotal: any) {
    if (this.isIgnoreZeroRows) {
      if (selectedDatesGrandTotal.shipped === 0
      && allDatesGrandTotal.shipped === 0) {
        return false;
      }
      return true;
    }
    return true;
  }
}
</script>

<style lang="scss">
.dist-channel-order-summary {
  table > thead > tr > th:nth-child(1) {
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 0;
    z-index: 2;
  }

  table > thead > tr > th {
    position: sticky !important;
    position: -webkit-sticky !important;
    top: 0;
    z-index: 1;
  }

  table > tbody > tr > td:nth-child(1),
  table > tbody > tr > th:nth-child(1) {
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 0;
    background: white;
  }

  .spacer-row {
    height: 5rem;
  }
  .rush-summary-header-row-light {
    color: rgb(0, 0, 0, 0.6);
  }
  .rush-summary-header-row-dark {
    color: rgba(255, 255, 255, 0.7)
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
