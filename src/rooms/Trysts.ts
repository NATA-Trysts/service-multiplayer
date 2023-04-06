import { Dispatcher } from '@colyseus/command'
import { Client, Room } from 'colyseus'
import { MemberSendMessageCommand } from './commands/ChatUpdateCommand'
import {
  MemberActionCommand,
  MemberCreateCommand,
  MemberLeaveCommand,
  MemberMoveCommand,
} from './commands/MemberUpdateCommand'
import { MESSAGES } from './constants/Message'
import { WorldState } from './schema/WorldState'

export class Trysts extends Room<WorldState> {
  dispatcher = new Dispatcher(this)
  peerId = ''

  async onCreate(options: any) {
    this.roomId = await options.spaceId
    if (options.peerId) this.peerId = options.peerId

    this.setState(new WorldState())

    this.onMessage(MESSAGES.MEMBER.MOVE, (client, data) => {
      this.dispatcher.dispatch(new MemberMoveCommand(), {
        sessionId: client.sessionId,
        data,
      })
    })

    this.onMessage(MESSAGES.MEMBER.ACTION, (client, data) => {
      this.dispatcher.dispatch(new MemberActionCommand(), {
        sessionId: client.sessionId,
        action: data.action,
      })
    })

    this.onMessage(MESSAGES.MEMBER.SEND_MESSAGE, (client, data) => {
      console.log(`--> ${client.sessionId} send message!`)

      this.dispatcher.dispatch(new MemberSendMessageCommand(), {
        sessionId: client.sessionId,
        senderName: data.name,
        avatar: data.avatar,
        timestamp: data.timestamp,
        content: data.content,
      })
    })

    this.onMessage(MESSAGES.WHITEBOARD.HOST_OPEN, (client) => {
      console.log(`--> ${client.sessionId} opening white board`)

      this.broadcast(MESSAGES.WHITEBOARD.HOST_OPEN)
    })

    this.onMessage(MESSAGES.WHITEBOARD.HOST_CLOSE, (client) => {
      console.log(`--> ${client.sessionId} closed white board`)

      this.broadcast(MESSAGES.WHITEBOARD.HOST_CLOSE)
    })

    this.onMessage(MESSAGES.WHITEBOARD.JOIN, (client, data) => {
      console.log(`--> ${client.sessionId} joined white board`)

      this.broadcast(MESSAGES.WHITEBOARD.JOIN, {
        member: data.member,
      })
    })

    this.onMessage(MESSAGES.WHITEBOARD.LEAVE, (client, data) => {
      console.log(`--> ${client.sessionId} left white board`)

      this.broadcast(MESSAGES.WHITEBOARD.LEAVE, {
        member: data.member,
      })
    })
  }

  onJoin(client: Client, options?: any, auth?: any): void | Promise<any> {
    console.log(`--> ${client.sessionId} joined! peerId: ${options.peerId}`)

    this.dispatcher.dispatch(new MemberCreateCommand(), {
      peerId: options.peerId || this.peerId,
      sessionId: client.sessionId,
    })
  }

  onLeave(client: Client, consented?: boolean): void | Promise<any> {
    console.log(`<-- ${client.sessionId} leave!`)
    this.dispatcher.dispatch(new MemberLeaveCommand(), {
      sessionId: client.sessionId,
    })
  }

  onDispose(): void | Promise<any> {
    console.log('❌ Dispose a space')
    this.dispatcher.stop()
  }
}

