<template>
  <div class="big-nav">
    <div
      v-for="page in pages"
      :key="page.label"
      class="big-nav__link"
    >
      <v-btn
        class="big-nav__link-btn font-weight-black"
        color="black"
        text
        @click.once="goTo(page.to)"
      >
        {{ page.label }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import links, { NavigationLink } from '@/components/Storefront/Navigation/storefront-links';
import { RawLocation } from 'vue-router';
import { Sync } from 'vuex-pathify';
import { IContextState } from '@/store/modules/context';

@Component({
  name: 'BigNav',
  components: {},
})
export class BigNav extends Vue {
  @Sync('context/transition')
  protected transition!: IContextState['transition'];

  protected pages = links.slice(0, 3);

  @Watch('transition', { immediate: true, deep: true })
  protected watchTransition(transition: IContextState['transition']) {
    if (transition.isTransitioning) {
      setTimeout(() => { this.pages = this.getPages(); }, transition.transitionTime);
    }
  }

  /**
   * Get an array of navigation links based off what page we're currently on
   */
  protected getPages(): NavigationLink[] {
    if (this.$route.name === 'home') {
      return links.slice(0, 3);
    }

    return links.filter((link) => {
      if (!link.to?.name) throw Error('Route needs a `name` - please define in router');
      return link.to?.name !== this.$route.name;
    });
  }

  protected async goTo(to: RawLocation) {
    await this.$router.push(to);
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
    background: var(--v-white-base);
    &:not(:last-child) {
      border-right-color: var(--v-black-base);
      border-right-style: $borderStyle;
      border-right-width: $borderWidth;
    }
  }
  &__link-btn > .v-btn__content {
    font-size: 1.75vw;
  }
  &__link-btn.font-weight-black.v-btn.v-btn--flat.v-btn--text.v-size--default {
    width: 100% !important;
    height: 101% !important; // There is a fucking gap I can't fix so, 101% just needs to happen.
  }
}
</style>
