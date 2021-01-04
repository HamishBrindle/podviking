<template>
  <div class="newsletter-form">
    <div class="newsletter-form__label">
      <span class="text-h4 text-uppercase font-weight-black">
        Join our <br> quest.
      </span>
    </div>
    <v-form class="newsletter-form__form">
      <v-text-field
        placeholder="email"
        class="newsletter-form__field"
      >
        <template v-slot:append>
          <v-btn
            text
            class="newsletter-form__submit mb-2 text-lowercase"
          >
            Submit
          </v-btn>
        </template>
      </v-text-field>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'NewsletterForm',
  components: {},
})
export class NewsletterForm extends Vue {}

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
    border-color: inherit;
  }

  // TODO Fix specificity
  .newsletter-form__form > .newsletter-form__field >
  .v-input__control > .v-input__slot > .v-text-field__slot > input {
    font-size: 1vw;
    line-height: 1vw;
  }

  .newsletter-form__label > span {
    font-size: 1.87vw !important;
    line-height: 2.20vw !important;
  }
  .newsletter-form__submit > .v-btn__content { font-size: 1vw }
}
</style>
