import React from 'react'
import { ImageSearch } from '@anyvision/anv-icons'
import styles from './EmptyDropdownMenu.module.scss'

const EmptyDropdownMenu = ({ noOptionsMessage, searchValue }) => {
  const renderMessage = () => {
    if (typeof noOptionsMessage === 'string') {
      return (
        <div className={styles.emptyDropdown}>
          <ImageSearch /> <p>{noOptionsMessage}</p>
        </div>
      )
    }

    return noOptionsMessage(searchValue)
  }

  return renderMessage()
}

export default EmptyDropdownMenu
