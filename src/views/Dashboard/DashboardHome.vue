<template>
  <div class="dashboard-home__wrapper">
    <v-row>
      <v-col>
        <span class="display-1 font-weight-light">Overview</span>
      </v-col>
    </v-row>
    <v-row justify="start">
      <v-col
        v-for="card in reports"
        :key="card.title"
        sm="8"
        md="4"
      >
        <v-hover>
          <template v-slot:default="{ hover }">
            <v-card>
              <v-img
                class="white--text align-end"
                height="20rem"
                :src="card.image"
                contain
              />

              <v-card-title>{{ card.title }}</v-card-title>

              <v-card-subtitle class="pb-0">
                {{ card.category }}
              </v-card-subtitle>

              <v-card-text class="text--primary">
                <div>{{ card.body }}</div>
              </v-card-text>

              <v-fade-transition>
                <v-overlay
                  v-if="hover"
                  absolute
                  color="primary"
                >
                  <v-btn
                    v-for="{ action, title } in card.actions"
                    :key="title"
                    color="accent"
                    @click="() => $router.push({ name: action })"
                  >
                    {{ title }}
                  </v-btn>
                </v-overlay>
              </v-fade-transition>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import mockDataVis1 from '@/assets/placeholders/data-vis-1.png';
import mockDataVis2 from '@/assets/placeholders/data-vis-2.png';
import mockDataVis3 from '@/assets/placeholders/data-vis-3.png';
import mockDataVis4 from '@/assets/placeholders/data-vis-4.png';
import mockDataVis5 from '@/assets/placeholders/data-vis-5.png';
import constants from '@/constants.json';

export default {
  name: 'DashboardHome',
  data() {
    return {
      applicationName: constants.appName,
    };
  },
  computed: {
    reports() {
      return [
        {
          title: 'Order Summary',
          category: 'Report',
          image: mockDataVis1,
          body: 'Generate, export and visualize order summary',
          actions: [
            {
              title: 'View Report',
              action: 'order-summary',
            },
          ],
        },
        {
          title: 'PPE Supply By Category',
          category: 'Report',
          image: mockDataVis2,
          body: 'Organize and visualize supply data by category',
          actions: [
            {
              title: 'View Report',
              action: 'ppe-supply-by-category',
            },
          ],
        },
        {
          title: 'PPE Supply By SKU',
          category: 'Report',
          image: mockDataVis3,
          body: 'Organize and visualize supply data by SKU',
          actions: [
            {
              title: 'View Report',
              action: 'ppe-supply-by-sku',
            },
          ],
        },
        {
          title: 'PHSA Order Calculation',
          category: 'Report',
          image: mockDataVis4,
          body: 'Organize and visualize bi-weekly orders',
          actions: [
            {
              title: 'View Report',
              action: 'phsa-order-calculation',
            },
          ],
        },
        {
          title: 'EOC PPE Supply',
          category: 'Report',
          image: mockDataVis5,
          body: 'Custom categorization of PPE Supply for Regional EOC',
          actions: [
            {
              title: 'View Report',
              action: 'eoc-ppe-supply',
            },
          ],
        },
      ];
    },
  },
};
</script>
