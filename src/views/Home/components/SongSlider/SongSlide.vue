<template>
  <div class="song-slide__wrapper">
    <div
      ref="container"
      class="song-slide__container"
      @mouseenter.capture="onMouseEnter"
      @mouseleave.capture="onMouseLeave"
      @mousemove.capture="onMouseMove"
    >
      <div
        ref="inner"
        class="song-slide"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import { Mouse } from './Mouse';

@Component({
  name: 'SongSlide',
  components: {},
})
export class SongSlide extends Vue {
  @Ref('container')
  protected containerRef!: HTMLDivElement;

  @Ref('inner')
  protected innerRef!: HTMLDivElement;

  private counter = 0;

  private readonly updateDelay = 20;

  private readonly mouse = new Mouse();

  protected onMouseEnter(event: MouseEvent) {
    this.update(event);
  }

  protected onMouseLeave() {
    this.innerRef.style.transform = '';
  }

  protected onMouseMove(event: MouseEvent) {
    if (this.isTimeToUpdate()) {
      this.update(event);
    }
  }

  private isTimeToUpdate(): boolean {
    this.counter += 1;
    return this.counter % this.updateDelay === 0;
  }

  private update(event: MouseEvent) {
    this.mouse.updatePosition(this.containerRef, event);

    const y = (this.mouse.y / this.innerRef.offsetHeight / 2).toFixed(2);
    const x = (this.mouse.x / this.innerRef.offsetWidth / 2).toFixed(2);

    this.updateTransformStyle(x, y);
  }

  private updateTransformStyle(x: string, y: string): void {
    const style = `rotateX(${y}deg) rotateY(${x}deg)`;
    this.innerRef.style.transform = style;
  }
}

export default SongSlide;
</script>

<style lang="scss">
.song-slide {
  transition: transform 300ms ease-out;

  &__wrapper {
    margin: 1vw;
  }

  &__container {
    perspective: 1vw;
  }
}
</style>
