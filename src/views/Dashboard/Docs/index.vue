<template>
  <div class="docs__wrapper">
    <div class="docs">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'Docs',
})
export default class Docs extends Vue {

}
</script>

<style lang="scss">
// .docs {}
</style>
