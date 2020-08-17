<template>
  <div class="fluid-layout fill-height">
    <!-- Navigation -->
    <navigation-drawer v-model="drawer" />
    <app-bar v-model="drawer" />

    <!-- Dashboard Body -->
    <v-main ref="main">
      <v-container
        class="fluid-layout__body"
        fluid
      >
        <transition
          name="fade"
          mode="out-in"
        >
          <slot />
        </transition>
      </v-container>
    </v-main>

    <v-footer app>
      <span>{{ applicationName }} &copy; {{ year }}</span>
    </v-footer>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NavigationDrawer from '@/components/NavigationDrawer/NavigationDrawer.vue';
import AppBar from '@/components/AppBar/AppBar.vue';
import constants from '@/constants.json';

@Component({
  name: 'FluidLayout',
  components: {
    'navigation-drawer': NavigationDrawer,
    'app-bar': AppBar,
  },
})
export default class FluidLayout extends Vue {
  private drawer = false;

  private applicationName: string = constants.appName;

  private year: number = new Date().getFullYear();
}
</script>

<style lang="scss">
.fluid-layout {
  .v-main {
    height: 100%;
  }
  &__body {
    height: 100%;
  }
}
</style>
