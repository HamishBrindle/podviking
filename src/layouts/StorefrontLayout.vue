<template>
  <div class="storefront-layout">
    <div :class="{ wipe : true, 'wipe--animate': transitioning }" />

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
          :duration="{ enter: 500, leave: 500 }"
        >
          <slot />
        </transition>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer
      padless
      width="100vw"
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
import { Sync } from 'vuex-pathify';
import { Soundbar } from '@/components/Storefront/Sound/Soundbar/Soundbar.vue';
import { Navbar } from '@/components/Storefront/Navigation/Navbar/Navbar.vue';
import { Footerbar } from '@/components/Storefront/Navigation/Footerbar/Footerbar.vue';

@Component({
  name: 'StorefrontLayout',
  components: {
    Navbar,
    Soundbar,
    Footerbar,
  },
})

/* eslint-disable class-methods-use-this */

export default class StorefrontLayout extends Vue {
  @Sync('context/ui@dark')
  protected isDarkTheme!: boolean;

  @Sync('context/ui@transitioning')
  protected transitioning!: boolean;

  mounted() {
    this.isDarkTheme = false;
    this.transitioning = true;
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

$wipeAnimationTime: 1000ms;

.wipe {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background: var(--v-primary-base);
  color: var(--v-primary-base);
  // transform: translateX(-120%) skewX(20deg);
  display: none;
}

.wipe--animate {
  display: block;
  animation-timing-function: ease-in-out;
  animation-name: wipeAnimation;
  animation-duration: $wipeAnimationTime;
  // animation-timing-function: ease-in;
  animation-delay: 0;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-direction: normal;
}

// @keyframes wipeStart {
//   from {
//     transform: translateX(-120%) skewX(20deg);
//   }
//   to {
//     transform: translateX(0%) skewX(0);
//   }
// }
// @keyframes wipeFinish {
//   from {
//     transform: translateX(0%) skewX(0);
//   }
//   to {
//     transform: translateX(120%) skewX(-20deg);
//   }
// }

@keyframes wipeAnimation {
  0% {
    transform: translateX(-120%) skewX(20deg);
  }
  50% {
    transform: translateX(0%) skewX(0);
  }
  100% {
    transform: translateX(120%) skewX(-20deg);
  }
}

// .wipe--leave-active {
//   @include wipeEl;

//     transition: all $wipeAnimationTime ease-in-out;

//     animation-name: wipeStart;
//     animation-duration: $wipeAnimationTime / 2;
//     animation-timing-function: ease-in;
//     animation-delay: 0;
//     animation-iteration-count: 1;
//     animation-fill-mode: forwards;
//     animation-direction: normal;

// }

// .wipe--enter-active {
//   @include wipeEl;
//     transition: all $wipeAnimationTime ease-in-out;

//     animation-name: wipeFinish;
//     animation-duration: $wipeAnimationTime / 2;
//     animation-timing-function: ease-out;
//     animation-delay: 0;
//     animation-iteration-count: 1;
//     animation-fill-mode: forwards;
//     animation-direction: normal;

// }

</style>
