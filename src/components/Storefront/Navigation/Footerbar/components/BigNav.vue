<template>
  <div class="big-nav">
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
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import links from '@/components/Storefront/Navigation/storefront-links';

@Component({
  name: 'BigNav',
  components: {},
})
export class BigNav extends Vue {
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

export default BigNav;
</script>

<style lang="scss">
$borderStyle: solid;
$borderWidth: 0.5vw;

// TODO Increase specificity to avoid "!important"
@mixin override-dimensions {
  width: 100% !important;
  height: 101% !important; // There is a fucking gap I can't fix so, 101% just needs to happen.
}

.big-nav {
  grid-area: big-nav;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-top-color: var(--v-black-base);
  border-top-style: $borderStyle;
  border-top-width: $borderWidth;
  border-bottom-color: var(--v-black-base);
  border-bottom-style: $borderStyle;
  border-bottom-width: $borderWidth;

  &__link {
    @include override-dimensions;
    &:not(:last-child) {
      border-right-color: var(--v-black-base);
      border-right-style: $borderStyle;
      border-right-width: $borderWidth;
    }
  }
  &__link-btn {
    @include override-dimensions;
    & > .v-btn__content {
      font-size: 1.75vw;
    }
  }
}
</style>
