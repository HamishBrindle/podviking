<template>
  <div class="markdown__wrapper">
    <v-card class="markdown">
      <popout-button
        v-if="!popped && popoutHref"
        :href="popoutHref"
      />
      <v-card-text>
        <div
          class="content"
          v-html="html"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Logger from '@/tools/Logger';
import PopoutButton from '@/views/Dashboard/Docs/components/PopoutButton.vue';

@Component({
  name: 'Markdown',
  components: {
    PopoutButton,
  },
})
export default class Markdown extends Vue {
  private html = '';

  @Prop({ required: false, default: false })
  private readonly popped!: boolean;

  @Prop({ required: true, default: '' })
  private readonly doc!: string;

  /**
   * Resolved router link to open in popout
   */
  private popoutHref = '';

  created() {
    try {
      if (!this.doc) throw Error('Unable to render view without `doc` prop');
      this.html = require(`@/docs/${this.doc}.md`);
    } catch (error) {
      Logger.error(error);
      this.$router.push({ name: 'error' });
    }
  }

  mounted() {
    const resolved = this.$router.resolve({
      name: 'docs-md',
      params: {
        doc: this.doc,
      },
      query: {
        popped: 'yes',
      },
    });
    this.popoutHref = resolved.href;
  }
}
</script>

<style lang="scss">
.markdown {
  position: relative;
  max-width: 56.25rem;
  &__wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .popout-button {
    $pad: 0.5rem;
    position: absolute;
    top: $pad;
    right: $pad;
  }
  // Apply a hash-link padding to our element so it doesn't
  // butt-up with top of the browser window
  h1, h2, h3, h4, h5 {
    $offset: 8rem;
    &::before {
      display: block;
      content: " ";
      margin-top: -$offset;
      height: $offset;
      visibility: hidden;
      pointer-events: none;
    }
  }
  h1:first-of-type {
    margin-bottom: 1rem;
  }
  h1:not(:first-of-type) {
    margin: 2rem 0;
  }
  h2 {
    margin: 1.5rem 0;
  }
  img {
    width: 100%;
    max-width: 37.5rem;
    margin: 1rem 0;
  }
}
</style>
