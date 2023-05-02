import { Container } from 'inversify'
import { TYPES } from './type'
import { Warrior, Weapon, ThrowableWeapon } from '../@types/interface'
import { Ninja, Katana, Shuriken } from '../entities'

const myContainer = new Container()
myContainer.bind<Warrior>(TYPES.Warrior).to(Ninja)
myContainer.bind<Weapon>(TYPES.Weapon).to(Katana)
myContainer.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken)

export { myContainer }
