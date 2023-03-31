import { Command } from '@colyseus/command'
import { MemberNickName } from '../schema/WorldState'
import { Trysts } from '../Trysts'

export class MemberChangeNickNameCommand extends Command<
  Trysts,
  {
    userId: string
    nickname: string
  }
> {
  execute(payload: this['payload']) {
    this.state.nicknames.set(payload.userId, new MemberNickName(payload.userId, payload.nickname))
  }
}
