<template>
  <div class="social-icon-bar d-flex flex-row justify-space-between">
    <v-tooltip
      v-for="icon of icons"
      :key="icon.label"
      color="secondary"
      bottom
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="social-icon-bar__button"
          :ripple="false"
          fab
          elevation="0"
          text
          v-bind="attrs"
          v-on="on"
          @click="onClickIcon(icon)"
        >
          <img
            class="social-icon-bar__icon"
            :src="(dark) ? icon.srcDark : icon.srcLight"
            :alt="icon.label"
          >
        </v-btn>
      </template>
      <div class="primary--text font-weight-black">
        <span v-if="icon.comingSoon">Coming Soon</span>
        <span
          v-else
          v-text="icon.label"
        />
      </div>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import socialGithubWhite from '@/assets/img/svg/social_github_white.svg';
import socialInstagramWhite from '@/assets/img/svg/social_instagram_white.svg';
import socialSoundcloudWhite from '@/assets/img/svg/social_soundcloud_white.svg';
import socialYoutubeWhite from '@/assets/img/svg/social_youtube_white.svg';
import socialGithubBlack from '@/assets/img/svg/social_github_black.svg';
import socialInstagramBlack from '@/assets/img/svg/social_instagram_black.svg';
import socialSoundcloudBlack from '@/assets/img/svg/social_soundcloud_black.svg';
import socialYoutubeBlack from '@/assets/img/svg/social_youtube_black.svg';

@Component({
  name: 'SocialIconBar',
  components: {},
})
export class SocialIconBar extends Vue {
  @Prop({ required: false, default: 5 })
  protected readonly width!: number;

  @Prop({ required: false, default: 5 })
  protected readonly height!: number;

  @Prop({ required: false, default: false })
  protected readonly dark!: boolean;

  protected readonly icons = [
    {
      srcLight: socialGithubWhite,
      srcDark: socialGithubBlack,
      label: 'Github',
      href: 'https://github.com/hamishbrindle',
      comingSoon: false,
    },
    {
      srcLight: socialInstagramWhite,
      srcDark: socialInstagramBlack,
      label: 'Instagram',
      href: 'https://instragram.com/hamishbrindle',
      comingSoon: false,
    },
    {
      srcLight: socialSoundcloudWhite,
      srcDark: socialSoundcloudBlack,
      label: 'Soundcloud',
      href: 'https://soundcloud.com/youngxshameless',
      comingSoon: false,
    },
    {
      srcLight: socialYoutubeWhite,
      srcDark: socialYoutubeBlack,
      label: 'Youtube',
      href: 'https://youtube.com',
      comingSoon: false,
    },
  ];

  // eslint-disable-next-line class-methods-use-this
  protected onClickIcon(icon: any) {
    window.open(icon.href);
  }
}

export default SocialIconBar;
</script>

<style lang="scss">
.social-icon-bar {
  width: 100%;
  z-index: inherit;

  &__button,
  &__button > .v-btn__content {
    width: 6vw !important;
  }

  &__icon {
    z-index: inherit;
    width: 100%;
  }
}
</style>
