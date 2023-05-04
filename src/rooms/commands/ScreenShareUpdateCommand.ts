import { Command } from '@colyseus/command'
import { Trysts } from '../Trysts'
import { FurnitureScreenShare } from '../schema/WorldState'

export class OpenScreenShareCommand extends Command<
  Trysts,
  {
    furnitureIframeId: string
    screenSharePeerId: string
  }
> {
  execute(payload: this['payload']) {
    this.state.screenShares.set(
      payload.furnitureIframeId,
      new FurnitureScreenShare(payload.furnitureIframeId, payload.screenSharePeerId)
    )

    console.log(this.state.screenShares)
  }
}

export class CloseScreenShareCommand extends Command<
  Trysts,
  {
    furnitureIframeId: string
  }
> {
  execute(payload: this['payload']) {
    this.state.screenShares.delete(payload.furnitureIframeId)
    console.log(this.state.screenShares)
  }
}
