import React, { useContext, useEffect, useState } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import LanguageService from '../../../services/language'
import { Button, Checkbox, Dialog, List } from '../../../index'
import { ReactComponent as DragIcon } from '../../../assets/svg/Drag.svg'
import TableContext from '../TableContext'
import styles from './ColumnManagement.module.scss'

const ColumnManagement = ({ onChange }) => {
  const { state, setColumnManagementActivity, setColumnManagementIsOpen, setColumns: setContextColumn } = useContext(TableContext)
  const { columns: columnsContext } = state
  const { isOpen } = state.columnManagement

  const [columns, setColumns] = useState([])

  useEffect(() => {
    if(isOpen) {
      setColumns([...columnsContext])
    }
  }, [isOpen, columnsContext])

  useEffect(() => {
    setColumnManagementActivity(true)
    return () => setColumnManagementActivity(false)
  }, [setColumnManagementActivity])

  const handleDialogClose = () => {
    setColumnManagementIsOpen(false)
  }

  const handleCheckboxChange = field => {
    let hasVisibleColumn = false
    const newColumns = columns.map(({ ...column }) => {
      if(column.field === field) {
        column.hide = !column.hide
      }
      if(!column.hide && column.manageable !== false) {
        hasVisibleColumn = true
      }
      return column
    })
    if(!hasVisibleColumn) return
    setColumns(newColumns)
  }

  const onDragEnd = ({ destination, source }) => {
    if(!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }
    const newColumns = [...columns]
    newColumns.splice(source.index, 1)
    newColumns.splice(destination.index, 0, columns[source.index])
    setColumns(newColumns)
  }

  const renderListItem = ({ field, content, label, hide, manageable = true, permanent }, index) => {
    if(!manageable) {
      return
    }
    const columnName = label ? label : content
    return (
      <Draggable draggableId={ field } index={ index } key={ field }>
        { provided => (
          <List.Item
            className={ styles.listItem }
            key={ index }
            ref={ provided.innerRef }
            { ...provided.draggableProps }
            leadingComponent={ (
              <Checkbox
                onChange={ () => handleCheckboxChange(field) }
                id={ field }
                checked={ !hide }
                disabled={ permanent }
              />
            ) }
            trailingComponent={ (
              <div className={ styles.drag } { ...provided.dragHandleProps }>
                <DragIcon />
              </div>
            ) }
          >
            <label
              className={ classNames(styles.columnName, { [styles.permanent]: permanent }) }
              htmlFor={ field }>
              { columnName }
            </label>
          </List.Item>
        ) }
      </Draggable>
    )
  }

  const renderColumnList = () => (
    <DragDropContext onDragEnd={ onDragEnd }>
      <Droppable droppableId={ 'column-management' }>
        { provided => (
          <List
            className={ styles.columnList }
            ref={ provided.innerRef }
            { ...provided.droppableProps }
          >
            { columns.map(renderListItem) }
            { provided.placeholder }
          </List>
        ) }
      </Droppable>
    </DragDropContext>
  )

  const handleSave = () => {
    setContextColumn(columns)
    setColumnManagementIsOpen(false)
    onChange(columns)
  }

  return (
    <Dialog
      className={ styles.columnManagement }
      isOpen={ isOpen }
      onClose={ handleDialogClose }
    >
      <Dialog.Header>
        { LanguageService.getTranslation('columnManagement') }
      </Dialog.Header>
      { renderColumnList() }
      <Dialog.Footer className={ styles.dialogFooter }>
        <Button
          size={ 'small' }
          onClick={ handleSave }
        >
          { LanguageService.getTranslation('save') }
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

ColumnManagement.defaultProps = {
  onChange: () => {}
}

ColumnManagement.propTypes = {
  /** Callback fire when columns changed */
  onChange: propTypes.func
}

export default ColumnManagement
