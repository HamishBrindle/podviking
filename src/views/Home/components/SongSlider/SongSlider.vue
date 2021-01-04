<template>
  <div class="song-slider__wrapper">
    <div class="song-slider">
      <!-- Header -->
      <div class="song-slider__header">
        <div
          class="song-slider__header-title font-weight-black black--text text-uppercase
          text-center"
        >
          Discover Our <br> Vibes
        </div>

        <div class="song-slider__header-filters">
          <div
            v-for="filter in filters"
            :key="filter"
            :class="{
              'song-slider__header-filter': true,
              'song-slider__header-filter--active': filter === activeFilter
            }"
          >
            <v-btn
              text
              plain
              :color="filter === activeFilter ? 'primary' : 'black'"
            >
              {{ filter }}
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Slider -->
      <div class="song-slider__slider">
        <div class="song-slider__slider-background">
          <div class="primary" />
          <div class="secondary" />
        </div>

        <v-slide-group
          show-arrows="desktop"
          active-class="song--active"
          center-active
          mandatory
        >
          <template slot="prev">
            <v-icon size="2vw">
              mdi-chevron-left
            </v-icon>
          </template>
          <template slot="next">
            <v-icon size="2vw">
              mdi-chevron-right
            </v-icon>
          </template>

          <!-- TODO Song card component -->
          <v-slide-item
            v-for="n in 15"
            :key="n"
            v-slot="{ toggle }"
          >
            <v-card
              color="grey lighten-2"
              class="song"
              @click="toggle"
            />
          </v-slide-item>
        </v-slide-group>
      </div>

      <!-- View All Button -->
      <div class="song-slider__go-to-store">
        <router-link
          v-slot="{ href }"
          :to="{ name: 'shop' }"
        >
          <v-btn
            text
            x-large
            :href="href"
            color="black"
            class="font-weight-black"
          >
            View All
          </v-btn>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'SongSlider',
  components: {},
})
export class SongSlider extends Vue {
  private readonly filters = [
    'all',
    'space',
    'energy',
    'chill',
    'more',
  ]

  // TODO State handler
  private activeFilter = 'all';
}

export default SongSlider;
</script>

<style lang="scss">
.song-slider {
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 0;

  &__header-title {
    font-size: 2vw;
    line-height: 2vw;
  }
  &__header-filters {
    display: flex;
    justify-content: center;
    margin-top: 1vw;

    & > *:not(:last-child) { margin-right: 0.75vw; }
  }
  &__header-filter > .v-btn.v-btn--flat.v-btn--text.v-size--default {
    text-transform: lowercase;
    border-radius: 0;

    & > span {
      font-size: 0.75vw;
      line-height: 0.75vw;
    }
  }
  &__header-filter--active > .v-btn.v-btn--flat.v-btn--text.v-size--default {
    position: relative;

    &::after {
      position: absolute;
      content: "";
      width: 100%;
      height: 0.25vw;
      background-color: var(--v-primary-base);
      bottom: 0;
      left: 0;
      right: 0;
    }
  }

  &__slider {
    position: relative;
    width: 100%;
    height: auto;
    margin: 2vw 0;
  }

  &__slider-background {
    $scissorAngle: 7deg;

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(25%);

    & > * {
      width: 100%;
      height: 50%;
      transform-origin: right bottom;
      -webkit-box-shadow: 5px 5px 10px -1px rgba(0,0,0,0.2);
      box-shadow: 5px 5px 10px -1px rgba(0,0,0,0.2);
    }

    & > div:nth-of-type(1) {
      transform: scaleX(1.2) rotateZ(-$scissorAngle) translateX(2vw);
    }
    & > div:nth-of-type(2) {
       transform: scaleX(1.2) translateY(-100%) rotateZ($scissorAngle) translateX(2vw);
    }
  }

  &__go-to-store { text-align: center; }
  &__go-to-store > .v-btn > span {
    font-size: 1.1vw;
  }
}

.song {
  height: 20vw;
  width: 15vw;
  margin: 1vw;
  transform: scale(1);
  transition: transform 150ms ease-out !important;

  &--active {
    transform: scale(1.05);
  }
}
</style>
