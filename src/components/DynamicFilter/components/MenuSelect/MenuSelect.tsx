import React, { FC, ReactElement, useContext, useRef, useState } from 'react'
import classNames from 'classnames'
import { ArrowDown } from '@anyvision/anv-icons'
import { Menu } from '../../../Menu'
import { Tooltip } from '../../../Tooltip'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import { MenuItemInterface } from '../../utils'
import styles from './MenuSelect.module.scss'

interface MenuSelectProps {
  items: Array<MenuItemInterface>
  preferOpenDirection: string
  menuContainerId: string
  selectedItemValue: string
}

const MenuSelect: FC<MenuSelectProps> = ({
  items,
  preferOpenDirection,
  menuContainerId,
  selectedItemValue,
}): ReactElement => {
  const btnRef = useRef(null)
  const [anchorElement, setAnchorElement] = useState(null)
  const isMenuOpen = Boolean(anchorElement)
  const { actions } = useContext(DynamicFilterContext)
  const { setIsMenuDropdownOpen } = actions

  const onToggleMenu = () => {
    setIsMenuDropdownOpen(!!!anchorElement)
    setAnchorElement(anchorElement ? null : btnRef.current)
  }

  const renderMenu = () => (
    <Menu
      isOpen={isMenuOpen}
      anchorElement={anchorElement}
      className={styles.menuContainer}
      aria-labelledby='menu'
      preferOpenDirection={preferOpenDirection}
      menuContainerId={menuContainerId}
      onClose={onToggleMenu}
    >
      {items.map(
        ({ callback, element, isSelected, key }: MenuItemInterface) => (
          <Menu.Item
            key={key}
            onClick={(event: any) => {
              event.stopPropagation()
              callback()
              onToggleMenu()
            }}
            className={classNames(
              styles.dropdownItem,
              isSelected && styles.selectedMenuItem,
            )}
          >
            {element}
          </Menu.Item>
        ),
      )}
    </Menu>
  )

  return (
    <div className={styles.dropdownContainer}>
      <div
        onClick={onToggleMenu}
        className={classNames(
          styles.resultContainer,
          isMenuOpen && styles.active,
        )}
        ref={btnRef}
      >
        <Tooltip content={selectedItemValue} placement='top' overflowOnly>
          <div className={styles.resultTitle}>{selectedItemValue}</div>
        </Tooltip>
        <ArrowDown />
      </div>
      {renderMenu()}
    </div>
  )
}

export default MenuSelect
