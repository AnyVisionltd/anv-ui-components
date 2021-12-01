import React from 'react'
import propTypes from 'prop-types'
import languageService from '../../../services/language'
import { Button } from '../../Button'
import { ReactComponent as NoResultsIcon } from '../../../assets/svg/NoResults.svg'
import styles from './EmptyTreeSearch.module.scss'

const getTranslation = path => languageService.getTranslation(`${path}`)

const EmptyTreeSearch = ({ onClearSearch }) => (
  <div className={styles.noResults}>
    <NoResultsIcon />
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
  </div>
)

EmptyTreeSearch.defaultProps = {
  onClearSearch: () => {},
}

EmptyTreeSearch.propTypes = {
  onClearSearch: propTypes.func,
}

export default EmptyTreeSearch
