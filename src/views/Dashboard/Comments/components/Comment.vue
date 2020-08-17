<template>
  <div class="comment__wrapper">
    <v-list-item class="comment">
      <v-list-item-avatar>
        <v-img
          v-if="author.image"
          :src="author.image"
        />
        <v-icon
          v-else
          x-large
        >
          mdi-account
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <div class="d-flex flex-column">
          <span class="font-weight-bold body-1 comment__author">
            {{ author.name }}
          </span>
          <span class="font-weight-light body-2 grey--text text--lighten-1">
            {{ date }} @ {{ time }}
          </span>
        </div>
        <div class="grey--text text--darken-2 my-4">
          {{ comment.body }}
        </div>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { Comment as CommentModel } from '@/models/internal';

@Component({
  name: 'Comment',
})
export default class Comment extends Vue {
  /**
   * Date format used to display date-strings from Comment
   */
  private static readonly COMMENT_DATE_FORMAT = 'YYYY-MM-DD';

  private static readonly COMMENT_TIME_FORMAT = 'h:mm a';

  @Prop({ required: true, default: () => ({}) })
  private readonly comment!: CommentModel;

  /**
   * Comment's Author
   */
  get author() {
    const author = this.comment.author;
    if (!author) return {};
    return author;
  }

  /**
   * Formatted date string
   */
  get date() {
    return moment(this.comment.created_at).format(Comment.COMMENT_DATE_FORMAT);
  }

  /**
   * Formatted date string
   */
  get time() {
    return moment(this.comment.created_at).format(Comment.COMMENT_TIME_FORMAT);
  }
}
</script>

<style lang="scss">
.comment {
  &__wrapper {
    position: relative;
  }
  &__author {
    flex: 1;
  }
  &__datetime {
    display: flex;
    justify-content: flex-start;
    & > span:not(:last-child) {
      padding-right: 1rem;
    }
  }
  &__body {
    margin: 1rem 0;
  }
}
</style>
