import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema'

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

export type Item = {
  id: string
  itemId: string
}

export type SubcategoryActiveItem = {
  id: string
  itemId: string
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

export class PartItem extends Schema implements Item {
  @type('string') id: string
  @type('string') itemId: string

  constructor(partItem: Item) {
    super()
    this.id = partItem.id
    this.itemId = partItem.itemId
  }

  set(partItem: Item) {
    this.id = partItem.id
    this.itemId = partItem.itemId
  }
}

export class Avatar extends Schema {
  @type([PartItem]) skin = new ArraySchema<PartItem>()
  @type([PartItem]) hair = new ArraySchema<PartItem>()
  @type([PartItem]) upper = new ArraySchema<PartItem>()
  @type([PartItem]) lower = new ArraySchema<PartItem>()
  @type([PartItem]) shoe = new ArraySchema<PartItem>()
  @type([PartItem]) tattoo = new ArraySchema<PartItem>()
  @type('string') image: string

  constructor(avatar: AvatarType) {
    super()
    console.log(avatar.skin)
    if (avatar.skin)
      avatar.skin.map((s) => this.skin.push(new PartItem({ id: s.id, itemId: s.itemId })))
    if (avatar.hair)
      avatar.hair.map((s) => this.hair.push(new PartItem({ id: s.id, itemId: s.itemId })))
    if (avatar.upper)
      avatar.upper.map((s) => this.upper.push(new PartItem({ id: s.id, itemId: s.itemId })))
    if (avatar.lower)
      avatar.lower.map((s) => this.lower.push(new PartItem({ id: s.id, itemId: s.itemId })))
    if (avatar.shoe)
      avatar.shoe.map((s) => this.shoe.push(new PartItem({ id: s.id, itemId: s.itemId })))
    if (avatar.tattoo)
      avatar.tattoo.map((s) => this.tattoo.push(new PartItem({ id: s.id, itemId: s.itemId })))
    this.image = avatar.image
  }
}

export type AvatarType = {
  skin: Item[]
  hair: Item[]
  upper: Item[]
  lower: Item[]
  shoe: Item[]
  tattoo: Item[]
  image: string
}

export type UserInformationType = {
  username: string
  handler: string
  email: string
  avatar: string
  // avatar: AvatarType
}

export class UserInformation extends Schema {
  @type('string') username: string
  @type('string') handler: string
  @type('string') email: string
  @type('string') avatar: string

  // @type(Avatar) avatar: Avatar

  constructor(user: UserInformationType) {
    super()
    this.username = user.username
    this.handler = user.handler
    this.email = user.email
    this.avatar = user.avatar
    // this.avatar = new Avatar(user.avatar)
  }
}

export class Member extends Schema {
  @type('string') id: string
  @type('string') peerId: string
  @type(Position) position: Position
  @type(Quaternion) quaternion: Quaternion
  @type('string') action: string
  @type('number') placeholderForChange = 0
  @type(UserInformation) user: UserInformation

  constructor(
    id: string,
    peerId: string,
    position: Vector3,
    quaternion: Vector4,
    user: UserInformationType
  ) {
    super()
    this.id = id
    this.peerId = peerId
    this.position = new Position(position)
    this.quaternion = new Quaternion(quaternion)
    this.action = 'idle.000'
    this.user = new UserInformation(user)
  }

  setAvatar(avatar: string) {
    this.user.avatar = avatar
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

export class WorldState extends Schema {
  @type({ map: Member })
  members = new MapSchema<Member>()
  @type({ map: MemberMessage })
  messages = new MapSchema<MemberMessage>()
}
