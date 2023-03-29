import React, {
  useState,
  Children,
  cloneElement,
  isValidElement,
  useEffect,
} from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { useFormProvider } from '../FormProvider/useFormProvider'
import { SelectionGroupItem } from './SelectionGroupItem'
import styles from './SelectionGroup.module.scss'

const SelectionGroup = ({
  variant,
  value,
  view,
  defaultValue,
  onChange,
  disabled,
  className,
  children,
  qa='',
  ...otherProps
}) => {
  const { isView } = useFormProvider({ view })

  const [selectedValue, setSelectedValue] = useState(value || defaultValue)

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const onSelectionChange = newValue => {
    !value && setSelectedValue(newValue)
    selectedValue !== newValue && onChange(newValue)
  }

  const childrenWithProps = () => {
    let leastOneActive
    return Children.map(children, child => {
      // Checking isValidElement is the safe way and avoids a TS error too.
      if (isValidElement(child) && child.type === SelectionGroupItem) {
        const active = child.props.value === selectedValue
        if (active && variant !== 'ghost') {
          leastOneActive = true
        }
        return cloneElement(child, {
          variant,
          onChange: onSelectionChange,
          active,
          leastOneActive,
          disabled: child.props.disabled || disabled || isView,
        })
      }
      return child
    })
  }

  const classes = classNames(styles.selectionGroup, styles[variant], className)

  return (
    <div className={classes} data-testid={qa + '-selection-group'} {...otherProps}>
      {childrenWithProps()}
    </div>
  )
}

SelectionGroup.defaultProps = {
  variant: 'sharp',
  disabled: false,
  onChange: () => {},
}

SelectionGroup.propTypes = {
  /** The variant of the group. */
  variant: propTypes.oneOf(['sharp', 'round', 'ghost']),
  /** Selected value. */
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  /** Default selected value. */
  defaultValue: propTypes.oneOfType([propTypes.string, propTypes.number]),
  /** Callback fired when selected item changed. */
  onChange: propTypes.func,
  /** If true, will be view mode. <br/>
   *  <i style="background-color:#ffc40026;">NOTE: Also from \<FormProvider> by context. </i>
   */
  view: propTypes.bool,
  /** If true disabled all items. */
  disabled: propTypes.bool,
  /** SelectionGroup.Item elements . */
  children: propTypes.arrayOf(propTypes.element),
  /** For css customization. */
  className: propTypes.string,
}

SelectionGroup.Item = SelectionGroupItem

export default SelectionGroup
