<template>
  <div
    :class="{
      'curtain__container': true,
      'slide-in': slideIn,
      'transitioning': waiting,
      'slide-out': slideOut,
    }"
  >
    <div class="curtain" />
  </div>
</template>

<script lang="ts">
import { IContextState } from '@/store/modules/context';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Sync } from 'vuex-pathify';

/**
 * TODO: Change curtain animation
 *
 * Idea is that the curtain will fade in as a blur filter. At the same time, Poddy is
 * fading into the foreground. Once visible, will surge out a circular div which grows
 * to fill the screen. Once the screen is fully filled, the exit animation begins as
 * Poddy spins-down into nothing while the circular div shrinks back down into oblivion -
 * revealing the new page as the blur filter subsides as well.
 *
 * CSS:
 *  -webkit-backdrop-filter: blur(10px);
 *  backdrop-filter: blur(10px);
 */

@Component({ name: 'Curtain' })
export class Curtain extends Vue {
  @Sync('context/transition')
  protected transition!: IContextState['transition'];

  @Watch('transition', { immediate: true, deep: true })
  protected watchLoading(transition: IContextState['transition']) {
    if (transition.isTransitioning) {
      this.slideIn = true;
      this.waiting = true;
      this.slideOut = false;
    } else {
      this.slideIn = false;
      this.waiting = false;
      this.slideOut = true;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.transition = { isTransitioning: false };
    }, this.transition.transitionTime ?? 0 / 2);
  }

  protected timeout: any = null;

  protected slideIn = true;

  protected waiting = true;

  protected slideOut = false;
}

export default Curtain;
</script>

<style lang="scss">
@import 'src/styles/variables';

// Colors
$startColor: var(--v-primary-base);
$endColor: var(--v-secondary-base);

// Speed
$slideSpeed: $transitionTime; // Slide in/out transition speed

// Transition
$slideTransition: ease-out;

// Scale - slide in/out SVG horizontal scaling on transition
$slideInScale: 1;
$slideOutScale: 2;

.curtain__container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden !important;
  z-index: 1;
  pointer-events: none;

  .curtain {
    background: $startColor;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    left: auto;
    width: 0;
    height: 100vh;
    -webkit-transition: all $slideSpeed $slideTransition;
    -moz-transition: all $slideSpeed $slideTransition;
    -o-transition: all $slideSpeed $slideTransition;
    transition: all $slideSpeed $slideTransition;
    pointer-events: all;
  }

  &.slide-in {
    .curtain {
      // background: $startColor;

      &:before {
        display: block;
        -moz-transform: scaleX($slideInScale);
        -webkit-transform: scaleX($slideInScale);
        -ms-transform: scaleX($slideInScale);
        -o-transform: scaleX($slideInScale);
        transform: scaleX($slideInScale);
      }
      &:after {
        display: block;
      }
      right: 0;
      left: auto;
      width: 150%;
    }
  }

  &.loading {
    .curtain {
      &:before {
        display: block;
      }
      &:after {
        display: block;
      }
      right: 0;
      left: auto;
      width: 150%;
    }
  }

  &.slide-out {
    .curtain {
      &:before {
        display: block;
      }
      &:after {
        display: block;
        -moz-transform: scaleX($slideOutScale);
        -webkit-transform: scaleX($slideOutScale);
        -ms-transform: scaleX($slideOutScale);
        -o-transform: scaleX($slideOutScale);
        transform: scaleX($slideOutScale);
      }
      right: auto;
      width: 0;
    }
  }
}
</style>
