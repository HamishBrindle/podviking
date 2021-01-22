import { module as contextModule, IContextState } from './context';
import { module as layoutModule, ILayoutState } from './layout';
import { module as soundcloudModule, ISoundcloudState } from './soundcloud';

export interface IAppState {
  context: IContextState,
  layout: ILayoutState,
  soundcloud: ISoundcloudState,
}

export {
  contextModule,
  layoutModule,
  soundcloudModule,
};
