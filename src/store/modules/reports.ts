import { make } from 'vuex-pathify';
import DateTimeRangeCalculator from '@/lib/DateTimeRangeCalculator';
import { DateTimeRange } from '@/lib/types/DateTime.type';

export interface IReportsState {
  /**
   * Name of the active report
   */
  name: string;
  /**
   * Loading indicator for the Report
   */
  loading: boolean;
  /**
   * Search string for filtering rows in the Report
   */
  search: Control<string>;
  /**
   * DateTime range used to query for Report data
   */
  dateTimeRange: Control<DateTimeRange>;
  /**
   * Array of distribution channels used to filter results
   */
  distChannels: Control<string[]>;
  /**
   * Number used in toggle for displaying
   */
  displayByContainers: Control<number>;
}

const state: IReportsState = {
  name: '',
  loading: false,
  dateTimeRange: {
    enabled: false,
    value: DateTimeRangeCalculator.getDateTimeRangeThisMonth(),
  },
  displayByContainers: {
    enabled: false,
    value: 0,
  },
  distChannels: {
    enabled: false,
    value: [],
  },
  search: {
    enabled: false,
    value: '',
  },
};

const mutations = make.mutations(state);

const getters = make.getters(state);

const actions = make.actions(state);

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};

type Control<T> = {
  /**
   * Flag for enabling/disabling the use of this control on
   * the report
   */
  enabled: boolean;
  /**
   * Value of the control
   */
  value: T;
}

export type EnabledReportControls = {
  search: boolean;
  distChannels: boolean;
  dateTimeRange: boolean;
  displayByContainers: boolean;
}
