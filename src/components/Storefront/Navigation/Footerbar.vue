<template>
  <div class="footerbar__wrapper">
    <div class="footerbar">
      <div class="footerbar__grid-container">
        <!--Other-page Navigation (core pages) -->
        <div class="footerbar__big-nav">
          <div
            v-for="page in otherPages"
            :key="page.label"
            class="big-nav__link"
          >
            <router-link
              v-slot="{ href }"
              :to="page.to"
            >
              <v-btn
                :href="href"
                class="big-nav__link-btn font-weight-black"
                color="black"
                text
              >
                {{ page.label }}
              </v-btn>
            </router-link>
          </div>
        </div>

        <!-- Newsletter Form -->
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

        <!-- Site-wide Navigation -->
        <div class="footerbar__site-nav">
          <div
            v-for="section in navSections"
            :key="section.label"
            class="site-nav__section"
          >
            <p>{{ section.label }}</p>
            <router-link
              v-for="(link, idx) in section.links"
              :key="idx"
              v-slot="{ href }"
              :to="link.to"
            >
              <a
                class="site-nav__link"
                :href="href"
              >{{ link.label }}</a>
            </router-link>
          </div>
        </div>

        <div class="footerbar__typeface">
          <v-img :src="podvikingLogoUrl" />
        </div>

        <div class="footerbar__stamp">
          <span class="stamp__info">
            &copy; {{ year }} PodViking - All Rights Reserved
          </span>

          <!-- TODO Payment provider icons -->
          <span class="stamp__providers">
            <paypal-logo />
            <shopify-logo />
            <mastercard-logo />
            <visa-logo />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import links, { NavigationLink } from '@/components/Storefront/Navigation/storefront-links';
import podvikingLogoUrl from '@/assets/images/svg/podviking_typeface_flat.svg';
import PaypalLogo from '@/assets/images/svg/prvdr_paypal.svg?inline';
import ShopifyLogo from '@/assets/images/svg/prvdr_shopify.svg?inline';
import MastercardLogo from '@/assets/images/svg/prvdr_mastercard.svg?inline';
import VisaLogo from '@/assets/images/svg/prvdr_visa.svg?inline';

@Component({
  name: 'Footerbar',
  components: {
    PaypalLogo,
    ShopifyLogo,
    MastercardLogo,
    VisaLogo,
  },
})
export class Footerbar extends Vue {
  /**
   * URL for the Brand's typeface
   */
  @Prop({ required: false, default: podvikingLogoUrl })
  private readonly podvikingLogoUrl!: string;

  /**
   * Sections of the site navigation in the footer bar
   *
   * TODO Typing for external navigating (i.e. Instagram, Facebook)
   * TODO Pages for each of these lol
   */
  private readonly navSections: { label: string; links: NavigationLink[] }[] = [
    {
      label: 'Legal Info',
      links: [
        {
          label: 'Privacy Policy',
          to: { name: 'home' },
        }, {
          label: 'Terms & Conditions',
          to: { name: 'home' },
        }, {
          label: 'Return Policy',
          to: { name: 'home' },
        }, {
          label: 'Cookie Policy',
          to: { name: 'home' },
        }, {
          label: 'Gift Card',
          to: { name: 'home' },
        },
      ],
    }, {
      label: 'FAQ',
      links: [
        {
          label: 'Payments',
          to: { name: 'home' },
        }, {
          label: 'Subscribe To The Newsletter',
          to: { name: 'home' },
        },
      ],
    }, {
      label: 'Follow',
      links: [
        {
          label: 'Instagram',
          to: { name: 'home' },
        }, {
          label: 'Facebook',
          to: { name: 'home' },
        },
      ],
    }, {
      label: 'Help',
      links: [
        {
          label: 'Contact Us',
          to: { name: 'home' },
        },
      ],
    },
  ]

  /**
   * Current year
   */
  private year: string = new Date().getFullYear().toString();

  /**
   * Routes for the other core-pages of the site that aren't this one.
   */
  private get otherPages() {
    // If we're on the homepage, the first three will suffice
    if (this.$route.name === 'home') return links.slice(0, 3);

    // Otherwise get the other links that we aren't currently on
    return links.filter((link) => {
      if (!link.to?.name) throw Error('Route needs a `name` - please define in router');
      return link.to?.name !== this.$route.name;
    });
  }
}

export default Footerbar;
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.footerbar {
  $borderStyle: solid;
  $borderWidth: 0.5vw;

  margin-top: auto;

  &__grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto 1fr auto;
    gap: 0.8vw 0.8vw;
    grid-template-areas:
      "big-nav big-nav"
      "newsletter site-nav"
      "brand brand"
      ". stamp";
  }
  &__big-nav {
    // TODO Increase specificity to avoid "!important"
    @mixin override-dimensions {
      width: 100% !important;
      height: 100% !important;
    }

    grid-area: big-nav;
    height: 11.5vw;
    display: flex;
    justify-content: space-between;
    align-items: center;

    border-top-color: var(--v-black-base);
    border-top-style: $borderStyle;
    border-top-width: $borderWidth;
    border-bottom-color: var(--v-black-base);
    border-bottom-style: $borderStyle;
    border-bottom-width: $borderWidth;

    .big-nav__link {
      @include override-dimensions;
      &:not(:last-child) {
        border-right-color: var(--v-black-base);
        border-right-style: $borderStyle;
        border-right-width: $borderWidth;
      }
    }
    .big-nav__link-btn {
      @include override-dimensions;
      & > .v-btn__content {
        font-size: 1.75vw;
      }
    }
  }
  &__newsletter {
    grid-area: newsletter;
    max-width: 22vw;
    .theme--light.v-text-field > .v-input__control > .v-input__slot:before,
    .theme--light.v-text-field > .v-input__control > .v-input__slot:after {
      border-width: $borderWidth;
      border-bottom: none;
      border-left: none;
      border-right: none;
      border-color: inherit;
    }

    // TODO Fix specificity
    .newsletter__label > span {
      font-size: 1.87vw !important;
      line-height: 2.20vw !important;
    }
    .newsletter__submit > .v-btn__content { font-size: 0.9vw }
  }
  &__site-nav {
    grid-area: site-nav;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: 9.8vw;

    // Column Spacing
    & > div { margin: 0 0.88vw; }

    .site-nav__section {
      display: flex;
      flex-direction: column;
      font-size: 0.9vw;

      // Section header
      & > p {
        text-transform: uppercase;
        font-weight: bold;
      }
      & > * {
        margin: 0 0 0.22vw 0;
        text-align: right;
      }
      & > *:last-child {
        margin: 0 0 0.44vw 0;
      }
    }

    // TODO Pull this out into a basic anchor component
    .site-nav__link {
      text-decoration: none;
      transition: color 200ms ease-in-out;
      color: var(--v-black-base);
      &:hover {
        color: var(--v-black-lighten3);
      }
      &:active {
        color: var(--v-black-lighten5);
      }
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
      margin-right: 0.88vw;
    }
    .stamp__info { font-size: 0.9vw }
    .stamp__providers > * { margin: 0 0.3vw }
  }
}
</style>
