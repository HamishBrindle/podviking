<template>
  <div class="logo__wrapper">
    <typeface
      height="100%"
      width="100%"
      view-box="0 0 100 100"
      preserve-aspect-ratio="none"
      class="logo"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Typeface from '@/assets/img/svg/podviking_typeface_flat.svg?inline';

@Component({
  name: 'Logo',
  components: {
    Typeface,
  },
})
export class Logo extends Vue {

}

export default Logo;
</script>

<style lang="scss">
.logo {
  width: inherit;
  height: inherit;

  &__wrapper {
    width: 100%;
    height: 100%;
  }

  // Logo coloring
  .cls-1 { fill: var(--v-primary-base) !important; }
  .cls-2 { fill: var(--v-secondary-base) !important; }
}
</style>
