<template>
  <div class="navbar-link">
    <router-link
      v-slot="{ href, isActive, navigate }"
      :to="to"
    >
      <v-btn
        v-bind="$attrs"
        class="navbar-link__btn"
        text
        :ripple="false"
        :href="href"
        :color="(isActive) ? 'secondary' : ''"
        @click="navigate"
      >
        {{ label }}
      </v-btn>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'NavbarLink',
  components: {},
})
export class NavbarLink extends Vue {
  @Prop({ required: true, default: 'Link' })
  private readonly label!: string;

  @Prop({ required: true, default: null })
  private readonly to!: any;
}

export default NavbarLink;
</script>

<style lang="scss">
.navbar-link {
  &__btn {
    height: 100%;
    border-radius: 0;
  }
  .navbar-link__btn.v-btn.v-btn--flat.v-btn--text.v-size--default {
    min-width: 100%;
    width: 100%;
    height: 100%;
    padding: 0.5vw 1vw;
  }
}
</style>
