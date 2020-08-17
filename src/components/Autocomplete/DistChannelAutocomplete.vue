<template>
  <v-autocomplete
    v-model="selected"
    v-bind="options"
    class="dist-channel-autocomplete"
    multiple
    :loading="loading"
    :items="distChannels"
    label="Distribution Channel"
    name="distChannel"
    @change="change"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { CustomerService, UserService } from '../../services';
import Logger from '@/tools/Logger';

/**
 * For selecting sites without a Dist Channel
 */
const NONE_LABEL = '(None)';

@Component({
  name: 'DistChannelAutocomplete',
})
export default class DistChannelAutocomplete extends Vue {
  readonly customerService = CustomerService.getInstance();

  readonly userService = UserService.getInstance();

  @Prop({ required: false, default: '' })
  value!: string;

  /**
   * Attributes to be bound to component in template
   */
  @Prop({ required: false, default: () => ({}) })
  options!: Record<string, any>;

  /**
   * Whether to fetch the data from cache vs. remotely. Defaults
   * to `false`
   */
  @Prop({ required: false, default: false })
  cache!: boolean;

  @Watch('value')
  onValueChange(value: string[]) {
    this.selected = value;
  }

  selected: string[] = [];

  loading = false;

  data: string[] = [];

  created() {
    this.init();
  }

  async init() {
    const distChannels = await this.fetchData();
    if (distChannels?.length) this.data.push(...distChannels);
  }

  /**
   * Fetch the distribution channels
   */
  async fetchData(): Promise<string[]> {
    this.loading = true;
    try {
      const data = await this.customerService.api.distributionChannels({
        authentication_token: this.userService.getActiveToken(),
      });
      return data;
    } catch (error) {
      Logger.error(error);
      return [];
    } finally {
      this.loading = false;
    }
  }

  /**
   * Filter out contract providers
   */
  get distChannels(): string[] {
    return this.getDistChannels().filter(
      (distChannel: any) => !distChannel.match(/^CP\s\w+/g),
    );
  }

  /**
   * Get all the distribution channels
   */
  getDistChannels() {
    let distChannels: string[] = [];
    if (this.data.length > 0) {
      distChannels = this.data.filter(Boolean);
      distChannels.unshift(NONE_LABEL);
    }
    return distChannels;
  }

  /**
   * Change event listener
   */
  change() {
    this.$emit('input', this.selected);
    this.$emit('change', this.selected);
  }
}
</script>
