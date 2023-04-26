import { Command } from '@colyseus/command'
import { Trysts } from '../Trysts'
import { WhiteBoard } from '../schema/WorldState'

export class WhiteBoardOpenCommand extends Command<
  Trysts,
  {
    whiteboardId: string
    members: string[]
  }
> {
  execute(payload: this['payload']) {
    this.state.whiteboards.set(
      payload.whiteboardId,
      new WhiteBoard(payload.whiteboardId, payload.members)
    )

    if (payload.whiteboardId === this.room.roomId) {
      this.state.isHostWhiteBoardOpen = true
    }
  }
}

export class WhiteBoardCloseCommand extends Command<
  Trysts,
  {
    whiteboardId: string
  }
> {
  execute(payload: this['payload']) {
    this.state.whiteboards.delete(payload.whiteboardId)

    if (payload.whiteboardId === this.room.roomId) {
      this.state.isHostWhiteBoardOpen = false
    }

    console.log(this.state.isHostWhiteBoardOpen)
  }
}

export class MemberJoinWhiteBoardCommand extends Command<
  Trysts,
  {
    whiteboardId: string
    memberId: string
  }
> {
  execute(payload: this['payload']) {
    this.state.whiteboards.get(payload.whiteboardId).addMember(payload.memberId)
  }
}

export class MemberLeaveWhiteBoardCommand extends Command<
  Trysts,
  {
    whiteboardId: string
    memberId: string
  }
> {
  execute(payload: this['payload']) {
    this.state.whiteboards.get(payload.whiteboardId)?.removeMember(payload.memberId)
  }
}
