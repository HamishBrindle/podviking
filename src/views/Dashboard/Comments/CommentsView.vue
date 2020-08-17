<template>
  <div class="comments-view__wrapper">
    <div
      ref="root"
      class="comments-view"
    >
      <template>
        <v-card
          class="pa-4"
          elevation="0"
          outlined
        >
          <v-row justify="space-between">
            <div>
              <v-card-title>
                <span>{{ title }}</span>
              </v-card-title>

              <v-card-text v-if="subtitle">
                <span class="body-1 grey--text text--darken-2">{{ subtitle }}</span>
              </v-card-text>
            </div>
          </v-row>

          <div v-if="data && data.length">
            <comment-list :comments="data" />
          </div>
          <div
            v-else
            class="d-flex align-center justify-center"
          >
            <span class="my-8 body-1 grey--text">
              There's nothing here yet 🤷
            </span>
          </div>
          <comment-create-field
            class="mt-8"
            :loading="loading.submit"
            @submit="submit"
          />
        </v-card>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { ICollectionView } from '@/lib/interfaces';
import { Comment } from '@/models/internal';
import { CommentService, UserService } from '@/services';
import { BaseModel } from '@/models/internal';
import CommentList from '@/views/Dashboard/Comments/components/CommentList.vue';
import CommentCreateField from '@/views/Dashboard/Comments/components/CommentCreateField.vue';
import Logger from '@/tools/Logger';
import { Loading } from '../../../lib/types';

@Component({
  name: 'CommentsView',
  components: {
    CommentList,
    CommentCreateField,
  },
})
export default class CommentsView<T extends BaseModel> extends Vue implements ICollectionView<Comment> {
  @Ref('root')
  private readonly rootRef!: Element;

  /**
   * Title of the Comments View displayed at top of the card
   */
  @Prop({ required: false, default: 'Comments' })
  private readonly title!: string;

  /**
   * Subtitle displayed at top of the card, underneath the title
   */
  @Prop({ required: false, default: '' })
  private readonly subtitle!: string;

  /**
   * ID of the Parent
   */
  @Prop({ required: true, default: 0 })
  private readonly parentId!: CommentsViewProps['parentId'];

  /**
   * Entity type of the Parent
   */
  @Prop({ required: true, default: '' })
  private readonly parentEntity!: CommentsViewProps['parentEntity'];

  /**
   * Comment Service
   */
  private readonly commentService: CommentService = CommentService.getInstance();

  /**
   * User Service
   */
  private readonly userService: UserService = UserService.getInstance();

  data: Comment[] = [];

  loading: Loading = {
    submit: false,
  }

  created() {
    if (!this.parentId || !this.parentEntity) {
      throw Error('Missing props `parentId` and `parentEntity`');
    }
    this.init();
  }

  async init(): Promise<void> {
    this.data = await this.fetchData();
  }

  async fetchData(): Promise<Comment[]> {
    const token = this.userService.getActiveToken();
    const { data } = await this.commentService.api.find({
      id: this.parentId,
      entity: this.parentEntity,
      entity_id: this.parentId,
      authentication_token: token,
    });
    return (data.comments)
      ? data.comments.map((comment: any) => new Comment(comment)).reverse()
      : [];
  }

  async submit(comment: string) {
    this.loading.submit = true;
    const token = this.userService.getActiveToken();
    try {
      const { data: response } = await this.commentService.api.create({
        authentication_token: token,
        entity: this.parentEntity,
        entity_id: this.parentId,
        comment: {
          body: comment,
        },
      });
      const newComment = new Comment(response.comment);
      this.data.push(newComment);
    } catch (error) {
      Logger.error(error);
    } finally {
      this.loading.submit = false;
    }
  }
}

/**
 * Props used in rendering a CommentsView component
 */
export type CommentsViewProps = {
  /**
   * ID of the parent
   */
  parentId: number;
  /**
   * Entity type of parent
   */
  parentEntity: string;
  /**
   * Title of the CommentsView card
   */
  title?: string;
  /**
   * Subtitle placed underneath card title
   */
  subtitle?: string;
  /**
   * Rest
   */
  [rest: string]: any;
}

/**
 * Helper function for rendering a CommentsView for a particular ModelView
 */
export function showComments<T extends BaseModel>(
  this: any,
  el: Element,
  propsData: CommentsViewProps,
): void {
  const instance = new CommentsView<T>({
    parent: this,
    propsData,
  });
  instance.$mount();
  el.appendChild(instance.$el);
}
</script>

<style lang="scss">
// .comments-view {}
</style>
