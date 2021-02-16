<template>
  <div class="newsletter-form">
    <div
      :class="{
        'newsletter-form__label': true,
        'newsletter-form__label--left': labelPosition === 'left',
        'newsletter-form__label--right': labelPosition === 'right',
        'newsletter-form__label--small': labelSize === 'small',
        'newsletter-form__label--large': labelSize === 'large',
      }"
    >
      <span class="text-uppercase font-weight-black black--text">
        Join our <br> quest.
      </span>
    </div>
    <v-form class="newsletter-form__form">
      <v-text-field
        placeholder="email"
        class="newsletter-form__field"
        type="email"
      >
        <template v-slot:append>
          <v-btn
            text
            class="newsletter-form__submit mb-2 text-lowercase"
            color="black"
          >
            Submit
          </v-btn>
        </template>
      </v-text-field>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'NewsletterForm',
  components: {},
})
export class NewsletterForm extends Vue {
  @Prop({ required: false, default: 'small', validator: (prop: string) => ['small', 'large'].includes(prop) })
  protected readonly labelSize!: string;

  @Prop({ required: false, default: 'left', validator: (prop: string) => ['left', 'right'].includes(prop) })
  protected readonly labelPosition!: string;
}

export default NewsletterForm;
</script>

<style lang="scss">
$borderStyle: solid;
$borderWidth: 0.5vw;

.newsletter-form {
  // Underline of the form
  .theme--light.v-text-field > .v-input__control > .v-input__slot:before,
  .theme--light.v-text-field > .v-input__control > .v-input__slot:after {
    border-width: $borderWidth;
    border-bottom: none;
    border-left: none;
    border-right: none;
    border-color: var(--v-black-base) !important;
  }

  &__label--small > span {
    font-size: 1.87vw;
    line-height: 2.20vw;
  }

  &__label--large > span {
    font-size: 3vw;
    line-height: 3.2vw;
  }

  &__label--left {
    text-align: left;
  }

  &__label--right {
    text-align: right;
  }

  &__field > .v-input__control > .v-input__slot > .v-text-field__slot > input {
    color: var(--v-black-base);

    &::placeholder {
      color: var(--v-black-base);
      opacity: 0.5;
    }
  }
}
</style>
