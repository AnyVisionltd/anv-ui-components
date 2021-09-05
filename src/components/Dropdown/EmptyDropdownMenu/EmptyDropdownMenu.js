import React from 'react'
import { ReactComponent as NoResultsIcon } from '../../../assets/svg/NoResults.svg'
import styles from './EmptyDropdownMenu.module.scss'

const EmptyDropdownMenu = ({ noOptionsMessage, searchValue }) => {
  const renderMessage = () => {
    if (noOptionsMessage === undefined) {
      return (
        <div className={styles.emptyDropdown}>
          <NoResultsIcon /> <p>No results found</p>
        </div>
      )
    }

    if (typeof noOptionsMessage === 'string') {
      return noOptionsMessage
    }

    return noOptionsMessage(searchValue)
  }

  return renderMessage()
}

export default EmptyDropdownMenu
