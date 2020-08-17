<template>
  <div class="soundbar-slider">
    <span class="soundbar-slider__time-indicator">
      {{ startTimeMinutes }}
    </span>
    <!-- Show dummy slider if skeleton mode -->
    <v-slider
      v-if="skeleton"
      class="soundbar-slider__slider"
      :value="0"
      :min="0"
      :max="100"
      disabled
      hide-details
    />
    <v-slider
      v-else
      class="soundbar-slider__slider"
      :value="currentTime"
      :min="0"
      :max="totalTime"
      track-fill-color="primary"
      hide-details
      readonly
      @start="onStart"
      @end="onEnd"
      @mousedown="onMousedown"
      @mouseup="onMouseup"
    />
    <span class="soundbar-slider__time-indicator">
      {{ totalTimeMinutes }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'SoundbarSlider',
})
export default class SoundbarSlider extends Vue {
  @Prop({ required: true, default: 0 })
  private readonly currentTime!: number;

  @Prop({ required: true, default: 100 })
  private readonly totalTime!: number;

  /**
   * Whether to show a dummy slider if no songs are active
   */
  @Prop({ required: false, default: false })
  private readonly skeleton!: boolean;

  private get startTimeMinutes() {
    const time = this.currentTime / 60000;
    return new String(time.toFixed(2));
  }

  private get totalTimeMinutes() {
    const time = this.totalTime / 60000;
    return new String(time.toFixed(2));
  }

  private onStart(value: number) {
    this.$emit('start', value);
  }

  private onEnd(value: number) {
    this.$emit('end', value);
  }

  private onMousedown() {
    this.$emit('mousedown');
  }

  private onMouseup() {
    this.$emit('mouseup');
  }
}
</script>

<style lang="scss">
.soundbar-slider {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  &__time-indicator {
    opacity: 0.8;
    margin: 0 1rem;
  }
}
</style>
