import React, { useRef, useState } from "react"
import { IconButton } from "../../../IconButton"
import styles from "./BulkAction.module.scss"
import { Menu } from "../../../Menu"

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
                  { subMenu.map(({ onClick, icon, label }) => {
                    return (
                      <Menu.Item onClick={ onClick } key={ label } leadingComponent={ icon }>
                        { label }
                      </Menu.Item>
                    )
                  } ) }
                </Menu>
      }

    </>
  ) }
    
export default  BulkAction