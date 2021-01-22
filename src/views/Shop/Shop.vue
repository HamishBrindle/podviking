<template>
  <div class="shop__wrapper">
    <div class="shop">
      <router-view />
      <div class="something">
        p <br>
        p <br>
        p <br>
        p <br>
        p <br>
        p <br>
        p <br>
        p <br>
        p <br>
        p <br>
        p <br>
        p <br>
        p <br>
        p <br>
        p <br>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'Shop',
  components: {},
})
export default class Shop extends Vue {

}
</script>

<style lang="scss">
// .shop {}
</style>
