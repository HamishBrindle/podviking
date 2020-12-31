<template>
  <v-container class="footerbar__container">
    <div class="footerbar">
      <div class="footerbar__grid-container">
        <!-- TODO: Newsletter component -->
        <div class="footerbar__newsletter">
          <div class="newsletter__label">
            <span class="text-h4 text-uppercase font-weight-black">
              Join our <br> quest.
            </span>
          </div>
          <v-form class="newsletter__form">
            <v-text-field
              placeholder="email"
              class="newsletter__field"
            >
              <template v-slot:append>
                <v-btn
                  text
                  class="newsletter__submit mb-2 text-lowercase"
                >
                  Submit
                </v-btn>
              </template>
            </v-text-field>
          </v-form>
        </div>
        <!-- TODO Site-navigation component -->
        <div class="footerbar__site-nav">
          <div class="site-nav__section">
            <p>Legal Info</p>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Privacy Policy</a>
            </router-link>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Terms &amp; Conditions</a>
            </router-link>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Return Policy</a>
            </router-link>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Cookie Policy</a>
            </router-link>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Gift Card</a>
            </router-link>
          </div>
          <div class="site-nav__section">
            <p>FAQ</p>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Shipments</a>
            </router-link>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Payments</a>
            </router-link>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Track Your Order</a>
            </router-link>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Return Your Order</a>
            </router-link>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Subscribe to Newsletter</a>
            </router-link>
          </div>
          <div class="site-nav__section">
            <p>Follow</p>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Instagram</a>
            </router-link>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Facebook</a>
            </router-link>
          </div>
          <div class="site-nav__section">
            <p>Help</p>
            <router-link
              v-slot="{ href }"
              :to="{ name: 'home' }"
            >
              <a
                class="site-nav__link black--text"
                :href="href"
              >Contact Us</a>
            </router-link>
          </div>
        </div>

        <div class="footerbar__typeface">
          <v-img :src="brandTypefaceUrl" />
        </div>

        <div class="footerbar__stamp">
          <span class="stamp__info">
            &copy; {{ year }} PodViking - All Rights Reserved
          </span>

          <!-- TODO: Payment provider icons -->
          <span class="stamp__providers">
            <v-icon>mdi-help</v-icon>
            <v-icon>mdi-help</v-icon>
            <v-icon>mdi-help</v-icon>
            <v-icon>mdi-help</v-icon>
          </span>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import brandTypefaceUrl from '@/assets/images/svg/podviking_typeface_flat.svg';

@Component({
  name: 'Footerbar',
  components: {},
})
export class Footerbar extends Vue {
  /**
   * URL for the Brand's typeface
   */
  @Prop({ required: false, default: brandTypefaceUrl })
  private readonly brandTypefaceUrl!: string;

  private year: string = new Date().getFullYear().toString();
}

export default Footerbar;
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.footerbar {
  &__grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 1rem 1rem;
    grid-template-areas:
      "newsletter site-nav"
      "brand brand"
      ". stamp";
  }
  &__newsletter {
    grid-area: newsletter;
    max-width: 25rem;
    .theme--light.v-text-field > .v-input__control > .v-input__slot:before,
    .theme--light.v-text-field > .v-input__control > .v-input__slot:after {
      border-width: 2px;
      border-color: inherit;
    }
  }
  &__site-nav {
    grid-area: site-nav;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
    flex-wrap: wrap;
    max-height: 9.375rem;

    // Column Spacing
    & > div { margin: 0 1rem; }

    .site-nav__section {
      display: flex;
      flex-direction: column;

      // Section header
      & > p {
        text-transform: uppercase;
        font-weight: bold;
      }
      & > * {
        margin: 0 0 0.25rem 0;
      }
      & > *:last-child {
        margin: 0 0 0.5rem 0;
      }
    }

    .site-nav__link {
      text-decoration: none;
    }
  }
  &__typeface {
    grid-area: brand;
    width: 100%;
  }
  &__stamp {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    grid-area: stamp;
    & > span {
      margin-right: 1rem;
    }
  }
}
</style>
