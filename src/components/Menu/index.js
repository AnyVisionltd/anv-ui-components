import { default as MenuItem } from './MenuItem/MenuItem'
import { default as SubMenu } from './SubMenu/SubMenu'
import { default as MenuComponent } from './Menu'

MenuComponent.Item = MenuItem
MenuComponent.SubMenu = SubMenu

export const Menu = MenuComponent