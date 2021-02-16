<template>
  <div class="contact__wrapper">
    <div class="contact">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Page } from '@/lib/Page';
import { palette } from '@/plugins/vuetify';
import { Component } from 'vue-property-decorator';
import { VuetifyThemeVariant } from 'vuetify/types/services/theme.d';

@Component({
  name: 'Contact',
  components: {},
})
export default class Contact extends Page {
  protected theme: Partial<VuetifyThemeVariant> = {
    background: palette.white,
    primary: palette.bittersweet,
    secondary: palette.jet,
    black: palette.jet,
    white: palette.bittersweet,
  };

  public mounted(): void {
    this.init();
  }
}
</script>

<style lang="scss">
// .contact {}
</style>
