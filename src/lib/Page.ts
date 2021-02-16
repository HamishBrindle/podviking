import Vue from 'vue';
import { VuetifyThemeVariant } from 'vuetify/types/services/theme.d';

export abstract class Page extends Vue {
  protected abstract theme: Partial<VuetifyThemeVariant>;

  /**
   * Vue's `mounted` lifecycle callback. Pages **must** call `init` in the
   * `mounted` lifecycle function for the sake of setting up the theme, etc.
   */
  public abstract mounted(): void;

  protected getTheme() {
    return this.theme;
  }

  protected async setTheme(theme: Partial<VuetifyThemeVariant> = {}): Promise<void> {
    return this.$store.dispatch('context/setTheme', theme);
  }

  protected async init() {
    this.setTheme(this.theme);
  }
}

export default Page;
