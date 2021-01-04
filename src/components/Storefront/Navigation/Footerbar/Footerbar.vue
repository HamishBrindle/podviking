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
import podvikingLogoUrl from '@/assets/images/svg/podviking_typeface_flat.svg';
import PaypalLogo from '@/assets/images/svg/prvdr_paypal.svg?inline';
import ShopifyLogo from '@/assets/images/svg/prvdr_shopify.svg?inline';
import MastercardLogo from '@/assets/images/svg/prvdr_mastercard.svg?inline';
import VisaLogo from '@/assets/images/svg/prvdr_visa.svg?inline';
import BigNav from '@/components/Storefront/Navigation/Footerbar/components/BigNav.vue';
import NewsletterForm from '@/components/Storefront/Navigation/Footerbar/components/NewsletterForm.vue';
import SiteNav from '@/components/Storefront/Navigation/Footerbar/components/SiteNav.vue';

@Component({
  name: 'Footerbar',
  components: {
    PaypalLogo,
    ShopifyLogo,
    MastercardLogo,
    VisaLogo,
    BigNav,
    NewsletterForm,
    SiteNav,
  },
})
export class Footerbar extends Vue {
  /**
   * URL for the Brand's typeface
   */
  @Prop({ required: false, default: podvikingLogoUrl })
  private readonly podvikingLogoUrl!: string;

  /**
   * Current year
   */
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
    .stamp__providers > * { margin: 0 0.3vw }
  }
}
</style>
