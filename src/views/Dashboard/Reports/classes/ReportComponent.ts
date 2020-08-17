import { Emit, Vue } from 'vue-property-decorator';
import { IReportsState, EnabledReportControls } from '@/store/modules/reports';
import Logger from '@/tools/Logger';
import { Get, Sync } from 'vuex-pathify';
import { DateTimeRange } from '@/lib/types/DateTime.type';
import debounce from 'debounce-async';

/**
 * `ReportComponent` is designed to abstract away redundant logic
 * when creating a new `Report` component. It's very opinionated,
 * and it all could become unusable eventually, but my hope is
 * that it will make our lives easier in the end.
 *
 * Things like initialization and debouncing hefty requests to the
 * server are taken care of - just be sure to utilize the flags
 * and fields defined here to ensure expected behavior.
 */
export abstract class ReportComponent extends Vue {
  [key: string]: any;

  /**
   * Name of the Report
   */
  public abstract readonly name: string;

  /**
   * Short description of the Report and it's purpose
   */
  public abstract readonly description: string;

  /**
   * Report actions in the overflow-menu. If no actions are
   * desired, set to an empty array, `[]`
   */
  public abstract readonly actions: ReportAction[];

  /**
   * Map of enabled controls for the Report
   */
  public abstract readonly enabledControls: EnabledReportControls;

  /**
   * Loading indicator active during fetching of data, etc.
   */
  @Sync('reports/loading')
  protected loading!: IReportsState['loading'];

  /**
   * Height of the Report's table-body
   */
  @Get('layout/reportHeight')
  protected readonly reportHeight!: number;

  /**
   * Control for filtering rows by string
   */
  @Get('reports/search@value')
  protected readonly search!: string;

  /**
   * Control for filtering Report data by particular distribution channels
   */
  @Get('reports/distChannels@value')
  protected readonly distChannels!: string[];

  /**
   * Control for selecting a datetime range for querying Report data
   */
  @Get('reports/dateTimeRange@value')
  protected readonly dateTimeRange!: DateTimeRange;

  /**
   * Control for displaying results by container or otherwise
   */
  @Get('reports/displayByContainers@value')
  protected readonly displayByContainers!: number;

  /**
   * Search Enabled
   */
  @Sync('reports/search@enabled')
  protected isSearchEnabled!: boolean;

  /**
   * Date Time Range Enabled
   */
  @Sync('reports/dateTimeRange@enabled')
  protected isDateTimeRangeEnabled!: boolean;

  /**
   * Dist Channels Enabled
   */
  @Sync('reports/distChannels@enabled')
  protected isDistChannelsEnabled!: boolean;

  /**
   * Display By Containers Enabled
   */
  @Sync('reports/displayByContainers@enabled')
  protected isDisplayByContainersEnabled!: boolean;

  /**
   * Report data
   */
  protected data: any[] = [];

  /**
   * Debounced fetchData that we use on initialization and to
   * throttle changes to Report controls/filtering
   */
  protected debouncedFetchData = debounce(this.fetchData, 100);

  /**
   * Event emitter for a Report's setup
   * @param {any} [data]
   */
  @Emit('setup')
  protected emitReportSetup(data?: any) {
    return data ?? {};
  }

  /**
   * Fetch report data from API
   */
  protected abstract fetchData(): Promise<any>;

  /**
   * Callback for actions selected from the overflow-menu in the
   * `ReportsControls` component
   */
  public abstract execute(command: string): void;

  /**
   * Toggle on/off the controls
   */
  protected toggleControls(): void {
    this.isDateTimeRangeEnabled = this.enabledControls.dateTimeRange;
    this.isDisplayByContainersEnabled = this.enabledControls.displayByContainers;
    this.isDistChannelsEnabled = this.enabledControls.distChannels;
    this.isSearchEnabled = this.enabledControls.search;
  }

  /**
   * Reload the view
   */
  public reload() {
    this.init();
  }

  /**
   * Initialize the component
   */
  protected async init(): Promise<void> {
    this.loading = true;
    try {
      this.data = await this.debouncedFetchData();
      this.emitReportSetup({
        name: this.name,
        description: this.description,
        actions: this.actions,
      });
      this.loading = false;
    } catch (error) {
      if (error !== 'canceled') {
        this.loading = false;
        Logger.error(error);
      }
    }
  }
}

export type ReportAction = {
  /**
   * Label for option
   */
  label: string;
  /**
   * Value of the option
   */
  value: string;
  /**
   * Icon for option
   */
  icon: string;
}
