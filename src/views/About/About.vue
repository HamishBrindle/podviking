<template>
  <div class="about__wrapper">
    <div class="about">
      <!-- Services -->
      <div class="about__services d-flex align-center">
        <div class="about__services-background">
          <div class="primary" />
          <div class="secondary" />
        </div>

        <div class="d-flex justify-center">
          <div class="about__service-cards d-flex flex-row justify-center align-center">
            <v-card
              class="about__service-card about__service-card--tall"
              color="grey lighten-2"
            />
            <div class="d-flex flex-column justify-space-between">
              <v-card
                class="about__service-card"
                color="grey lighten-2"
              />
              <v-card
                class="about__service-card"
                color="grey lighten-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable class-methods-use-this */

import { Component } from 'vue-property-decorator';
import { Page } from '@/lib/Page';
import { VuetifyThemeVariant } from 'vuetify/types/services/theme.d';
import { palette } from '@/plugins/vuetify';

@Component({
  name: 'About',
  components: {},
})
export default class About extends Page {
  protected theme: Partial<VuetifyThemeVariant> = {
    background: palette.ultramarineBlue,
    primary: palette.jet,
    secondary: palette.springGreen,
    black: palette.white,
    white: palette.ultramarineBlue,
  };

  mounted() {
    this.setTheme(this.theme);
  }
}
</script>

<style lang="scss">
.about {
  $cardWidth: 20vw;
  $cardHeight: 20vw;
  $cardSpacing: 0.5vw;

  &__services {
    position: relative;
    width: 100%;
    height: auto;
    margin: 8vw 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &__services-header {
    width: ($cardWidth * 2) - $cardSpacing;
    text-align: left;
    text-transform: lowercase;
    & > div:first-of-type {
      margin-bottom: 1vw;
      font-size: 2vw;
    }
  }
  &__services-background {
    $scissorAngle: -7deg;

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(12vw);
    height: 30vw;

    & > * {
      width: 100%;
      height: 50%;
      transform-origin: right bottom;
      -webkit-box-shadow: 5px 5px 10px -1px rgba(0,0,0,0.2);
      box-shadow: 5px 5px 10px -1px rgba(0,0,0,0.2);
      z-index: 0;
    }

    & > div:nth-of-type(1) {
      transform: scaleX(1.2) rotateZ(-$scissorAngle) translateX(3vw);
    }
    & > div:nth-of-type(2) {
       transform: scaleX(1.2) translateY(-100%) rotateZ($scissorAngle) translateX(3vw);
    }
  }

  &__service-cards {
    width: 40vw;
  }

  &__service-card {
    width: $cardWidth - $cardSpacing;
    height: $cardHeight - $cardSpacing;
    margin: $cardSpacing;

    &--tall {
      height: $cardHeight * 2;
      width: $cardWidth + $cardSpacing;
    }
  }
}
</style>
