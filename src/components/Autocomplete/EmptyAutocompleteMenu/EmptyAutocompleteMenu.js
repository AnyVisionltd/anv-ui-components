import React from 'react'
import propTypes from 'prop-types'
import { ImageSearch } from '@anyvision/anv-icons'
import styles from './EmptyAutocompleteMenu.module.scss'

const EmptyAutocompleteMenu = ({ noOptionsMessage, searchValue }) => {
  const renderMessage = () => {
    if (typeof noOptionsMessage === 'string') {
      return (
        <div className={styles.emptyAutocomplete}>
          <ImageSearch /> <p>{noOptionsMessage}</p>
        </div>
      )
    }

    return noOptionsMessage(searchValue)
  }

  return renderMessage()
}

EmptyAutocompleteMenu.propTypes = {
  /** Text / component to display when there are no options. */
  noOptionsMessage: propTypes.oneOfType([propTypes.string, propTypes.func]),
  /** Value user entered. */
  searchValue: propTypes.string,
}

export default EmptyAutocompleteMenu
