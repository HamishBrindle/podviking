<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <div class="comment-create-dialog__wrapper">
      <div class="comment-create-dialog">
        <v-card>
          <v-card-title>
            <span class="headline">Comment</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.comment"
                    name="confirmation-comment"
                    label="Leave a Comment"
                    :error="!form.comment"
                    hint="Please provide a comment for this change"
                    validate-on-blur
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary darken-1"
              text
              @click="cancel"
            >
              {{ cancelText }}
            </v-btn>
            <v-btn
              color="primary darken-1"
              text
              @click="confirm"
            >
              {{ confirmText }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { LazyPromise } from '@/lib/LazyPromise';

@Component({
  name: 'CommentCreateDialog',
})
export default class CommentCreateDialog extends Vue {
  /**
   * Promise for resolving a value through asynchronously
   */
  @Prop({ required: true, default: undefined })
  private readonly promise!: LazyPromise<any>;

  /**
   * Confirmation text for dialog-form's affirmative action
   */
  @Prop({ required: false, default: 'Confirm' })
  private readonly confirmText!: string;

  /**
   * Cancellation text for dialog-form's negative action
   */
  @Prop({ required: false, default: 'Cancel' })
  private readonly cancelText!: string;

  /**
   * Show dialog modal
   */
  private dialog = true;

  /**
   * Dialog form data
   */
  form: any = {
    comment: '',
  }

  confirm() {
    this.dialog = false;
    this.promise.resolve(this.form);
  }

  cancel() {
    this.dialog = false;
    this.promise.reject();
  }
}
</script>

<style lang="scss">
.comment-create-dialog {}
</style>
