import { MapSchema, Schema, type } from '@colyseus/schema'

export type Vector3 = {
  x: number
  y: number
  z: number
}

export type Vector4 = {
  x: number
  y: number
  z: number
  w: number
}

export class User extends Schema {
  @type('string') userId: string
  @type('string') name: string
  @type('string') handler: string
  @type('string') avatar: string

  constructor(user: User) {
    super()
    this.userId = user.userId
    this.name = user.name
    this.handler = user.handler
    this.avatar = user.avatar
  }

  set(user: { userId: string; name: string; handler: string; avatar: string }) {
    this.userId = user.userId
    this.name = user.name
    this.handler = user.handler
    this.avatar = user.avatar
  }
}
export class Position extends Schema implements Vector3 {
  @type('number') x: number
  @type('number') y: number
  @type('number') z: number

  constructor(position: Vector3) {
    super()
    this.x = position.x
    this.y = position.y
    this.z = position.z
  }

  set(position: { x: number; y: number; z: number }) {
    this.x = position.x
    this.y = position.y
    this.z = position.z
  }
}

export class Quaternion extends Schema implements Vector4 {
  @type('number') x: number
  @type('number') y: number
  @type('number') z: number
  @type('number') w: number

  constructor(rotation: Vector4) {
    super()
    this.x = rotation.x
    this.y = rotation.y
    this.z = rotation.z
    this.w = rotation.w
  }

  set(rotation: { x: number; y: number; z: number; w: number }) {
    this.x = rotation.x
    this.y = rotation.y
    this.z = rotation.z
    this.w = rotation.w
  }
}

export class Member extends Schema {
  @type('string') id: string
  @type('string') peerId: string
  @type(User) user: User
  @type('string') nickname: string
  @type(Position) position: Position
  @type(Quaternion) quaternion: Quaternion
  @type('string') action: string
  @type('number') placeholderForChange = 0

  constructor(id: string, peerId: string, user: User, position: Vector3, quaternion: Vector4) {
    super()
    this.id = id
    this.peerId = peerId
    this.user = new User(user)
    this.position = new Position(position)
    this.quaternion = new Quaternion(quaternion)
    this.action = 'idle'
  }

  setNickName(nickname: string) {
    this.nickname = nickname
  }
}

export class MemberMessage extends Schema {
  @type('string') id: string
  @type('string') sessionId: string
  @type('string') name: string
  @type('string') avatar: string
  @type('number') timestamp: number
  @type('string') content: string

  constructor(
    id: string,
    sessionId: string,
    name: string,
    avatar: string,
    timestamp: number,
    content: string
  ) {
    super()
    this.id = id
    this.sessionId = sessionId
    this.name = name
    this.avatar = avatar
    this.timestamp = timestamp
    this.content = content
  }
}

// export class MemberNickName extends Schema {
//   @type('string') userId: string
//   @type('string') nickname: string

//   constructor(userId: string, nickname: string) {
//     super()
//     this.userId = userId
//     this.nickname = nickname
//   }

//   set(nickname: string) {
//     this.nickname = nickname
//   }
// }

export class WorldState extends Schema {
  @type({ map: Member })
  members = new MapSchema<Member>()
  @type({ map: MemberMessage })
  messages = new MapSchema<MemberMessage>()
  // @type({ map: MemberNickName })
  // nicknames = new MapSchema<MemberNickName>()
}
