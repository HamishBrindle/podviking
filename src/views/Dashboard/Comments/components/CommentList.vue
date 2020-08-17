<template>
  <div class="comment-list__wrapper">
    <v-list
      class="comment-list"
      three-line
      flat
      avatar
    >
      <transition-group name="slide">
        <div
          v-for="comment in comments"
          :key="comment.id"
        >
          <comment :comment="comment" />
          <v-divider />
        </div>
      </transition-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Comment as CommentModel } from '@/models/internal';
import Comment from '@/views/Dashboard/Comments/components/Comment.vue';

@Component({
  name: 'CommentList',
  components: {
    Comment,
  },
})
export default class CommentList extends Vue {
  @Prop({ required: true, default: () => ([]) })
  private readonly comments!: CommentModel[]
}
</script>

<style lang="scss">
.comment-list {
  position: relative;
  & > .comment__wrapper:not(:first-child) {
    margin-top: 1rem;
  }
  & > .comment__wrapper:not(:last-child) {
    &::after {
      content: " ";
      height: 1px;
      bottom: -4px;
      width: 100%;
      background: rgb(230, 229, 229);
    }
  }
}
</style>
