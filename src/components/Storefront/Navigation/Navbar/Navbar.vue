<template>
  <div class="navbar__wrapper">
    <div class="navbar">
      <div class="navbar__left">
        <!-- Brand Typeface should dance with Social Icons -->
        <div
          v-if="isTop"
          class="navbar__social"
        >
          Social
        </div>

        <div
          :class="{
            'navbar__brand-typeface': true,
            'navbar__brand-typeface--full': !isTop
          }"
        >
          <router-link
            v-slot="{ navigate }"
            :to="{ name: 'home' }"
          >
            <v-btn
              text
              :ripple="false"
              @click="navigate"
            >
              <logo class="navbar__brand-typeface" />
            </v-btn>
          </router-link>
        </div>
      </div>

      <div class="navbar__center">
        <div :class="{ 'navbar__links': true, 'navbar__links--solid': !isTop }">
          <navbar-link
            v-for="link in links"
            :key="link.label"
            :label="link.label"
            :to="link.to"
            :dark="!isTop"
          />
        </div>
      </div>

      <div class="navbar__right">
        <div class="navbar__controls">
          <!-- Shopping Cart -->
          <v-btn
            fab
            text
            :ripple="false"
            color="primary"
            large
          >
            <v-icon large>
              mdi-cart-outline
            </v-icon>
          </v-btn>

          <!-- Customer -->
          <v-btn
            fab
            text
            :ripple="false"
            color="primary"
            large
          >
            <v-icon large>
              mdi-account-outline
            </v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import brandTypefaceUrl from '@/assets/img/svg/podviking_typeface_flat.svg';
import links, { NavigationLink } from '@/components/Storefront/Navigation/storefront-links';
import Logo from '@/components/Logo.vue';
import { NavbarLink } from './components/NavbarLink.vue';

@Component({
  name: 'Navbar',
  components: {
    NavbarLink,
    Logo,
  },
})
export class Navbar extends Vue {
  /**
   * URL for the Brand's typeface to display in navbar
   */
  @Prop({ required: false, default: brandTypefaceUrl })
  private readonly brandTypefaceUrl!: string;

  /**
   * TODO: Implement
   *
   * Page is scrolled to top
   */
  private isTop = false;

  /**
   * Navigation Links
   */
  private links: NavigationLink[] = links;
}

export default Navbar;
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.navbar {
  $item-spacing: 0.25vw;
  $logo-width: 15vw;

  width: 100%;
  display: flex;
  align-items: center;

  &__wrapper {
    padding: 1vw;
  }

  &__left, &__right {
    flex: 1;
  }

  &__center {
    justify-self: center;
  }

  &__brand-typeface {
    & > .v-btn {
      width: calc($logo-width + 1vw);
      height: auto !important;
      padding: 0.5rem !important;
      border-radius: 0;
    }
    & > .v-btn > span > div > svg {
      width: $logo-width;
    }
  }

  &__links {
    display: flex;
    padding: 0.5vh 1vh;

    &--solid {
      background: var(--v-primary-base);
    }

    & > .navbar-link > .v-btn {
      text-transform: lowercase;
    }

    & > .navbar-link:not(:last-child) {
      margin-right: $item-spacing;
    }
  }

  &__controls {
    display: flex;
    justify-content: flex-end;

    &:not(:last-child) {
      margin-right: $item-spacing;
    }

    & > .v-btn.v-btn--fab.v-btn--flat.v-btn--round.v-btn--text.v-size--large.primary--text {
      border-radius: 0;
      display: flex;
      min-width: unset;
      width: unset;
      height: unset;
      padding: 1vw 1vw;
    }

    & > .v-btn.v-btn--fab.v-btn--flat.v-btn--round.v-btn--text.v-size--large.primary--text
      > span > i {
      font-size: 2vw !important;
    }
  }
}
</style>
