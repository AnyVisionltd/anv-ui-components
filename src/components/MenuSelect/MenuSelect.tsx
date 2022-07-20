import React, { FC, ReactElement, useRef, useState } from 'react'
import classNames from 'classnames'
import { ArrowDown, TimesThick } from '@anyvision/anv-icons'
import { Menu } from '../Menu'
import { Tooltip } from '../Tooltip'
import { Button } from '../Button'
import { useComponentTranslation } from '../../hooks/UseComponentTranslation'
import { Checkbox } from '../Checkbox'
import styles from './MenuSelect.module.scss'

enum MenuSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

interface MenuItemInterface {
  callback: () => void
  element: string
  isSelected: boolean
  key: string
}

interface MenuSelectProps {
  /** Menu items - { callback, element, isSelected, key }*/
  items: Array<MenuItemInterface>
  /** Force the menu to open <b>to</b> a certain side.<br />
 * <code>top-start</code> - means that the menu will open on the top-side-left<br />
 * <code>top</code> - means that the menu will open in the top-side-center<br />
 * <code>top-end</code> - means that the menu will open in the top-side-right<br />
 * <code>right-start</code> - means that the menu will open in the right-side-top<br />
 * <code>right</code> - means that the menu will open in the right-side-center<br />
 * <code>right-end</code> - means that the menu will open in the right-side-bottom<br />
 * <code>bottom-start</code> - means that the menu will open in the bottom-side-left<br />
 * <code>bottom</code> - means that the menu will open in the bottom-side-center<br />
 * <code>bottom-end</code> - means that the menu will open in the bottom-side-right<br />
 * <code>left-start</code> - means that the menu will open in the left-side-top<br />
 * <code>left</code> - means that the menu will open in the left-side-center <br />
 * <code>left-end</code> - means that the menu will open in the left-side-bottom<br />

 * */
  preferOpenDirection: string
  /** Sometimes due to its cleanup, during specific situations,
   * the menu might not show up. To avoid this, it is best practice
   * to specify a unique menuContainerId.*/
  menuContainerId: string
  /** The selected item/ items.*/
  selectedData: string | Array<string>
  /** The size of the Menu, one of - 'small', 'medium', 'large'.*/
  size?: MenuSize
  /** Callback when Menu open and close*/
  toggleCallback?: (value: boolean) => void
  /** Set if multi selection is enabled. */
  isMultiSelect?: boolean
  /** Callback for clear all the selected items, Enabled only If isMultiSelect = true.*/
  removeAll?: () => void
  /** Set if disabled. */
  disabled?: boolean
}

const MenuSelect: FC<MenuSelectProps> = ({
  items,
  preferOpenDirection,
  menuContainerId,
  selectedData: selectedItemValue,
  toggleCallback,
  isMultiSelect,
  removeAll,
  size = MenuSize.Medium,
  disabled = false,
}): ReactElement => {
  const btnRef = useRef(null)
  const [anchorElement, setAnchorElement] = useState(null)
  const isMenuOpen = Boolean(anchorElement)

  const { getComponentTranslation } = useComponentTranslation()
  const translations: Record<string, string> = getComponentTranslation(
    'selectMenu',
  )

  const onToggleMenu = () => {
    toggleCallback && toggleCallback(!!!anchorElement)
    setAnchorElement(anchorElement ? null : btnRef.current)
  }

  const onClickRemoveSelectedItems = event => {
    event.stopPropagation()
    removeAll && removeAll()
  }

  const renderMenu = () => (
    // @ts-ignore
    <Menu
      isOpen={isMenuOpen}
      anchorElement={anchorElement}
      className={classNames(styles.menuContainer, styles[size])}
      aria-labelledby='menu'
      preferOpenDirection={preferOpenDirection}
      menuContainerId={menuContainerId}
      onClose={onToggleMenu}
    >
      {items.map(
        ({ callback, element, isSelected, key }: MenuItemInterface) => (
          // @ts-ignore
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
            {!isMultiSelect ? (
              element
            ) : (
              <div className={styles.rowItemContainer}>
                {
                  // @ts-ignore
                  <Checkbox checked={isSelected} />
                }
                <Tooltip overflowOnly placement='right' content={element}>
                  <div className={styles.rowItemValue}>{element}</div>
                </Tooltip>
              </div>
            )}
          </Menu.Item>
        ),
      )}
    </Menu>
  )

  const renderMultipleWrapper = () => (
    <div className={styles.multiSelectContainer}>
      {selectedItemValue.length === 0 && (
        <span className={styles.multiSelectTitleNoneItems}>
          {translations.selectOption}
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
            <span>{translations.itemsSelected}</span>
          </div>
        </div>
      )}
    </div>
  )

  const renderMenuHeader = () => (
    <div
      onClick={onToggleMenu}
      className={classNames(
        styles.resultContainer,
        styles[size],
        isMenuOpen && styles.active,
        disabled && styles.disabled,
      )}
      ref={btnRef}
    >
      {!isMultiSelect && (
        <Tooltip content={selectedItemValue} placement='top' overflowOnly>
          <div className={styles.resultTitle}>{selectedItemValue}</div>
        </Tooltip>
      )}
      {isMultiSelect && renderMultipleWrapper()}
      <ArrowDown />
    </div>
  )

  return (
    <div className={styles.dropdownContainer} data-testid={'menu-select'}>
      {renderMenuHeader()}
      {renderMenu()}
    </div>
  )
}

export default MenuSelect
