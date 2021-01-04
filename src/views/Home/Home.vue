<template>
  <div class="home__wrapper">
    <div class="home">
      <song-slider class="home__song-slider" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { SongSlider } from './components/SongSlider/SongSlider.vue';
@Component({
  name: 'Home',
  components: {
    SongSlider,
  },
})
export class Home extends Vue {

}

export default Home;
</script>

<style lang="scss">
.home {
  &__song-slider {
    margin: 2vw 0 5vw;
  }
}
</style>
