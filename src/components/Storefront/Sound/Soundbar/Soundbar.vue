<template>
  <div class="soundbar__wrapper">
    <div class="soundbar">
      <v-slide-y-reverse-transition>
        <div
          v-if="!loading && isPlaying"
          class="soundbar__container"
        >
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
          <soundbar-volume
            class="soundbar__volume"
            :volume="volume"
            :mute="isMuted"
            @adjust="onVolumeAdjust"
            @mute="onVolumeMute"
          />

          <!-- Track image, title, artist -->
          <soundbar-info
            class="soundbar__info"
            :artist="song.artist"
            :title="song.title"
            :img="song.img"
          />

          <!-- Add to cart button -->
        </div>
      </v-slide-y-reverse-transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { SoundcloudService } from '@/services/SoundcloudService';
import { SoundcloudStreamer } from '@/lib/SoundcloudStreamer';
import { Logger } from '@/tools/Logger';
import SoundbarControls from './components/SoundbarControls.vue';
import SoundbarSlider from './components/SoundbarSlider.vue';
import SoundbarInfo from './components/SoundbarInfo.vue';
import SoundbarVolume from './components/SoundbarVolume.vue';

@Component({
  name: 'Soundbar',
  components: {
    SoundbarControls,
    SoundbarSlider,
    SoundbarInfo,
    SoundbarVolume,
  },
})
export class Soundbar extends Vue {
  protected readonly soundcloudService = SoundcloudService.getInstance();

  protected readonly logger: Logger = new Logger({ context: 'Soundbar' });

  protected streamer: SoundcloudStreamer = Vue.observable(this.soundcloudService.getStreamer());

  protected loading = false;

  /**
   * TODO: Remove when real deal comes in
   */
  protected readonly song = {
    track: '279764235',
    artist: 'Young & Shameless',
    title: 'White Ferrari (Remix)',
    img: '',
  }

  protected get isPlaying() {
    return this.streamer.playing;
  }

  protected get currentTime() {
    return this.streamer.time;
  }

  protected get totalTime() {
    return this.streamer.duration;
  }

  protected get volume() {
    return this.streamer.volume;
  }

  protected get isMuted() {
    return this.streamer.muted;
  }

  created() {
    this.init();
  }

  async init() {
    this.loading = true;

    try {
      await this.soundcloudService.stream(this.song.track);
    } catch (t) {
      this.logger.error(t);
    }

    this.loading = false;
  }

  protected onControlsPlay() {
    this.streamer.play();
  }

  protected onControlsPause() {
    this.streamer.pause();
  }

  protected onControlsPrev() {
    this.logger.info(`${this.$options.name}: onControlsPrev`);
  }

  protected onControlsNext() {
    this.logger.info(`${this.$options.name}: onControlsNext`);
  }

  protected onSliderStart() {
    this.streamer.pause();
  }

  protected onSliderEnd(value: number) {
    this.streamer.seek(value).then(() => this.streamer.play());
  }

  protected onSliderMousedown(/* event: MouseEvent */) {
    this.logger.info(`${this.$options.name}: onSliderMousedown`);
  }

  protected onSliderMouseup(/* event: MouseEvent */) {
    this.logger.info(`${this.$options.name}: onSliderMouseup`);
  }

  protected onVolumeAdjust(volume: number) {
    this.streamer.setVolume(volume);
  }

  protected onVolumeMute(isMuted: boolean) {
    this.streamer.setMuted(isMuted);
  }
}

export default Soundbar;
</script>

<style lang="scss">
.soundbar {
  width: 100%;
  height: 2vw;
  min-height: 3.125rem;

  &__container {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #e3e3e3;
  }

  &__controls {
    margin-left: 1rem;
    width: 10vw;
    min-width: 7.5rem;
  }

  &__slider {
    width: 100%;
  }

  &__volume {
    max-width: 200px;
  }
}
</style>
