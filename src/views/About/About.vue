<template>
  <div class="about__wrapper">
    <div class="about">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable class-methods-use-this */

import { Component } from 'vue-property-decorator';
import { Page } from '@/lib/Page';
import { PartialVuetifyThemes } from '@/plugins/vuetify';

@Component({
  name: 'About',
  components: {},
})
export default class About extends Page {
  public themes: PartialVuetifyThemes = {
    light: {
      primary: '#238748',
    },
  }
}
</script>

<style lang="scss">
// .about {}
</style>
