<template>
  <div class="storefront-layout">
    <curtain class="storefront-layout__curtain" />

    <!-- Navigation -->
    <navbar />

    <!-- Main -->
    <v-main>
      <v-container
        class="storefront-layout__body"
        fluid
      >
        <transition
          mode="out-in"
          :duration="{ enter: transition.transitionTime / 2, leave: transition.transitionTime / 2 }"
        >
          <slot />
        </transition>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer
      padless
      width="100%"
      color="white"
    >
      <footerbar />
    </v-footer>

    <!-- Fixed Soundbar -->
    <soundbar class="storefront-layout__soundbar" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Get, Sync } from 'vuex-pathify';
import { Soundbar } from '@/components/Storefront/Sound/Soundbar/Soundbar.vue';
import { Navbar } from '@/components/Storefront/Navigation/Navbar/Navbar.vue';
import { Footerbar } from '@/components/Storefront/Navigation/Footerbar/Footerbar.vue';
import { Curtain } from '@/components/Curtain.vue';
import { IContextState } from '@/store/modules/context';

@Component({
  name: 'StorefrontLayout',
  components: {
    Navbar,
    Soundbar,
    Footerbar,
    Curtain,
  },
})
export default class StorefrontLayout extends Vue {
  @Sync('context/ui@dark')
  protected isDarkTheme!: boolean;

  @Get('context/transition')
  protected transition!: IContextState['transition'];

  mounted() {
    this.isDarkTheme = false;
  }
}
</script>

<style lang="scss">
.storefront-layout {
  height: 100%;
  position: relative;

  &__soundbar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>
