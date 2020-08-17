<template>
  <div class="orders-item">
    <div class="d-flex justify-space-between align-end mt-4">
      <span class="title font-weight-bold">{{ item.description[0] }}</span>
      <div>
        <v-chip
          v-if="available"
          class="ml-2"
          color="success"
          ripple
          small
        >
          <v-icon
            x-small
            class="pr-2"
          >
            mdi-check
          </v-icon>
          <span class="font-weight-bold">Available</span>
        </v-chip>
        <v-chip
          class="ml-2"
          color="primary"
          ripple
          small
        >
          <span class="font-weight-bold">{{ unit }}</span>
        </v-chip>
      </div>
    </div>

    <v-divider class="my-4" />

    <!-- Warning about maximum quantites allowed -->
    <div
      v-if="item.max_quantity"
      class="d-flex align-center body-2 my-4"
    >
      <v-icon color="warning">
        mdi-alert-circle-outline
      </v-icon>
      <p class="pl-1 mb-0">
        Max order quantity is
        <span class="font-weight-bold">{{ max }}</span>
      </p>
    </div>

    <!-- List of details about the item -->
    <div
      v-if="details"
      class="orders-item__list"
    >
      <p class="font-weight-bold overline mt-2 mb-0">
        Details
      </p>
      <v-list
        class="transparent order-item-list__specs pt-0"
        dense
      >
        <v-list-item
          v-for="detail in details"
          :key="detail"
          dense
        >
          <v-list-item-content>
            <span class="body-2">&#8226; {{ detail }}</span>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Sku } from '@/models/internal';

@Component({
  name: 'OrdersItemDetails',
})
export default class OrdersItemDetails extends Vue {
  /**
   * Order item, which is of type Sku
   */
  @Prop({ required: true, default: {} })
  public readonly item!: Sku;

  get min() {
    return 0;
  }

  get max() {
    return typeof this.item.max_quantity === 'string'
      ? this.item.max_quantity
      : `${this.item.max_quantity} units`;
  }

  get available(): boolean {
    // TODO: Availability status
    return true;
  }

  get unit() {
    const unitOfMeasureSize = this.item.unit_of_measure_size.split('=');
    let size = unitOfMeasureSize[1];
    if (!size) size = '1';
    const unitType = this.item.unit_of_measure_type?.toLocaleLowerCase();
    switch (unitType) {
    case 'canister':
      return 'Canisters';
    case 'box':
      return `Boxes of ${size}`;
    case 'case':
      return `Cases of ${size}`;
    case 'pack':
      return `Packs of ${size}`;
    case 'each':
    default:
      return 'Singles';
    }
  }

  get details(): (string | null)[] {
    const meditech = (this.item.meditech)
      ? `Meditech: ${this.item.meditech}`
      : null;

    const peoplesoft = (this.item.peoplesoft)
      ? `PeopleSoft: ${this.item.peoplesoft}`
      : null;

    return ([
      meditech,
      peoplesoft,
      ...this.item.description,
    ]).filter(Boolean);
  }
}
</script>

<style lang="scss">
.order-item {
  &__details {
    .v-list-item {
      min-height: 25px !important;
    }
    .v-list-item__content {
      padding: 0 !important;
    }
  }
}

// Vuetify Overrides
.theme--light.v-data-table
  tbody
  tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: transparent;
}
.v-chip {
  overflow: visible;
}
</style>
