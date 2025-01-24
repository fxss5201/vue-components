import mitt, { type Emitter } from 'mitt'

type Events = {
  updateTreeCurent: string
}

export const emitter: Emitter<Events> = mitt<Events>()
