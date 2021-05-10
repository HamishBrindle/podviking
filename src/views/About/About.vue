<template>
  <div class="about__wrapper">
    <div class="about">
      <!-- Title -->
      <h2 class="white--text font-weight-black text-center text-uppercase">
        About
      </h2>

      <div class="about__hero d-flex flex-row">
        <!-- About block - border, header (right), body text -->
        <div class="about__text-cta d-flex flex-column black--text">
          <div class="cta-text">
            <h3 class="font-weight-black text-right text-uppercase mb-4">
              What We Do
            </h3>
            <p>{{ verbiage }}</p>
          </div>
          <div class="cta-button d-flex justify-end">
            <v-btn
              color="white"
              elevation="0"
              dark
              :ripple="false"
              class="rounded-0 text-lowercase"
            >
              {{ cta }}
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- Poddy -->
        <div class="about__hero-image">
          <img
            :src="logoBlackUrl"
            class="about__logo-black"
          >
        </div>
      </div>

      <!-- Social Icon-bar -->
      <div class="d-flex justify-center">
        <social-icon-bar class="about__social-icon-bar" />
      </div>

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
import { Component } from 'vue-property-decorator';
import { Page } from '@/lib/Page';
import { VuetifyThemeVariant } from 'vuetify/types/services/theme.d';
import { palette } from '@/plugins/vuetify';
import logoBlackUrl from '@/assets/img/svg/pod_viking_logo_black_flat.svg';
import { SocialIconBar } from '@/components/Storefront/SocialIconBar.vue';

@Component({
  name: 'About',
  components: {
    SocialIconBar,
  },
})
export default class About extends Page {
  protected theme: Partial<VuetifyThemeVariant> = {
    background: palette.ultramarineBlue,
    primary: palette.jet,
    secondary: palette.springGreen,
    black: palette.white,
    white: palette.jet,
  };

  protected readonly logoBlackUrl = logoBlackUrl;

  /**
   * CTA verbiage
   */
  protected verbiage = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cursus viverra euismod.
    Aenean dui justo, commodo quis justo eu, venenatis placerat diam. Morbi vehicula metus
    a erat cursus, efficitur bibendum nisl congue. Etiam at elementum tellus, congue aliquam
    erat.
  `;

  protected cta = 'Licenses'

  public mounted() {
    this.setTheme(this.theme);
  }
}
</script>

<style lang="scss">
.about {
  $cardWidth: 20vw;
  $cardHeight: 20vw;
  $cardSpacing: 0.5vw;

  & > h2 {
    font-size: 5vw;
    font-weight: 900;
    margin-bottom: 5vw;
  }

  &__hero {
    position: relative;
    z-index: 0;
    margin-bottom: 7vw;
  }

  &__text-cta {
    max-width: 56vw;
    border: 0.5vw solid var(--v-white-base);

    & > .cta-text {
      padding: 5vw;
    }

    & > .cta-text > h3 {
      font-size: 3.75vw;
      font-weight: 700;
    }

    & > .cta-text > p {
      font-size: 2.25vw;
      margin-right: 7vw;
      text-align: justify;
      text-justify: inter-word;
      font-weight: 500;
    }

    & > .cta-button {
      width: 100%;
    }

    & > .cta-button > button {
      // margin: 0 0 -0.2vw -0.2vw;
      padding: 2vw 3vw !important;
      // max-width: 10vw;

      & > span > i,
      & > span { font-size: 1.5vw; }
    }
  }

  &__hero-image {
    width: 100%;
    position: inherit;
  }

  &__logo-black {
    position: absolute;
    top: 0vw;
    right: 0vw;
    transform: translateX(50%) translateY(-10%);
    height: 80vw;
    z-index: 0;
  }

  &__social-icon-bar {
    z-index: 1;
    width: 40vw;
  }

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
