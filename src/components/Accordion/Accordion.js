import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ArrowRight } from '@anyvision/anv-icons'
import { Tooltip } from '../Tooltip'
import styles from './Accordion.module.scss'

const Accordion = ({
  className,
  data = [],
  expandAll = false,
  disableAll = false,
}) => {
  const [selected, setSelected] = useState({})

  useEffect(() => {
    setSelected(
      expandAll
        ? Array.from(Array(data.length).keys()).reduce((acc, cur) => {
            acc[cur] = true
            return acc
          }, {})
        : {},
    )
  }, [expandAll, data.length])

  const handleItemSelected = idx => {
    if (disableAll) {
      return
    }
    if (selected[idx]) {
      setSelected(prev => ({ ...prev, [idx]: false }))
    } else {
      setSelected(prev => ({ ...prev, [idx]: true }))
    }
  }

  return (
    <div className={classNames(styles.accordion, className)}>
      {data.map(({ title, content, disabled }, idx) => {
        const isActive = selected[idx]
        return (
          <div
            key={idx}
            className={classNames(styles.item, {
              [styles.active]: isActive,
              [styles.disabled]: disableAll || disabled,
            })}
            data-testid={`accordion-item-${idx}`}
          >
            <div
              className={styles.title}
              onClick={() => handleItemSelected(idx)}
              data-testid={`accordion-item-${idx}_title`}
            >
              <span className={styles.icon}>
                <ArrowRight />
              </span>
              {typeof title === 'string' ? (
                <Tooltip content={title} overflowOnly>
                  <div>{title}</div>
                </Tooltip>
              ) : (
                title
              )}
            </div>
            <div className={styles.content}>{content}</div>
          </div>
        )
      })}
    </div>
  )
}

Accordion.defaultProps = {
  className: '',
  data: [],
  disableAll: false,
  expandAll: false,
}

Accordion.propTypes = {
  /** For css customization. */
  className: PropTypes.string,
  /** Disable all accordion items. */
  disableAll: PropTypes.bool,
  /** Expand all accordion items initally. */
  expandAll: PropTypes.bool,
  /**
   * Array of items.
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.any,
      content: PropTypes.any,
      disabled: PropTypes.bool,
    }),
  ),
}

export default Accordion
