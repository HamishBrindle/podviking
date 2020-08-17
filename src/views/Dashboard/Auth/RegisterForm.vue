<template>
  <div class="register-form__wrapper">
    <div class="register-form">
      <v-row
        class="d-flex flex-column"
        align="center"
        justify="center"
      >
        <v-col cols="auto">
          <!-- Success Alert -->
          <v-alert
            v-model="isSuccessAlertVisible"
            color="warning"
            dark
            icon="mdi-alert"
            border="left"
            prominent
          >
            <div class="title">
              {{ strings.success }}
            </div>
          </v-alert>
        </v-col>
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <div class="register-form">
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <span class="headline">Sign Up</span>
                <v-spacer />
                <v-toolbar-title>{{ applicationName }}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form
                  v-model="form.valid"
                >
                  <v-text-field
                    v-model="form.email"
                    label="Email"
                    name="email"
                    :rules="[form.rules.required, form.rules.email]"
                    prepend-icon="mdi-mail"
                    type="text"
                    @keyup="onKeyup"
                  />
                  <v-text-field
                    v-model="form.name"
                    label="Name"
                    name="name"
                    :rules="[form.rules.required, form.rules.name]"
                    prepend-icon="mdi-account"
                    type="text"
                    @keyup="onKeyup"
                  />
                  <v-text-field
                    id="password"
                    ref="password"
                    v-model="form.password"
                    label="Password"
                    name="password"
                    :rules="[form.rules.required, form.rules.counter]"
                    prepend-icon="mdi-lock"
                    type="password"
                    @keyup="onKeyup"
                  />
                  <v-text-field
                    id="passwordConfirmation"
                    ref="passwordConfirmation"
                    v-model="form.passwordConfirmation"
                    label="Confirm Password"
                    name="passwordConfirmation"
                    :rules="[form.rules.required, form.rules.counter]"
                    prepend-icon="mdi-lock"
                    type="password"
                    @keyup="onKeyup"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  text
                  depressed
                  large
                  :to="{ name: 'login'}"
                >
                  <v-icon>mdi-arrow-left</v-icon>
                  Login
                </v-btn>
                <v-spacer />
                <v-btn
                  :disabled="!form.valid || isSubmitted"
                  :loading="loading"
                  color="primary"
                  text
                  depressed
                  large
                  @click="register"
                >
                  Sign Up
                </v-btn>
              </v-card-actions>
            </v-card>
            <v-snackbar
              v-model="isSnackbarVisible"
              class="dashboard-register__snackbar"
              top
              color="error"
            >
              <v-icon>mdi-alert-circle</v-icon>
              Registration Error: {{ error }}
            </v-snackbar>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import constants from '@/constants.json';
import { AuthService } from '@/services';
import { Logger } from '@/tools';

@Component({
  name: 'RegisterForm',
})
export default class RegisterForm extends Vue {

  /**
   * User Service for handling login requests and auth storage
   */
  private readonly authService: AuthService = AuthService.getInstance();

  /**
   * Form data
   */
  private readonly form = {
    email: '',
    name: '',
    password: '',
    passwordConfirmation: '',
    valid: false,
    rules: {
      required: (value: string) => !!value || 'Required',
      counter: (value: string) => value.length >= 5 || 'Minimum 5 characters',
      email: (value: string) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail';
      },
      name: (value: string) => !!value,
    },
  };

  applicationName = constants.appName;

  error = '';

  isSnackbarVisible = false;

  loading = false;

  isSuccessAlertVisible = false;

  strings = {
    success: 'Please check your inbox (or spam folder) for a verification email to complete the sign up process',
  };

  isSubmitted = false;

  /**
   * When enter key pressed in register form: focus password input, or register
   */
  onKeyup(e: KeyboardEvent) {
    if (e.key !== 'Enter') {
      return;
    }
    if ((e.target as HTMLElement).id === 'passwordConfirmation') {
      this.register();
      return;
    }
    (this.$refs.password as any).focus(); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  /**
   * Login and navigate to home.
   */
  async register() {
    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    try {
      await this.authService.register(
        this.form.email,
        this.form.name,
        this.form.password,
        this.form.passwordConfirmation,
      );
      this.isSuccessAlertVisible = true;
      this.loading = false;
      this.isSubmitted = true;
    } catch (error) {
      Logger.error(error);
      this.error = error?.response?.data?.message ?? error.message;
      this.isSnackbarVisible = true;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }

  login() {
    this.$router.push({ name: 'login' });
  }
}
</script>

<style lang="scss">
.register-form {
  width: inherit;

  &__wrapper {
    width: 100%;
  }

  &__snackbar {
    & .v-icon {
      margin-right: 0.5rem;
    }

    & .v-snack__content {
      // left align text (defaults to space-between)
      justify-content: start;
    }
  }
}
</style>
