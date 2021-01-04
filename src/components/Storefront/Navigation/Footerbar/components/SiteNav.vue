<template>
  <div class="site-nav">
    <div
      v-for="section in navSections"
      :key="section.label"
      class="site-nav__section"
    >
      <p>{{ section.label }}</p>
      <router-link
        v-for="(link, idx) in section.links"
        :key="idx"
        v-slot="{ href }"
        :to="link.to"
      >
        <a
          class="site-nav__link"
          :href="href"
        >{{ link.label }}</a>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { NavigationLink } from '@/components/Storefront/Navigation/storefront-links';

@Component({
  name: 'SiteNav',
  components: {},
})
export class SiteNav extends Vue {
/**
   * Sections of the site navigation in the footer bar
   *
   * TODO Typing for external navigating (i.e. Instagram, Facebook)
   * TODO Pages for each of these lol
   */
  private readonly navSections: { label: string; links: NavigationLink[] }[] = [
    {
      label: 'Legal Info',
      links: [
        {
          label: 'Privacy Policy',
          to: { name: 'home' },
        }, {
          label: 'Terms & Conditions',
          to: { name: 'home' },
        }, {
          label: 'Return Policy',
          to: { name: 'home' },
        }, {
          label: 'Cookie Policy',
          to: { name: 'home' },
        }, {
          label: 'Gift Card',
          to: { name: 'home' },
        },
      ],
    }, {
      label: 'FAQ',
      links: [
        {
          label: 'Payments',
          to: { name: 'home' },
        }, {
          label: 'Subscribe To The Newsletter',
          to: { name: 'home' },
        },
      ],
    }, {
      label: 'Follow',
      links: [
        {
          label: 'Instagram',
          to: { name: 'home' },
        }, {
          label: 'Facebook',
          to: { name: 'home' },
        },
      ],
    }, {
      label: 'Help',
      links: [
        {
          label: 'Contact Us',
          to: { name: 'home' },
        },
      ],
    },
  ]
}

export default SiteNav;
</script>

<style lang="scss">
.site-nav {
  display: flex;
  width: 100%;
  flex-direction: column;
  flex-wrap: wrap;

  // Column Spacing
  & > div { margin: 0 0.88vw; }

  .site-nav__section {
    display: flex;
    flex-direction: column;
    font-size: 1vw;

    // Section header
    & > p {
      text-transform: uppercase;
      font-weight: bold;
    }
    & > * {
      margin: 0 0 0.22vw 0;
      text-align: right;
    }
    & > *:last-child {
      margin: 0 0 0.44vw 0;
    }
  }

  // TODO Pull this out into a basic anchor component
  .site-nav__link {
    text-decoration: none;
    transition: color 200ms ease-in-out;
    color: var(--v-black-base);
    &:hover {
      color: var(--v-black-lighten3);
    }
    &:active {
      color: var(--v-black-lighten5);
    }
  }
}
</style>
