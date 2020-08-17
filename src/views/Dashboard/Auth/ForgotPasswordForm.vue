<template>
  <v-row
    align="center"
    justify="center"
    class="d-flex flex-column"
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
      <div class="dashboard-forgot-password__wrapper">
        <div class="dashboard-forgot-password">
          <v-card class="elevation-12">
            <v-toolbar
              color="primary"
              dark
              flat
            >
              <span class="headline">Forgot Password</span>
              <v-spacer />
              <v-toolbar-title>{{ applicationName }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <span><p class="text-center">{{ instructionMessage }}</p></span>
              <v-form
                v-model="form.valid"
                @submit.prevent
              >
                <v-text-field
                  id="email"
                  ref="email"
                  v-model="form.email"
                  label="Email"
                  name="email"
                  :rules="[form.rules.required, form.rules.email]"
                  prepend-icon="mdi-mail"
                  type="text"
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
                @click="sendPasswordResetEmail"
              >
                Reset
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-snackbar
            v-model="isSnackbarVisible"
            class="dashboard-forgot-password__snackbar"
            top
            color="error"
          >
            <v-icon>mdi-alert-circle</v-icon>
            Error: {{ error }}
          </v-snackbar>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import constants from '@/constants.json';
import { Vue, Component } from 'vue-property-decorator';
import { AuthService } from '@/services';
import { Logger } from '@/tools';

@Component({
  name: 'ForgotPasswordForm',
})
export default class ForgotPasswordForm extends Vue {

  private readonly authService = AuthService.getInstance();

  instructionMessage = 'Enter your account\'s email address below to reset your password:';

  form = {
    email: '',
    valid: false,
    rules: {
      required: (value: string) => !!value || 'Required',
      email: (value: string) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail';
      },
    },
  };

  applicationName = constants.appName;

  error = '';

  isSnackbarVisible = false;

  loading = false;

  isSuccessAlertVisible = false;

  strings = {
    success: 'Please check your inbox (or spam folder) for a password reset email',
  };

  isSubmitted = false;

  /**
   * When enter key pressed in forgot password form:
   * focus email input, or send reset password email.
   * @e KeyboardEvent
   */
  onKeyup(e: KeyboardEvent) {
    if (e.key !== 'Enter') {
      return;
    }
    if ((e.target as HTMLElement).id === 'email'
        && !this.loading
        && !this.isSubmitted) {
      this.sendPasswordResetEmail();
      return;
    }
    (this.$refs.email as any).focus(); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  /**
   * send reset password email.
   */
  async sendPasswordResetEmail() {
    if (!this.form.valid) {
      return;
    }

    this.loading = true;
    try {
      await this.authService.sendPasswordResetEmail(this.form.email);
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
}
</script>

<style lang="scss">
.dashboard-forgot-password {
  &__snackbar {
    // moves snackbar some 25% down on full height
    height: 50%;

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
