<template>
  <div class="licensing__wrapper">
    <div class="licensing">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Page } from '@/lib/Page';
import { Component } from 'vue-property-decorator';
import { VuetifyThemeVariant } from 'vuetify/types/services/theme.d';
import { palette } from '@/plugins/vuetify';

@Component({
  name: 'Licensing',
  components: {},
})
export default class Licensing extends Page {
    protected theme: Partial<VuetifyThemeVariant> = {
      background: palette.springGreen,
      primary: palette.jet,
      secondary: palette.white,
      black: palette.jet,
      white: palette.springGreen,
    };

    public mounted(): void {
      this.init();
    }
}
</script>

<style lang="scss">
// .licensing {}
</style>
