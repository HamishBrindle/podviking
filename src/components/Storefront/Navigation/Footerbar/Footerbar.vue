<template>
  <div class="footerbar__wrapper">
    <div class="footerbar">
      <div class="footerbar__grid-container">
        <!--Other-page Navigation (core pages) -->
        <big-nav class="footerbar__big-nav" />

        <!-- Newsletter Form -->
        <newsletter-form class="footerbar__newsletter-form" />

        <!-- Site-wide Navigation -->
        <site-nav class="footerbar__site-nav" />

        <div class="footerbar__typeface">
          <logo />
        </div>

        <div class="footerbar__stamp">
          <span class="stamp__info black--text">
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
import { Vue, Component } from 'vue-property-decorator';
import PaypalLogo from '@/assets/img/svg/prvdr_paypal.svg?inline';
import ShopifyLogo from '@/assets/img/svg/prvdr_shopify.svg?inline';
import MastercardLogo from '@/assets/img/svg/prvdr_mastercard.svg?inline';
import VisaLogo from '@/assets/img/svg/prvdr_visa.svg?inline';
import BigNav from '@/components/Storefront/Navigation/Footerbar/components/BigNav.vue';
import NewsletterForm from '@/components/Storefront/NewsletterForm.vue';
import SiteNav from '@/components/Storefront/Navigation/Footerbar/components/SiteNav.vue';
import Logo from '@/components/Logo.vue';

@Component({
  name: 'Footerbar',
  components: {
    BigNav,
    Logo,
    MastercardLogo,
    NewsletterForm,
    PaypalLogo,
    ShopifyLogo,
    SiteNav,
    VisaLogo,
  },
})
export class Footerbar extends Vue {
  /**
   * Current year
   */
  protected year: string = new Date().getFullYear().toString();
}

export default Footerbar;
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.footerbar {
  z-index: 5;
  margin-bottom: 2.5vw;

  &__wrapper {
    width: 100%;
    background: var(--v-background-base);
  }
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
    grid-area: big-nav;
    height: 11.5vw;
    margin-bottom: 2vw;
  }
  &__newsletter-form,
  &__site-nav,
  &__typeface,
  &__stamp {
    padding: 0 2vw 0 2vw;
  }
  &__newsletter-form {
    grid-area: newsletter;
    max-width: 22vw;
  }
  &__site-nav {
    grid-area: site-nav;
    max-height: 9.8vw;
    margin-bottom: 2vw;
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
    .stamp__info { font-size: 1vw }
    .stamp__providers > * {
      margin: 0 0.3vw;
      // This is just some funky selector drilling - not flexible
      & > path, & > g > path { fill: var(--v-black-base); }
    }
  }
}
</style>
