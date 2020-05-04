import MenuItem from './MenuItem/MenuItem'
import SubMenu from './SubMenu/SubMenu'
import MenuComponent from './Menu'

MenuComponent.Item = MenuItem
MenuComponent.SubMenu = SubMenu

export const Menu = MenuComponent
