import Vue from 'vue';
import { PartialVuetifyThemes } from '@/plugins/vuetify';

export abstract class Page extends Vue {
  public themes?: PartialVuetifyThemes;

  public getThemes() {
    return this.themes;
  }

  public setThemes(themes: PartialVuetifyThemes) {
    this.themes = themes;
  }
}

export default Page;
