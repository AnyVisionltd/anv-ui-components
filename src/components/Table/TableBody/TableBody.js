import React, { useState, useContext, useEffect } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { IconButton, Menu } from "../../../index"
import { ReactComponent as SunIcon } from '../../../assets/svg/Options.svg'
import TableContext from '../TableContext'
import styles from './TableBody.module.scss'

const TableBody = ({
  data,
  rowHeight,
  rowActions,
  className,
  ...otherProps
}) => {
  const { state, setData, setWithRowActions } = useContext(TableContext)
  const { headers, data: contextData } = state

  const [actionsAnchorElement, setActionsAnchorElement] = useState(null)

  useEffect(() => {
    setData(data)
  }, [setData, data])

  useEffect(() => {
    setWithRowActions(!!rowActions)
  }, [setWithRowActions, rowActions])

  const handleActionsClick = event => {
    setActionsAnchorElement(event.currentTarget)
  }

  const handleActionsClose = () => {
    setActionsAnchorElement(null)
  }

  const renderActions = row => {
    if(!rowActions) {
      return
    }
    return (
      <>
        <Menu
          anchorElement={ actionsAnchorElement }
          isOpen={ !!actionsAnchorElement }
          openDirection={ 'down-start' }
          onClose={ handleActionsClose }
        >
          {
            rowActions.map(({content, onClick}, index) => (
              <Menu.Item key={ index } onClick={ () => onClick(row) }>{ content }</Menu.Item>
            ))
          }
        </Menu>
        <div
          role={ 'cell' }
          className={ styles.actionsCell }
        >
          <IconButton
            className={ styles.actionButton }
            variant={ 'ghost' }
            onClick={ handleActionsClick }
          >
            <SunIcon />
          </IconButton>
        </div>
      </>
    )
  }

  const renderRow = row => (
    <>
      {/*{ renderCheckbox(row) }*/}
      { headers.map(({ field, columnRender, hide, flexWidth }) => {
        if (hide) {
          return null
        }
        const style = flexWidth ? { flex: `0 0 ${ flexWidth }` } : {}
        return (
          <div role={ 'cell' } style={ style } className={ styles.tableCell } key={ field }>
            { columnRender ? columnRender(row[field], row) : row[field] }
          </div>
        )
      }) }
      {/*{ renderDynamicColumnPlaceholder() }*/}
      { renderActions(row) }
    </>
  )

  const renderTableRows = () => (
    contextData.map((row, index) => {
      const tableRowClassNames = classNames(styles.tableRow, { [styles.selectedRow]: false })
      return (
        <div
          role={ 'row' }
          style={ { height: rowHeight } }
          className={ tableRowClassNames } key={ index }
        >
          { renderRow(row) }
        </div>
      )
    })
  )

  const classes = classNames(
    styles.tableBody,
    className,
  )

  return (
    <div
      className={ classes }
      { ...otherProps }
    >
      { renderTableRows() }
    </div>
  )
}

TableBody.defaultProps = {
  rowHeight: '56px'
}

TableBody.propTypes = {
  /**  Each object represent row in the table. The rows rely on <code>headers</code>, <code>prop</code> from <code><Table.Header/></code> component.*/
  data: propTypes.arrayOf(propTypes.object).isRequired,
  /** The row height. <code>min-height: 48px</code>.*/
  rowHeight: propTypes.string,
  /** If pass, render action menu at the end of each row. */
  rowActions: propTypes.arrayOf(propTypes.shape({
    /** The content to render inside the <Menu.Items/>. */
    content: propTypes.node,
    /** The callback when click the <Menu.Items/> */
    onClick: propTypes.func
  })),
  /** For css customization. */
  className: propTypes.string,
}

export default TableBody
