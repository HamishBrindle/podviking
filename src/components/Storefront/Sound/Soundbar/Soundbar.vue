<template>
  <div class="soundbar__wrapper">
    <div class="soundbar">
      <div class="soundbar__container">
        <!--  Controls -->
        <soundbar-controls
          class="soundbar__controls"
          :playing="isPlaying"
          @prev="onControlsPrev"
          @play="onControlsPlay"
          @pause="onControlsPause"
          @next="onControlsNext"
        />

        <!-- Time slider -->
        <!-- Time indicators (current and total time) -->
        <soundbar-slider
          class="soundbar__slider"
          :current-time="currentTime"
          :total-time="totalTime"
          :skeleton="!isPlaying"
          @start="onSliderStart"
          @end="onSliderEnd"
          @mousedown="onSliderMousedown"
          @mouseup="onSliderMouseup"
        />


        <!-- Volume & Mute -->

        <!-- Track image, title, artist -->

        <!-- Add to cart button -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */

import { Vue, Component, Watch } from 'vue-property-decorator';
import { SoundcloudService } from '@/services/SoundcloudService';
import SoundbarControls from './components/SoundbarControls.vue';
import SoundbarSlider from './components/SoundbarSlider.vue';
import { SoundcloudStreamer } from '@/lib/SoundcloudStreamer';

@Component({
  name: 'Soundbar',
  components: {
    SoundbarControls,
    SoundbarSlider,
  },
})
export default class Soundbar extends Vue {
  private readonly soundcloudService = SoundcloudService.getInstance();

  private streamer: SoundcloudStreamer = Vue.observable(this.soundcloudService.getStreamer());

  private get isPlaying() {
    return this.streamer.playing;
  }

  private get currentTime() {
    return this.streamer.time;
  }

  private get totalTime() {
    return this.streamer.duration;
  }

  private async play() {
    if (this.streamer.isDead()) {
      await this.soundcloudService.stream('279764235');
    } else {
      this.streamer.play();
    }
  }

  private async pause() {
    this.streamer.pause();
  }

  private onControlsPlay() {
    this.play();
  }

  private onControlsPause() {
    this.pause();
  }

  private onControlsPrev() {
    console.log('onControlsPrev');
  }

  private onControlsNext() {
    console.log('onControlsNext');
  }

  private onSliderStart(value: number) {
    console.log('onSliderStart: value', value);
  }

  private onSliderEnd(value: number) {
    console.log('onSliderEnd: value', value);
  }

  private onSliderMousedown() {
    console.log('onSliderMousedown');
  }

  private onSliderMouseup() {
    console.log('onSliderMouseup');
  }
}
</script>

<style lang="scss">
.soundbar {
  width: 100%;
  height: 2vw;
  min-height: 3rem;
  background: #e3e3e3;

  &__container {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__controls {
    margin-left: 1rem;
    width: 10vw;
    min-width: 7.5rem;
  }

  &__slider {
    width: 100%;
  }
}
</style>
