import { Command } from '@colyseus/command'
import { Trysts } from '../Trysts'
import { Member, Vector3, Vector4 } from '../schema/WorldState'

const INITIAL_Y_AXES = 0

export class MemberCreateCommand extends Command<
  Trysts,
  {
    sessionId: string
  }
> {
  execute(payload: this['payload']) {
    const x = 0
    const y = INITIAL_Y_AXES - 2
    const z = 0
    this.state.members.set(
      payload.sessionId,
      new Member(payload.sessionId, { x, y, z }, { x: 0, y: 0, z: 0, w: 0 })
    )
  }
}

export class MemberLeaveCommand extends Command<
  Trysts,
  {
    sessionId: string
  }
> {
  execute(payload: this['payload']) {
    this.state.members.delete(payload.sessionId)
  }
}

export class MemberMoveCommand extends Command<
  Trysts,
  {
    sessionId: string
    data: {
      position: Vector3
      quaternion: Vector4
    }
  }
> {
  execute(payload: this['payload']) {
    const member = this.state.members.get(payload.sessionId)
    member.position.set(payload.data.position)
    member.quaternion.set(payload.data.quaternion)
    member.placeholderForChange += 0.00001
  }
}

export class MemberActionCommand extends Command<
  Trysts,
  {
    sessionId: string
    action: string
  }
> {
  execute(payload: this['payload']) {
    const member = this.state.members.get(payload.sessionId)
    member.action = payload.action
  }
}
