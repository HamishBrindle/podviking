,<template>
  <div class="comment-create-field">
    <div class="d-flex align-start">
      <div class="comment-create-field__avatar">
        <v-img
          v-if="user.avatar"
          :src="user.avatar"
        />
        <v-icon x-large>
          mdi-account
        </v-icon>
      </div>
      <v-text-field
        ref="input"
        v-model="value"
        placeholder="Have something to say? Leave it here!"
        outlined
        class="ml-4"
        :counter="500"
        :rules="rules"
        @input="input"
        @keyup="keyup"
      >
        <template v-slot:append>
          <v-fade-transition leave-absolute>
            <v-progress-circular
              v-if="loading"
              size="24"
              color="info"
              indeterminate
            />
            <v-btn
              v-else
              elevation="0"
              color="primary"
              fab
              width="24"
              height="24"
              alt="Submit comment"
              :disabled="invalid"
              @click="submit"
            >
              <v-icon x-small>
                mdi-send
              </v-icon>
            </v-btn>
          </v-fade-transition>
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { UserService } from '@/services/UserService';
import { User } from '@/models/internal';
import { InputValidationRule } from 'vuetify';

@Component({
  name: 'CommentCreateField',
})
export default class CommentCreateField extends Vue {
  @Prop({ required: false, default: false })
  private readonly loading!: boolean;

  @Ref('input')
  private readonly inputRef!: any;

  private readonly userService: UserService = UserService.getInstance();

  private readonly user: User = this.userService.getActive() as User;

  /**
   * Max character count for the input field
   */
  private counter = 500;

  /**
   * Starting value of input field
   */
  private value = '';

  /**
   * Validation state for input field
   */
  private invalid = true;

  /**
   * Rules for validating the input field's text
   */
  private rules: InputValidationRule[] = [
    (value) => !!value || 'Comment must be provided before submitting',
    (value) => value.length > 0 || 'Comment must contain at least one character',
    (value) => value.length <= 500 || 'Comment cannot be longer than 500 characters',
  ];

  /**
   * Input event (any change to value) callback for input field
   */
  private input(): void {
    this.invalid = !this.rules.every((cb) => cb(this.value) === true);
  }

  /**
   * Submit event callback, emits an event of `submit`
   */
  private submit(): void {
    this.$emit('submit', this.value);
    this.value = '';
    this.$nextTick(() => {
      this.inputRef.resetValidation();
      this.invalid = true;
    });
  }

  /**
   * Keyup event callback for input field
   */
  private keyup(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }
    this.submit();
  }
}
</script>

<style lang="scss">
.comment-create-field {
  &__input {
    margin-top: 2rem;
  }
  &__avatar {
    & > i {
      font-size: 55px !important;
    }
  }
}
</style>
