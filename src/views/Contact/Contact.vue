<template>
  <div class="contact__wrapper">
    <div class="contact">
      <!-- Title -->
      <h2 class="black--text font-weight-black text-center text-uppercase">
        Contact
      </h2>

      <!-- Header -->
      <div class="contact__header d-flex flex-row">
        <!-- Poddy -->
        <div class="contact__image">
          <img
            :src="logoBlackUrl"
            class="contact__logo"
          >
        </div>

        <div class="contact__instructions">
          <h3 class="font-weight-black">
            We want to hear from you.
          </h3>
          <p>Message us via the form here, or use our email</p>
          <p class="font-weight-bold">
            info@podviking.com
          </p>
        </div>

        <!-- Contact Form -->
        <div class="contact__form primary">
          <p class="contact__form__header">
            Please fill in the following fields
          </p>
          <form>
            <v-text-field
              v-model="form.name"
              class="contact__form__field"
              :error-messages="nameErrors"
              :counter="10"
              label="Name"
              required
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
            />
            <v-text-field
              v-model="form.email"
              class="contact__form__field"
              :error-messages="emailErrors"
              label="E-mail"
              required
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
            />

            <div
              :style="{ width: '100%' }"
              class="d-flex justify-end"
            >
              <v-btn
                outlined
                color="black"
                :style="{ 'margin-right': '1vw' }"
                @click="onClickSubmit"
              >
                submit
              </v-btn>
              <v-btn
                outlined
                color="black"
                @click="onClickClear"
              >
                clear
              </v-btn>
            </div>
          </form>
        </div>
        <!-- End of Contact Form -->
      </div>

      <!-- Social Icon-bar -->
      <div class="d-flex justify-center">
        <social-icon-bar
          dark
          class="contact__social-icon-bar"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Page } from '@/lib/Page';
import { palette } from '@/plugins/vuetify';
import { Component } from 'vue-property-decorator';
import { VuetifyThemeVariant } from 'vuetify/types/services/theme.d';
import logoBlackUrl from '@/assets/img/svg/pod_viking_logo_black_flat.svg';
import { validationMixin } from 'vuelidate';
import { required, maxLength, email } from 'vuelidate/lib/validators';
import { SocialIconBar } from '@/components/Storefront/SocialIconBar.vue';

@Component({
  name: 'Contact',
  components: {
    SocialIconBar,
  },
  mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(10) },
    email: { required, email },
  },
})
export default class Contact extends Page {
  protected theme: Partial<VuetifyThemeVariant> = {
    background: palette.white,
    primary: palette.bittersweet,
    secondary: palette.jet,
    black: palette.jet,
    white: palette.bittersweet,
  };

  protected readonly logoBlackUrl = logoBlackUrl;

  protected form = {
    name: '',
    email: '',
  }

  protected get nameErrors() {
    const errors: any = [];
    if (!this.$v.name.$dirty) return errors;
    if (!this.$v.name.maxLength) errors.push('Name must be at most 10 characters long');
    if (!this.$v.name.required) errors.push('Name is required.');
    return errors;
  }

  protected get emailErrors() {
    const errors: any = [];
    if (!this.$v.email.$dirty) return errors;
    if (!this.$v.email.email) errors.push('Must be valid e-mail');
    if (!this.$v.email.required) errors.push('E-mail is required');
    return errors;
  }

  public mounted(): void {
    this.init();
  }

  protected onClickSubmit() {
    console.log('onClickSubmit', this);
  }

  protected onClickClear() {
    console.log('onClickClear', this);
  }
}
</script>

<style lang="scss">
.contact {
  & > h2 {
    font-size: 5vw;
    font-weight: 900;
    margin-bottom: 5vw;
  }

  &__header {
    width: 100%;
    position: relative;
    z-index: 0;
    margin-bottom: 7vw;
    padding: 0 7vw;
  }

  &__image {
    opacity: 0.1;
    position: absolute;
    top: 0;
    left: 0;
  }

  &__instructions {
    width: 50%;
  }

  &__form {
    $borderWidth: 0.5vw;

    width: 50%;
    padding: 3vw;

    // Underline of the form
    .theme--light.v-text-field > .v-input__control > .v-input__slot:before,
    .theme--light.v-text-field > .v-input__control > .v-input__slot:after {
      border-width: $borderWidth;
      border-bottom: none;
      border-left: none;
      border-right: none;
      border-color: var(--v-black-base) !important;
    }

    &__field {
      margin-bottom: 1vw;
    }

    &__field > .v-input__control > .v-input__slot > .v-text-field__slot > input {
      color: var(--v-black-base);
      font-weight: 600;

      &::placeholder {
        color: var(--v-black-base);
        opacity: 1;
      }
    }

    &__field .v-messages,
    &__field > .v-input__control > .v-input__slot > .v-text-field__slot > label {
      color: var(--v-black-base) !important;
      font-weight: bold;
    }

  }

  &__social-icon-bar {
    z-index: 1;
    width: 40vw;
    margin-bottom: 6vw;
  }
}
</style>
