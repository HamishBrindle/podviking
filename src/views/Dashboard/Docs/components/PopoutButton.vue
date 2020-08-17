<template>
  <div class="popout-button">
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn
          text
          color="primary"
          class="markdown__pop-btn"
          v-on="on"
          @click="onClickOpen"
        >
          <v-icon>
            {{ icon }}
          </v-icon>
        </v-btn>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

@Component({
  name: 'PopoutButton',
})
export default class PopoutButton extends Vue {
  @Prop({ required: true, default: '' })
  private readonly href!: string;

  @Prop({ required: false, default: 'Popout' })
  private readonly tooltip!: string;

  @Prop({ required: false, default: 800 })
  private readonly height!: number;

  @Prop({ required: false, default: 700 })
  private readonly width!: number;

  @Prop({ required: false, default: 50 })
  private readonly left!: number;

  @Prop({ required: false, default: 50 })
  private readonly top!: number;

  @Prop({ required: false, default: true })
  private readonly resizable!: boolean;

  @Prop({ required: false, default: true })
  private readonly scrollbars!: boolean;

  @Prop({ required: false, default: true })
  private readonly toolbar!: boolean;

  @Prop({ required: false, default: false })
  private readonly menubar!: boolean;

  @Prop({ required: false, default: false })
  private readonly location!: boolean;

  @Prop({ required: false, default: false })
  private readonly directories!: boolean;

  @Prop({ required: false, default: true })
  private readonly status!: boolean;

  @Prop({ required: false, default: 'mdi-open-in-new' })
  private readonly icon!: string;

  @Emit('opened')
  private onClickOpen(event: Event) {
    if (!this.href) throw Error('Unable to popout - invalid `href` prop: ' + this.href);
    const options = [
      `height=${this.height}`,
      `width=${this.width}`,
      `left=${this.left}`,
      `top=${this.top}`,
      `resizable=${(this.resizable) ? 'no' : 'yes'}`,
      `scrollbars=${(this.scrollbars) ? 'no' : 'yes'}`,
      `toolbar=${(this.toolbar) ? 'no' : 'yes'}`,
      `menubar=${(this.menubar) ? 'no' : 'yes'}`,
      `location=${(this.location) ? 'no' : 'yes'}`,
      `directories=${(this.directories) ? 'no' : 'yes'}`,
      `status=${(this.status) ? 'no' : 'yes'}`,
    ];
    window.open(
      this.href,
      'Dashboard Popout',
      options.join(','),
    );

    event.preventDefault();
  }
}
</script>

<style lang="scss">
// .popout-button {}
</style>
