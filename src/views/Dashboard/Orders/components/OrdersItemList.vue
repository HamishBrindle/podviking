<template>
  <div class="orders-item-list__wrapper">
    <div class="orders-item-list">
      <div
        v-for="(section, key) in sections"
        :key="key"
        class="orders-item-list__table"
      >
        <v-data-table
          :headers="headers"
          :items="section"
          group-by="category"
          class="orders-item-list elevation-0 outlined my-8"
          disable-pagination
          disable-sort
          disable-filtering
          hide-default-footer
        >
          <!-- Section Table Header -->
          <template slot="top">
            <div>
              <!-- <span class="body-1 font-weight-bold">{{ titleCase(key) }}:</span>&nbsp; -->
              <span class="body-1 font-weight-bold">{{ mapSection(key) }}</span>
            </div>
          </template>

          <!-- Image -->
          <template v-slot:item.image="{ item }">
            <v-avatar
              width="12rem"
              height="12rem"
              class="elevation-2 my-4"
            >
              <!-- If the image is provided... -->
              <v-img
                v-if="item.image"
                :src="item.image"
              />
              <!-- Else render a blown up icon -->
              <v-icon
                v-else
                x-large
              >
                mdi-image
              </v-icon>
            </v-avatar>
          </template>

          <!-- Item Details -->
          <template v-slot:item.details="{ item }">
            <orders-item-details :item="item" />
          </template>

          <!-- Quantity Input -->
          <template v-slot:item.quantity="{ item }">
            <v-text-field
              v-model="item.quantity"
              type="number"
              outlined
              :error="item.quantity < 0"
              :disabled="disabled"
              style="width: 8rem;"
              class="mt-7"
            />
          </template>

          <template v-slot:group.header="{ group, headers, isOpen, toggle }">
            <td>
              <v-btn
                v-if="isOpen"
                text
                fab
                small
                @click="toggle"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <v-btn
                v-else
                text
                fab
                small
                @click="toggle"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </td>
            <td colspan="2">
              <span class="text-body-2">{{ group }}</span>
            </td>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import OrdersItemDetails from './OrdersItemDetails.vue';
import { Sku } from '@/models/internal';
import groupBy from 'lodash/groupBy';
import { DataTableHeader } from 'vuetify';
import util from '@/tools/Utilities';

@Component({
  name: 'OrdersItemList',
  components: {
    OrdersItemDetails,
  },
})
export default class OrdersItemList extends Vue {
  /**
   * List of Order Items
   */
  @Prop({ required: false, default: [] })
  items!: Array<Sku>;

  /**
   * Disables all the input fields in the list
   */
  @Prop({ required: false, default: () => [] })
  hideSections!: string[];

  /**
   * Disables all the input fields in the list
   */
  @Prop({ required: false, default: false })
  disabled!: boolean;

  /**
   * Headers for each table group
   */
  headers: DataTableHeader[] = [
    { text: 'Image', value: 'image', width: 200 },
    { text: 'Category', value: 'category', width: 100 },
    { text: 'Details', value: 'details' },
    { text: 'Quantity', value: 'quantity', width: 100 },
  ];

  /**
   * All the grouped sections of the form after removing
   * any sections specified for "hiding"
   */
  private get sections() {
    const allSections = groupBy(this.items, 'form_section');
    const showSections: { [key: string]: any } = {};
    Object.keys(allSections).forEach((s) => {
      if (!this.hideSections.includes(s)) showSections[s] = allSections[s];
    });
    return showSections;
  }

  /**
   * Map a key to a label for displaying each group's form
   * section
   */
  private mapSection(key: string): string {
    switch (key) {
    case 'part_a':
      return 'PPE Supplies from Warehouse';
    // case 'part_b':
    //   return 'COVID-19 Viral Swabs';
    case 'part_c':
      return 'N95 Masks';
    default:
      return '?';
    }
  }

  /**
   * TitleCase string mutator
   */
  private titleCase(input: string): string {
    return util.titleCase(input);
  }
}
</script>

<style lang="scss">
.orders-item-list {
  .theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    &:hover { background: none }
  }
}
</style>
