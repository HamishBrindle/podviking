<template>
  <div class="report-controls__wrapper">
    <div class="report-controls">
      <v-row
        align="start"
        justify="space-between"
      >
        <v-col
          v-if="isSearchEnabled"
          cols="auto"
        >
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Filter"
            single-line
            hide-details
          />
        </v-col>

        <!-- DateTime Range Picker components -->
        <template v-if="isDateTimeRangeEnabled">
          <v-col cols="auto">
            <date-time-range-picker
              ref="dateTimeRangePicker"
              v-model="dateTimeRange"
              @click:reload="onClickReload"
            />
          </v-col>

          <v-col cols="auto">
            <date-time-range-preset-buttons
              v-model="dateTimeRangePreset"
              @click="onClickDateRangePresets"
            />
          </v-col>

          <template v-if="isDisplayByContainersEnabled">
            <v-col cols="auto">
              <v-btn-toggle
                v-model="displayByContainers"
                active-class="accent"
                dense
                mandatory
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      v-on="on"
                    >
                      <v-icon :color="(!displayByContainers) ? 'white' : undefined">
                        mdi-package-variant
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Display by units</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      v-on="on"
                    >
                      <v-icon :color="(displayByContainers) ? 'white' : undefined">
                        mdi-package-variant-closed
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Display by containers</span>
                </v-tooltip>
              </v-btn-toggle>
            </v-col>
          </template>
        </template>
        <!-- END OF DateTime Range Picker components -->

        <v-col
          v-if="isDistChannelsEnabled"
          cols="auto"
        >
          <dist-channel-autocomplete v-model="distChannels" />
        </v-col>

        <v-col class="d-flex justify-end">
          <v-menu
            v-if="actions && actions.length"
            offset-y
          >
            <template v-slot:activator="{ on: menu }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    :disabled="loading"
                    color="primary"
                    text
                    v-on="{ ...tooltip, ...menu }"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <span>More actions</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in actions"
                :key="index"
                @click="onAction(item.value)"
              >
                <v-list-item-icon class="mr-1">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                  {{ item.label }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import DateTimeRangePicker from '@/components/DateTimeRange/DateTimeRangePicker.vue';
import DateTimeRangePresetButtons, {
  DateTimeRangePreset,
} from '@/components/DateTimeRange/DateTimeRangePresetButtons.vue';
import DistChannelAutocomplete from '@/components/Autocomplete/DistChannelAutocomplete.vue';
import dateTimeRangeCalculator from '@/lib/DateTimeRangeCalculator';
import { DateTimeRange } from '@/lib/types/DateTime.type';
import { Sync, Get } from 'vuex-pathify';
import { ReportAction } from '../classes/ReportComponent';

@Component({
  name: 'ReportControls',
  components: {
    DateTimeRangePicker,
    DateTimeRangePresetButtons,
    DistChannelAutocomplete,
  },
})
export default class ReportControls extends Vue {
  @Get('reports/loading')
  private readonly loading!: boolean;

  @Get('reports/search@enabled')
  private readonly isSearchEnabled!: boolean;

  @Get('reports/dateTimeRange@enabled')
  private readonly isDateTimeRangeEnabled!: boolean;

  @Get('reports/distChannels@enabled')
  private readonly isDistChannelsEnabled!: boolean;

  @Get('reports/displayByContainers@enabled')
  private readonly isDisplayByContainersEnabled!: boolean;

  @Sync('reports/search@value')
  private search!: string;

  @Sync('reports/dateTimeRange@value')
  private dateTimeRange!: DateTimeRange;

  @Sync('reports/distChannels@value')
  private distChannels!: string[];

  @Sync('reports/displayByContainers@value')
  private displayByContainers!: number;

  @Prop({ required: true, default: () => [] })
  private actions!: ReportAction[];

  /**
   * Preset range for the date-picker
   */
  private dateTimeRangePreset = DateTimeRangePreset.ALL;

  created() {
    this.setDateRangePresets(this.dateTimeRangePreset);
  }

  /**
   * Apply the date-range preset
   */
  private setDateRangePresets(preset: DateTimeRangePreset) {
    switch (preset) {
    case DateTimeRangePreset.DAY:
      this.dateTimeRange = dateTimeRangeCalculator.getDateTimeRangeToday();
      break;
    case DateTimeRangePreset.WEEK:
      this.dateTimeRange = dateTimeRangeCalculator.getDateTimeRangeThisWeek();
      break;
    case DateTimeRangePreset.MONTH:
      this.dateTimeRange = dateTimeRangeCalculator.getDateTimeRangeThisMonth();
      break;
    case DateTimeRangePreset.ALL:
      this.dateTimeRange = dateTimeRangeCalculator.getDateTimeRangeAll();
      break;
    default:
      throw new Error('Invalid date range preset.');
    }
  }

  /**
   * Clicked presets from DateTimeRangePresetButtons.
   */
  private onClickDateRangePresets(preset: DateTimeRangePreset) {
    this.setDateRangePresets(preset);
  }

  /**
   * Listener for reloading of table through date-picker
   */
  private onClickReload() {
    this.$emit('on-reload');
  }

  /**
   * Listener for clicking an option from the overflow menu
   * dropdown
   */
  private onAction(action: string) {
    this.$emit('on-action', action);
  }
}
</script>

<style lang="scss">
.report-controls {
  width: inherit;
  display: flex;
  justify-content: space-between;
  .row {
    flex: 1;
    align-content: flex-start;
  }
  &__wrapper {
    width: 100%;
  }
  &__overflow-menu {
    display: flex;
  }
}
</style>
