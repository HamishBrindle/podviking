<template>
  <v-form
    ref="form"
    v-model="valid"
    class="draft-orders-form px-4"
    lazy-validation
  >
    <form-base
      id="draft-order-form"
      :col="{ cols: 12, md: 6 }"
      :model.sync="model"
      :schema="schema"
      :disabled="disabled"
    />
  </v-form>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop } from 'vue-property-decorator';
import { Order } from '@/models/internal';
import FormBase from '@/components/FormBase/FormBase.vue';
import { FormBaseSchema } from '@/lib/types';
import { IFormValidator } from '@/lib/interfaces';

@Component({
  name: 'OrdersForm',
  components: {
    FormBase,
  },
})
export default class OrdersForm extends Vue implements IFormValidator {
  @Ref('form')
  readonly formRef!: any

  @Prop({ required: true })
  readonly model!: Order;

  @Prop({ required: true })
  readonly schema!: FormBaseSchema;

  @Prop({ required: false, default: () => ({ cols: 12, md: 6 }) })
  readonly col!: any;

  @Prop({ required: false, default: false })
  readonly disabled!: boolean;

  valid = true;

  validate(): boolean {
    return this.formRef.validate();
  }

  resetValidation(): void {
    this.valid = true;
    return this.formRef.resetValidation();
  }

  reset(): void {
    this.valid = true;
    this.formRef.reset();
  }

  /**
   * Validate form then emit save event when button is clicked
   */
  save(): boolean {
    this.valid = this.validate();
    if (!this.valid) {
      this.$vuetify.goTo(this.formRef, {
        easing: 'easeInOutQuad',
      });
      return false;
    }
    this.$emit('save', this.model);
    return true;
  }
}
</script>
