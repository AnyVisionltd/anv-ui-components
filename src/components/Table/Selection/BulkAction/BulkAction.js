import React, { useRef, useState } from "react"
import { IconButton } from "../../../IconButton"
import styles from "./BulkAction.module.scss"
import { Menu } from "../../../Menu"
import propTypes from "prop-types"

const BulkAction = ({ icon, onClick, subMenu }) =>
{
  const moreActionsRef = useRef()
  const [anchorElement, setAnchorElement] = useState(null)

  const handleMenuClose = () => setAnchorElement(null)
  const handleButtonClick = () => (anchorElement
    ? setAnchorElement(null)
    : setAnchorElement(moreActionsRef.current))
  return (
    <>
      <IconButton
        onClick={ !subMenu ?  onClick : handleButtonClick }
        variant={ 'ghost' }
        ref={ moreActionsRef }
        className={ styles.actionButton }
      >
        { icon }
      </IconButton>
      {
        subMenu &&
                <Menu
                  isOpen={ !!anchorElement }
                  onClose={ handleMenuClose }
                  anchorElement={ anchorElement }
                  preferOpenDirection={ 'up-start' }
                >
                  { subMenu.map(({ onClick, icon, label }) => (
                    <Menu.Item onClick={ onClick } key={ label } leadingComponent={ icon }>
                      { label }
                    </Menu.Item>
                  )
                  ) }
                </Menu>
      }

    </>
  ) }
BulkAction.defaultProps = {
  icon: null
}

BulkAction.propTypes = {
  icon: propTypes.node,
  onClick: propTypes.func.isRequired,
  /** Table bulk actions. <br />
     *  <code>icon</code>      - icon for the action. <br />
     *  <code>label</code>     - label for the action icon.<br />
     *  <code>onClick</code>   - callback fire when action click. <br />
     **/
  subMenu: propTypes.arrayOf(
    propTypes.shape({
      icon: propTypes.node,
      label: propTypes.string,
      onClick: propTypes.func.isRequired
    })
  ),
  /** Selection bar css customization. */
  className: propTypes.string,
}
export default  BulkAction