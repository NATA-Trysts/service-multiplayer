import { Command } from '@colyseus/command'
import { MemberMessage } from '../schema/WorldState'
import { Trysts } from '../Trysts'

export class MemberSendMessageCommand extends Command<
  Trysts,
  {
    sessionId: string
    senderName: string
    avatar: string
    timestamp: number
    content: string
  }
> {
  execute(payload: this['payload']) {
    const size = this.state.messages.size
    const id = `${size + 1}`

    this.state.messages.set(
      id,
      new MemberMessage(
        id,
        payload.sessionId,
        payload.senderName,
        payload.avatar,
        payload.timestamp,
        payload.content
      )
    )
  }
}
