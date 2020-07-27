import React, { useContext, useEffect, useState } from 'react'
import propTypes from 'prop-types'
import { Button, Checkbox, Dialog, List } from '../../../index'
import { ReactComponent as DragIcon } from '../../../assets/svg/Drag.svg'
import TableContext from '../TableContext'
import styles from './ColumnManagement.module.scss'

const ColumnManagement = ({ onChange }) => {
  const { state, setColumnManagementActivity, setColumnManagementIsOpen, setHeaders } = useContext(TableContext)
  const { headers } = state
  const { isOpen } = state.columnManagement

  const [columns, setColumn] = useState([])

  useEffect(() => {
    setColumn(headers.map(header => ({ ...header })))
  }, [isOpen, headers])

  useEffect(() => {
    setColumnManagementActivity(true)
    return () => setColumnManagementActivity(false)
  }, [setColumnManagementActivity])

  const handleDialogClose = () => {
    setColumnManagementIsOpen(false)
  }

  const handleCheckboxChange = field => {
    const newColumns = columns.map(({ ...column }) => {
      if(column.field === field) {
        column.hide = !column.hide
      }
      return column
    })
    setColumn(newColumns)
  }

  const renderColumnList = () => (
    <List className={ styles.columnList }>
      {
        columns.map(({ field, content, label, hide }, index) => {
          const columnName = label ? label : content
          return (
            <List.Item
              key={ index }
              onChange={ () => handleCheckboxChange(field) }
              leadingComponent={ <Checkbox id={ field } checked={ !hide } /> }
              trailingComponent={ <DragIcon className={ styles.drag }/> }>
              <label className={ styles.columnName } htmlFor={ field }>{ columnName }</label>
            </List.Item>
          )}
        )
      }
    </List>
  )

  const handleSave = () => {
    setHeaders(columns)
    setColumnManagementIsOpen(false)
    onChange(headers)
  }

  return (
    <Dialog
      className={ styles.columnManagement }
      isOpen={ isOpen }
      onClose={ handleDialogClose }
    >
      <Dialog.Header>
        Column Management
      </Dialog.Header>
      <Dialog.Body>
        { renderColumnList() }
      </Dialog.Body>
      <Dialog.Footer className={ styles.dialogFooter }>
        <Button
          size={ 'small' }
          onClick={ handleSave }
        >
          save
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

ColumnManagement.defaultProps = {
  onChange: () => {}
}

ColumnManagement.propTypes = {
  /** Callback fire when headers changed */
  onChange: propTypes.func
}

export default ColumnManagement
