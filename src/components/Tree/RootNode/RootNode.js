import React from 'react'
import propTypes from 'prop-types'
import { Menu, IconButton } from '../../../'
import { ReactComponent as OptionsIcon } from '../../../assets/svg/Options.svg'
import { useMenu } from '../../../hooks'
import { generateId } from '../../../utils'
import styles from './RootNode.module.scss'

const RootNode = ({ renderNode, menuActions }) => {
  const { onAnchorClick, menuProps } = useMenu()
  const { onClose: handleMenuClose, isOpen } = menuProps

  const cellStyle = isOpen ? { opacity: 1 } : {}

  const renderActions = node => {
    if (!menuActions) return
    const activeNodeActions = menuActions.filter(
      ({ hidden }) => !hidden?.(node),
    )
    return (
      <>
        <Menu
          {...menuProps}
          preferOpenDirection='bottom-end'
          menuContainerId={`treeNode-${generateId()}`}
          className={styles.menu}
        >
          {activeNodeActions.map(({ label, icon, onClick }, index) => (
            <Menu.Item
              leadingComponent={icon}
              key={index}
              onClick={e => {
                e.stopPropagation()
                onClick(node)
                handleMenuClose()
              }}
            >
              {label}
            </Menu.Item>
          ))}
        </Menu>
        <div
          role='cell'
          className={styles.actionsCell}
          onClick={e => e.stopPropagation()}
          style={cellStyle}
        >
          <IconButton
            className={styles.actionButton}
            variant='ghost'
            onClick={onAnchorClick}
          >
            <OptionsIcon />
          </IconButton>
        </div>
      </>
    )
  }

  return renderNode({ renderActions })
}

RootNode.propTypes = {
  /** Render function for the roots of the tree. */
  renderNode: propTypes.func,
  /** Actions for menu. */
  menuActions: propTypes.array,
}

export default RootNode
