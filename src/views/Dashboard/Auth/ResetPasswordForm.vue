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
        color="success"
        dark
        icon="mdi-check-circle"
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
      <div class="dashboard-reset-password__wrapper">
        <div class="dashboard-reset-password">
          <v-card class="elevation-12">
            <v-toolbar
              color="primary"
              dark
              flat
            >
              <span class="headline">Reset Password</span>
              <v-spacer />
              <v-toolbar-title>{{ applicationName }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text v-if="resetPasswordToken">
              <span><p class="text-center">{{ instructionMessage }}</p></span>
              <v-form
                v-model="form.valid"
              >
                <v-text-field
                  id="password"
                  ref="password"
                  v-model="form.password"
                  label="New Password"
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
            <v-card-text v-else>
              <div class="body-1">
                {{ missingTokenMessage }}
              </div>
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
                v-if="resetPasswordToken"
                :disabled="!form.valid || isSubmitted"
                :loading="loading"
                color="primary"
                text
                depressed
                large
                @click="resetPassword"
              >
                Update
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-snackbar
            v-model="isSnackbarVisible"
            class="dashboard-reset-password__snackbar"
            top
            color="error"
          >
            <v-icon>mdi-alert-circle</v-icon>
            Reset Password Error: {{ error }}
          </v-snackbar>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import constants from '@/constants.json';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AuthService } from '@/services';
import { Logger } from '@/tools';

@Component({
  name: 'ResetPasswordForm',
})
export default class ResetPasswordForm extends Vue {
  @Prop({ required: true }) resetPasswordToken!: string;

  authService = AuthService.getInstance();

  instructionMessage = 'Enter your new password:';

  missingTokenMessage = 'Please use the password reset link sent to your email';

  form = {
    email: '',
    name: '',
    password: '',
    passwordConfirmation: '',
    valid: false,
    rules: {
      required: (value: string) => !!value || 'Required',
      counter: (value: string) => value.length >= 6 || 'Minimum 6 characters',
    },
  };

  applicationName = constants.appName;

  error = '';

  isSnackbarVisible = false;

  loading = false;

  isSuccessAlertVisible = false;

  strings = {
    success: 'Password successfully reset! Redirecting to login...',
  };

  isSubmitted = false;

  /**
   * When enter key pressed in reset password form: focus password input, or register.
   * @e KeyboardEvent
   */
  onKeyup(e: KeyboardEvent) {
    if (e.key !== 'Enter') {
      return;
    }
    if ((e.target as HTMLElement).id === 'passwordConfirmation'
        && !this.loading
        && !this.isSubmitted) {
      this.resetPassword();
      return;
    }
    (this.$refs.password as any).focus(); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  /**
   * reset password and navigate to login.
   */
  async resetPassword() {
    if (!this.form.valid) {
      return;
    }

    this.loading = true;
    try {
      await this.authService.resetPassword(
        this.resetPasswordToken,
        this.form.password,
        this.form.passwordConfirmation,
      );
      this.isSuccessAlertVisible = true;
      this.loading = false;
      this.isSubmitted = true;
      setTimeout(() => this.$router.push({ name: 'login' }), 3000);
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
.dashboard-reset-password {
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
