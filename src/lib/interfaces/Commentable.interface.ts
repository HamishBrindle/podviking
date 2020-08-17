import { Comment } from '@/models/internal';
import { Collection } from '@/lib/types/Collection.type';

export interface ICommentable {
  /**
   * Array of Comment IDs used in associating comment records
   * with the parent record
   */
  comment_ids: number[];
  /**
   * Associative placeholder for hydrating with Comment records
   */
  comments: Collection<Comment>;
}
