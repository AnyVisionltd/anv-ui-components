import React, { FC, ReactElement, useRef, useState } from 'react'
import classNames from 'classnames'
import { ArrowDown, TimesThick } from '@anyvision/anv-icons'
import { Menu } from '../Menu'
import { Tooltip } from '../Tooltip'
import { Button } from '../Button'
import styles from './MenuSelect.module.scss'

interface MenuItemInterface {
  callback: () => void
  element: string
  isSelected: boolean
  key: string
}

interface MenuSelectProps {
  items: Array<MenuItemInterface>
  preferOpenDirection: string
  menuContainerId: string
  selectedItemValue: string | Array<string>
  toggleCallback?: (value: boolean) => void
  isMultiSelect?: boolean
  removeAll?: () => void
}

const MenuSelect: FC<MenuSelectProps> = ({
  items,
  preferOpenDirection,
  menuContainerId,
  selectedItemValue,
  toggleCallback,
  isMultiSelect,
  removeAll,
}): ReactElement => {
  const btnRef = useRef(null)
  const [anchorElement, setAnchorElement] = useState(null)
  const isMenuOpen = Boolean(anchorElement)

  const onToggleMenu = () => {
    toggleCallback && toggleCallback(!!!anchorElement)
    setAnchorElement(anchorElement ? null : btnRef.current)
  }

  const onClickRemoveSelectedItems = event => {
    event.stopPropagation()
    removeAll && removeAll()
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
              if (!isMultiSelect) {
                onToggleMenu()
              }
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
        {!isMultiSelect && (
          <Tooltip content={selectedItemValue} placement='top' overflowOnly>
            <div className={styles.resultTitle}>{selectedItemValue}</div>
          </Tooltip>
        )}
        {isMultiSelect && (
          <div className={styles.multiSelectContainer}>
            {selectedItemValue.length === 0 && (
              <span className={styles.multiSelectTitleNoneItems}>
                Select Option
              </span>
            )}
            {selectedItemValue.length > 0 && (
              <div className={styles.multiSelectWithItems}>
                {removeAll && (
                  <Button
                    onClick={onClickRemoveSelectedItems}
                    leadingIcon={<TimesThick />}
                    className={styles.btn}
                  >
                    {selectedItemValue.length}
                  </Button>
                )}
                <div className={styles.multiSelectTitleWrapper}>
                  <span className={styles.multiSelectValue}>
                    {selectedItemValue.length}
                  </span>
                  <span>Items Selected</span>
                </div>
              </div>
            )}
          </div>
        )}
        <ArrowDown />
      </div>
      {renderMenu()}
    </div>
  )
}

export default MenuSelect
