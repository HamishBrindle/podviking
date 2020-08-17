<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      class="d-flex flex-column align-center"
    >
      <v-progress-circular
        color="primary"
        size="48"
        indeterminate
      />
      <span class="mt-8 text-h5">Confirming Registration</span>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AuthService } from '@/services';
import { Logger } from '@/tools';

@Component({
  name: 'ConfirmRegistration',
})
export default class ConfirmationRegistration extends Vue {
  @Prop({ required: true })
  private readonly confirmationToken!: string

  /**
   * User Service for handling login requests and auth storage
   */
  private readonly authService: AuthService = AuthService.getInstance();

  created() {
    this.validateConfirmationToken();
  }

  /**
   * Validate confirmation token and navigate to home.
   */
  async validateConfirmationToken() {
    try {
      await this.authService.confirmRegistrationThenlogin(this.confirmationToken);
      this.$router.push({ name: 'orders-list' });
    } catch (error) {
      Logger.error(error.message);
      this.$router.push({ name: 'login' });
    }
  }
}
</script>

<style lang="scss">

</style>
