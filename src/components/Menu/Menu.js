import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
} from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { MenuItem } from './MenuItem'
import { SubMenu } from './SubMenu'
import keymap from '../../utils/enums/keymap'
import { useClickOutsideListener } from '../../hooks'
import { Animations } from '../Animations'
import { Portal } from '../Portal'
import styles from './Menu.module.scss'
import { usePopper } from 'react-popper'
import { useCombinedRefs } from '../../hooks/UseCombinedRefs'

const Menu = React.forwardRef((props, ref) => {
  const {
    isOpen,
    variant,
    size,
    className,
    containerClassName,
    anchorElement,
    children,
    preferOpenDirection,
    isSubMenu,
    onClose,
    onClosed,
    onOpened,
    menuContainerId,
    innerHandlerRef,
    qa = "",
    ...otherProps
  } = props
  const [currentFocus, setCurrentFocus] = useState(false)
  const [popperRef, setPopperRef] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(isOpen || false)
  const sideToOpenFrom = useRef(null)
  const positionToOpenFrom = useRef(null)
  const inputRef = useCombinedRefs(useRef({}), ref)

  useImperativeHandle(
    innerHandlerRef,
    () => ({
      get isMenuOpen() {
        return isMenuOpen
      },
    }),
    [isMenuOpen],
  )

  const { styles: popperStyles, attributes, update: updatePopper } = usePopper(
    anchorElement,
    popperRef,
    {
      placement: preferOpenDirection,
      modifiers: [{ name: 'offset', options: [0, 4] }],
    },
  )

  // update menu position when dom change
  useEffect(() => {
    if (updatePopper) {
      const observer = new MutationObserver(() => {
        updatePopper()
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
      return () => {
        observer.disconnect()
      }
    }
    // Only when isMenuOpen changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(isOpen)
  }, [isOpen])

  const handleOnAnchorClick = useCallback(() => {
    if (isOpen === undefined) {
      setIsMenuOpen(true)
    }
  }, [isOpen])

  useEffect(() => {
    if (anchorElement) {
      anchorElement.onclick = handleOnAnchorClick
    }
  }, [anchorElement, handleOnAnchorClick])

  useEffect(() => {
    async function update() {
      if (updatePopper && isOpen) {
        await updatePopper()
      }
    }
    update()
  }, [anchorElement, updatePopper, isOpen])

  useEffect(() => {
    const [side, position] = preferOpenDirection.split('-')
    sideToOpenFrom.current = side
    positionToOpenFrom.current = position === undefined ? 'center' : position
  }, [preferOpenDirection])

  useClickOutsideListener(
    event => {
      if (
        !isMenuOpen ||
        (anchorElement && anchorElement.contains(event.target))
      ) {
        return
      }
      if (isOpen === undefined) {
        setIsMenuOpen(false)
      }
      onClose(event)
    },
    { current: popperRef },
  )

  const handleKeyDown = useCallback(
    event => {
      const nextFocus = (nextFocusDirection, firstFocus) => {
        if (!currentFocus) {
          const focusItem = popperRef.firstChild[firstFocus]
          focusItem.focus()
          setCurrentFocus(focusItem)
        } else if (!currentFocus[nextFocusDirection]) {
          anchorElement.focus()
          setCurrentFocus(null)
        } else if (currentFocus[nextFocusDirection]) {
          const focusItem = currentFocus[nextFocusDirection]
          focusItem.focus()
          setCurrentFocus(focusItem)
        }
      }

      switch (event.keyCode) {
        case keymap.ARROW_DOWN:
          nextFocus('nextElementSibling', 'firstChild')
          break
        case keymap.ARROW_UP:
          nextFocus('previousElementSibling', 'lastChild')
          break
        case keymap.ESCAPE:
          onClose()
          break
        default:
          break
      }
    },
    [popperRef, currentFocus, anchorElement, onClose],
  )

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      setCurrentFocus(null)
      document.removeEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen, handleKeyDown])

  const renderMenuList = () => (
    <ul role='menu' className={menuClasses} data-testid={qa + '-menu'} {...otherProps}>
      {children}
    </ul>
  )

  const containerClasses = classNames(
    styles.menuContainer,
    isSubMenu && styles.subMenu,
    containerClassName,
  )
  const menuClasses = classNames(
    styles.menu,
    styles[variant],
    styles[size],
    className,
  )

  const sideToOpenTo = {
    top: 'bottom',
    bottom: 'top',
    right: 'left',
    left: 'right',
  }

  const setMenuRef = element => {
    setPopperRef(element)
    inputRef.current = element
  }

  const renderMenu = () => (
    <div
      ref={setMenuRef}
      className={containerClasses}
      style={popperStyles.popper}
      {...attributes.popper}
    >
      <Animations.Scale
        isOpen={isMenuOpen || false}
        onEnter={() => onOpened()}
        onExited={() => onClosed()}
        horizontalStart={positionToOpenFrom.current}
        verticalStart={sideToOpenTo[sideToOpenFrom]}
      >
        {renderMenuList()}
      </Animations.Scale>
    </div>
  )

  const renderMenuInPortal = () => (
    <Portal containerId={menuContainerId}>{renderMenu()}</Portal>
  )

  return (
    (isMenuOpen || isSubMenu) &&
    (!isSubMenu ? renderMenuInPortal() : renderMenu())
  )
})

Menu.defaultProps = {
  size: 'large',
  onClose: () => {},
  onClosed: () => {},
  onOpened: () => {},
  isSubMenu: false,
  preferOpenDirection: 'bottom-start',
  menuContainerId: 'menu-container',
}

Menu.propTypes = {
  /** Should the menu appear on screen or not. */
  isOpen: propTypes.bool,
  /** Determine the height of the menu's items. */
  variant: propTypes.oneOf(['dense']),
  /** Determine the size of the menu's items. */
  size: propTypes.oneOf(['large', 'medium', 'small']),
  /** Reference to the controlling element,
   *  used to attached the to the menu to the controller which causes it to open. */
  anchorElement: propTypes.oneOfType([
    propTypes.func,
    propTypes.shape({ current: propTypes.any }),
  ]),
  /** Determine whether the menu should be attached to
   *  the controlling element from the side, or top/bottom. */
  attachAxis: propTypes.oneOf(['vertical', 'horizontal']),
  /** Add custom styling to the menu. */
  className: propTypes.string,
  /** Menu items (Menu.Item) or sub menus (Menu.SubMenu). */
  children: propTypes.node.isRequired,
  /** A callback triggered whenever the user is clicking outside the menu scope. */
  onClose: propTypes.func,
  /** A callback triggered after the menu is opened. */
  onOpened: propTypes.func,
  /** A callback triggered after the menu is closed. */
  onClosed: propTypes.func,
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
  preferOpenDirection: propTypes.oneOf([
    'top-start',
    'top',
    'top-end',
    'right-start',
    'right',
    'right-end',
    'bottom-start',
    'bottom',
    'bottom-end',
    'left-start',
    'left',
    'left-end',
  ]),
  /** <code>INTERNAL</code> Is the menu is in-fact a sub menu.
   * Is set internally by <code>Menu.SubMenu</code> */
  isSubMenu: propTypes.bool,
  /** Sometimes due to its cleanup, during specific situations,
   * the menu might not show up. To avoid this, it is best practice
   * to specify a unique menuContainerId.*/
  menuContainerId: propTypes.string,
}

Menu.Item = MenuItem
Menu.SubMenu = SubMenu

export default Menu
