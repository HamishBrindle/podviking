<template>
  <div class="shop__wrapper">
    <div class="shop">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Page } from '@/lib/Page';
import { Component } from 'vue-property-decorator';
import { VuetifyThemeVariant } from 'vuetify/types/services/theme.d';

@Component({
  name: 'Shop',
  components: {},
})
export default class Shop extends Page {
  protected theme: Partial<VuetifyThemeVariant> = {};

  public mounted(): void {
    this.init();
  }
}
</script>

<style lang="scss">
// .shop {}
</style>
