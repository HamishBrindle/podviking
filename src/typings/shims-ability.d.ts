/* eslint-disable @typescript-eslint/interface-name-prefix */

import Vue from 'vue';
import { AppAbility } from '@/lib/types';

declare module 'vue/types/vue' {
  interface Vue {
    $ability: AppAbility;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    ability?: AppAbility;
  }
}
