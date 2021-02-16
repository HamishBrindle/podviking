<template>
  <div class="home__wrapper">
    <div class="home">
      <!-- Song Slider -->
      <song-slider class="home__song-slider" />

      <!-- Conquer Your Sound -->
      <div class="home__read-more">
        <div class="grid-container">
          <div class="logo">
            <v-img :src="logoUrl" />
          </div>
          <div class="typeface">
            <div class="viking-hell d-flex flex-column">
              <span>Conquer</span>
              <div>
                <span class="white--text primary">Your Sound</span>
              </div>
            </div>
          </div>
          <div
            class="verbiage text-right"
          >
            Stand out amongst the horde, <br>
            forge your own experience, <br>
            your the people hear you.
          </div>
          <div class="cta">
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <v-btn
                :href="href"
                text
                color="primary"
              >
                Read More
              </v-btn>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Services -->
      <div class="home__services d-flex align-center">
        <div class="home__services-background">
          <div class="primary" />
          <div class="red" />
        </div>

        <div class="home__services-header">
          <div class="font-weight-black text-uppercase">
            Mixed &amp; Mastered
          </div>
          <p>
            Browse our list of unique, musical content - mixed and mastered -
            ready for your new videos, podcasts, and whatever else you need it for.

            <v-spacer class="my-2" />

            We're adding new content regularly so you can always explore new sounds and ideas.
          </p>
        </div>

        <div class="d-flex justify-center">
          <div class="home__service-cards d-flex flex-row justify-center align-center">
            <v-card
              class="home__service-card home__service-card--tall"
              color="grey lighten-2"
            />
            <div class="d-flex flex-column justify-space-between">
              <v-card
                class="home__service-card"
                color="grey lighten-2"
              />
              <v-card
                class="home__service-card"
                color="grey lighten-2"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Blocks ("Craft Your Sounds" & Newsletter) -->
      <div class="home__blocks d-flex">
        <div class="home__block home__block--craft-sound d-flex justify-center align-center">
          <div class="home__block-icons">
            <div class="home__block-icon home__block-icon--podcast">
              <v-img :src="podcastIconUrl" />
            </div>
            <div class="home__block-icon home__block-icon--videocast">
              <v-img :src="videocastIconUrl" />
            </div>
          </div>
          <div class="home__block-text viking-hell">
            <span>Craft</span>
            <span>Your</span>
            <span>Sounds</span>
          </div>
        </div>
        <div class="home__block home__block--newsletter">
          <newsletter-form
            label-size="large"
            label-position="right"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import podVikingLogoUrl from '@/assets/img/svg/podviking_logo_flat.svg';
import podcastIconUrl from '@/assets/img/svg/icon_podcast.svg';
import videocastIconUrl from '@/assets/img/svg/icon_videocast.svg';
import { NewsletterForm } from '@/components/Storefront/NewsletterForm.vue';
import { Page } from '@/lib/Page';
import { VuetifyThemeVariant } from 'vuetify/types/services/theme.d';
import { SongSlider } from './components/SongSlider/SongSlider.vue';

@Component({
  name: 'Home',
  components: {
    SongSlider,
    NewsletterForm,
  },
})
export class Home extends Page {
  @Prop({ required: false, default: podVikingLogoUrl })
  protected readonly logoUrl!: string;

  protected readonly podcastIconUrl = podcastIconUrl;

  protected readonly videocastIconUrl = videocastIconUrl;

  protected theme: Partial<VuetifyThemeVariant> = {};

  public mounted() {
    this.init();
  }
}

export default Home;
</script>

<style lang="scss">
.home {
  &__song-slider {
    margin: 2vw 0 5vw;
  }
  &__read-more {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 3vw;

    .grid-container {
      display: grid;
      grid-template-columns: auto auto auto;
      grid-template-rows: auto auto;
      gap: 0.5vw 0.5vw;
      grid-template-areas:
        "logo typeface typeface"
        "logo verbiage cta";
    }
    .logo {
      grid-area: logo;
      width: 15vw;
      max-height: 16vw;
    }
    .typeface {
      grid-area: typeface;
      max-height: 7vw;
      position: relative;
      z-index: 0;
      & > div > span {
        z-index: 2;
        color: #212121;
        font-size: 4vw;
      }
      & > div > div {
        text-align: left;
        transform: rotateZ(-8deg) translateY(-1.8vw) translateX(0.5vw);
        z-index: 1;
        & > span {
          padding: 0.25vw 1vw;
          font-size: 4vw;
        }
      }
    }
    .verbiage {
      grid-area: verbiage;
      width: 14vw;
      font-size: 1vw;
    }
    .cta {
      grid-area: cta;

      .v-btn { text-transform: inherit; }
    }
    .verbiage, .cta {
      text-transform: lowercase;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
    }
  }

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
    transform: translateY(24vw);
    height: 30vw;

    & > * {
      width: 100%;
      height: 50%;
      transform-origin: left bottom;
      -webkit-box-shadow: 5px 5px 10px -1px rgba(0,0,0,0.2);
      box-shadow: 5px 5px 10px -1px rgba(0,0,0,0.2);
      z-index: 0;
    }

    & > div:nth-of-type(1) {
      transform: scaleX(1.2) rotateZ(-$scissorAngle) translateX(-2vw);
    }
    & > div:nth-of-type(2) {
       transform: scaleX(1.2) translateY(-100%) rotateZ($scissorAngle) translateX(-2vw);
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

  &__blocks {
    transform: scale(1.025) translateY(0.4vw);
  }

  &__block {
    position: relative;
    height: 40vw;
    width: 100%;
  }

  &__block--craft-sound {
    background: transparent;
  }
  &__block--newsletter {
    background: var(--v-grey-lighten3);
    display: flex;
    justify-content: center;
    align-items: center;
    .newsletter-form {
      width: 50%;
    }
  }

  &__block-icons {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  &__block-icon {
    position: absolute;
    width: 14vw;

    &--podcast {
      top: 6vw;
      left: 7vw;
    }
    &--videocast {
      bottom: 8vw;
      right: 6vw;
    }
  }
  &__block-text {
    z-index: 0;
    display: flex;
    flex-direction: column;
    font-size: 5vw;
    justify-content: center;
    text-align: center;
    line-height: 4.5vw;
    & > span:nth-of-type(1), & > span:nth-of-type(3) {

    }
    & > span:nth-of-type(2) {
      font-size: 3vw;
    }
  }
}
</style>
