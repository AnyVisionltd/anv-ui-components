import React from 'react'
import propTypes from 'prop-types'
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

EmptyDropdownMenu.propTypes = {
  /** Text / component to display when there are no options. */
  noOptionsMessage: propTypes.oneOfType([propTypes.string, propTypes.func]),
  /** Value user entered. */
  searchValue: propTypes.string,
}

export default EmptyDropdownMenu
