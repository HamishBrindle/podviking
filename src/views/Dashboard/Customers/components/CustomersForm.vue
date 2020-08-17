<template>
  <v-form
    ref="form"
    v-model="valid"
    class="customers-form px-4"
    lazy-validation
  >
    <form-base
      id="customer-form"
      :col="{ cols: 12, md: 6 }"
      :model.sync="model"
      :schema="schema"
    />

    <v-row justify="end">
      <v-btn
        text
        color="primary"
        class="mx-2"
        @click="reset"
      >
        Reset Form
      </v-btn>
      <v-btn
        color="success"
        @click="save"
      >
        Save
      </v-btn>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop } from 'vue-property-decorator';
import { Customer } from '@/models/internal';
import FormBase from '@/components/FormBase/FormBase.vue';
import { FormBaseSchema } from '../../../../lib/types';
import { IFormValidator } from '@/lib/interfaces';

@Component({
  name: 'CustomersForm',
  components: {
    FormBase,
  },
})
export default class CustomersForm extends Vue implements IFormValidator {
  @Prop({ required: true })
  model!: Customer;

  @Prop({ required: true })
  readonly schema!: FormBaseSchema;

  @Prop({ required: false, default: () => ({ cols: 12, md: 6 }) })
  readonly col!: any;

  @Ref('form')
  readonly formRef!: any;

  valid = false;

  validate(): boolean {
    return this.formRef.validate();
  }

  resetValidation(): void {
    return this.formRef.resetValidation();
  }

  reset(): void {
    this.formRef.reset();
  }

  /**
   * Validate form then emit save event when button is clicked
   */
  save(): boolean {
    const valid = this.validate();
    if (!valid) return false;
    this.$emit('save', this.model);
    return true;
  }
}
</script>

<style>

</style>
