import { Dispatcher } from '@colyseus/command'
import { Client, Room } from 'colyseus'
import { MemberSendMessageCommand } from './commands/ChatUpdateCommand'
import {
  MemberActionCommand,
  MemberChangeAvatarCommand,
  MemberCreateCommand,
  MemberLeaveCommand,
  MemberMoveCommand,
} from './commands/MemberUpdateCommand'
import { MESSAGES } from './constants/Message'
import { UserInformationType, WorldState } from './schema/WorldState'
import {
  MemberJoinWhiteBoardCommand,
  MemberLeaveWhiteBoardCommand,
  WhiteBoardCloseCommand,
  WhiteBoardOpenCommand,
} from './commands/WhiteBoardUpdateCommand'
import {
  CloseScreenShareCommand,
  OpenScreenShareCommand,
} from './commands/ScreenShareUpdateCommand'

export class Trysts extends Room<WorldState> {
  dispatcher = new Dispatcher(this)
  peerId = ''
  user: UserInformationType

  async onCreate(options: any) {
    this.roomId = await options.spaceId
    if (options.peerId) this.peerId = options.peerId
    if (options.user) this.user = options.user

    this.setState(new WorldState())

    //#region
    this.state.listen('isHostWhiteBoardOpen', (value) => {})

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

    this.onMessage(MESSAGES.MEMBER.CHANGE_AVATAR, (client, data) => {
      console.log(`--> ${client.sessionId} opening white board`)

      this.dispatcher.dispatch(new MemberChangeAvatarCommand(), {
        sessionId: client.sessionId,
        avatar: data.avatar,
      })
    })

    this.onMessage(MESSAGES.WHITEBOARD.HOST_OPEN, (client, data) => {
      console.log(`--> ${client.sessionId} opening white board ${data.whiteboardId}`)

      this.dispatcher.dispatch(new WhiteBoardOpenCommand(), {
        whiteboardId: data.whiteboardId,
        members: [client.sessionId],
      })
    })

    this.onMessage(MESSAGES.WHITEBOARD.HOST_CLOSE, (client, data) => {
      console.log(`--> ${client.sessionId} closed white board ${data.whiteboardId}`)

      this.dispatcher.dispatch(new WhiteBoardCloseCommand(), {
        whiteboardId: data.whiteboardId,
      })
    })

    this.onMessage(MESSAGES.WHITEBOARD.JOIN, (client, data) => {
      console.log(`--> ${client.sessionId} joined white board ${data.whiteboardId}`)

      this.dispatcher.dispatch(new MemberJoinWhiteBoardCommand(), {
        memberId: client.sessionId,
        whiteboardId: data.whiteboardId,
      })
    })

    this.onMessage(MESSAGES.WHITEBOARD.LEAVE, (client, data) => {
      console.log(`--> ${client.sessionId} left white board ${data.whiteboardId}`)

      this.dispatcher.dispatch(new MemberLeaveWhiteBoardCommand(), {
        memberId: client.sessionId,
        whiteboardId: data.whiteboardId,
      })
    })

    this.onMessage(MESSAGES.SCREENSHARE.OPEN, (client, data) => {
      console.log(`--> ${client.sessionId} open screen share`, data)

      this.dispatcher.dispatch(new OpenScreenShareCommand(), {
        furnitureIframeId: data.furnitureIframeId,
        screenSharePeerId: data.screenSharePeerId,
      })
    })

    this.onMessage(MESSAGES.SCREENSHARE.CLOSE, (client, data) => {
      console.log(`--> ${client.sessionId} close screen share `, data)

      this.dispatcher.dispatch(new CloseScreenShareCommand(), {
        furnitureIframeId: data.furnitureIframeId,
      })
    })

    //#endregion
  }

  onJoin(client: Client, options?: any, auth?: any): void | Promise<any> {
    console.log(`--> ${client.sessionId} joined! peerId: ${options.peerId}`)

    console.log(options)

    this.dispatcher.dispatch(new MemberCreateCommand(), {
      peerId: options.peerId || this.peerId,
      sessionId: client.sessionId,
      user: options.user || this.user,
      isHost: options.isHost,
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
