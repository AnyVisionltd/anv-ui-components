import React from 'react'
import propTypes from 'prop-types'
import { NoResults, ErrorCircleOutlined } from '@anyvision/anv-icons'
import languageService from '../../../services/language'
import { Button } from '../../Button'
import styles from './EmptyTreeSearch.module.scss'

export const emptyListTypes = Object.freeze({
  NO_ITEMS_IN_LIST: 0,
  NO_RESULTS_FOUND: 1,
})

const getTranslation = path => languageService.getTranslation(`${path}`)

const EmptyTreeSearch = ({ type, onClearSearch, noItemsMessage }) => {
  const content =
    type === emptyListTypes.NO_ITEMS_IN_LIST ? (
      <>
        <ErrorCircleOutlined />
        <div className={styles.noResultsText}>{noItemsMessage}</div>
      </>
    ) : (
      <>
        <NoResults />
        <div className={styles.noResultsText}>
          {getTranslation('noResultsFound')}
        </div>
        <Button
          className={styles.clearButton}
          onClick={onClearSearch}
          size='small'
          variant='ghost'
        >
          {getTranslation('clearSearch')}
        </Button>
      </>
    )

  return <div className={styles.noResults}>{content}</div>
}

EmptyTreeSearch.defaultProps = {
  onClearSearch: () => {},
}

EmptyTreeSearch.propTypes = {
  /** A callback to clear search query in input. */
  onClearSearch: propTypes.func,
  /** The reason empty list is called, wether there are no items or there are no search results. */
  type: propTypes.oneOf(Object.values(emptyListTypes)),
  /** Text to show when there are no items in list. */
  noItemsMessage: propTypes.string,
}

export default EmptyTreeSearch
