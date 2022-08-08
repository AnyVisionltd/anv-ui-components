import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ArrowRight } from '@anyvision/anv-icons'
import { Tooltip } from '../Tooltip'
import styles from './Accordion.module.scss'

const Accordion = ({ className, data = [], expandAll, disableAll }) => {
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

  const handleItemSelected = id => {
    if (disableAll) {
      return
    }
    setSelected(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className={classNames(styles.accordion, className)}>
      {data.map(({ id, title, content, disabled }) => {
        const isActive = selected[id]
        return (
          <div
            key={id}
            className={classNames(styles.item, {
              [styles.active]: isActive,
              [styles.disabled]: disableAll || disabled,
            })}
            data-testid={`accordion-item-${id}`}
          >
            <div
              className={styles.title}
              onClick={() => handleItemSelected(id)}
              data-testid={`accordion-item-${id}_title`}
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
