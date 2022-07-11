import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import {
  DateTimeVarientType,
  DynamicFilterDateTimeProps,
  DefaultValueFrom,
  DefaultValueTo,
  countDecimals,
  isEmptyString,
  getDefaultDurationInputValue,
  DefaultVarientType,
  DurationOptions,
} from '../../utils'
import { Tooltip } from '../../../Tooltip'
import styles from './DynamicFilterDateTime.module.scss'
import moment from 'moment'
import DynamicFilterDateTimeDuration from './components/DynamicFilterDateTimeDuration'
import { minDurationValue } from '../../utils'
import DynamicFilterDateTimeDate from './components/DynamicFilterDateTimeDate'
import { useComponentTranslation } from '../../../../hooks/UseComponentTranslation'

const getSelectedType = (varientType: DateTimeVarientType) => {
  switch (varientType) {
    case DateTimeVarientType.All:
      return DateTimeVarientType.Duration
    case DateTimeVarientType.Duration:
      return DateTimeVarientType.Duration
    case DateTimeVarientType.Time:
      return DateTimeVarientType.Time
  }
}

const DynamicFilterDateTime: FC<DynamicFilterDateTimeProps> = ({
  from,
  to,
  otherPropsFrom,
  otherPropsTo,
  varientType,
  elementKey,
  title,
}): ReactElement => {
  const { actions, state } = useContext(DynamicFilterContext)
  const [selectedType, setSelectedType] = useState(
    getSelectedType(varientType || DefaultVarientType),
  )
  const [durationInputValue, setDurationInputValue] = useState(
    getDefaultDurationInputValue(
      from || DefaultValueFrom,
      to || DefaultValueTo,
    ),
  )
  const componentState = state.elementsState[elementKey]
  const {
    updateElementsState,
    setIsDatePickerOpen,
    setIsMenuDropdownOpen,
  } = actions
  const { getComponentTranslation } = useComponentTranslation()
  const translations = getComponentTranslation('dynamicFilterDateTime')

  const durationOptions = Object.values(DurationOptions).map(value => {
    return {
      id: value,
      value: translations[value],
    }
  })

  const [selectedDurationOption, setSelectedDurationOption] = useState(
    durationOptions[1],
  )

  useEffect(() => {
    updateElementsState({
      [elementKey]: {
        selectedTime: {
          from: from || DefaultValueFrom,
          to: to || DefaultValueTo,
        },
      },
    })
  }, [elementKey, from, to, updateElementsState])

  useEffect(() => {
    const fromDate = moment()
      .subtract(Number(durationInputValue), selectedDurationOption.id)
      .toISOString()
    updateElementsState({
      [elementKey]: {
        selectedTime: {
          from: fromDate,
          to: componentState?.to || to || DefaultValueTo,
        },
      },
    })
  }, [
    selectedDurationOption,
    durationInputValue,
    elementKey,
    componentState?.to,
    to,
    updateElementsState,
  ])

  const onDurationInputChange = ({ target: { value } }) => {
    if (Number(value) < minDurationValue || countDecimals(value) > 0) {
      return
    }
    const newValue = isEmptyString(value) ? '' : Number(value)
    setDurationInputValue(newValue as any)
  }

  const onChangeDates = (type: string, selectedDate: string) => {
    updateElementsState({
      [elementKey]: {
        selectedTime: { ...componentState.selectedTime, [type]: selectedDate },
      },
    })
  }

  const onDatePickerOpen = useCallback(
    (isOpen: boolean) => {
      setIsDatePickerOpen(isOpen)
    },
    [setIsDatePickerOpen],
  )

  const renderDateTimeDuration = () => {
    return (
      <DynamicFilterDateTimeDuration
        durationInputValue={durationInputValue}
        onDurationInputChange={onDurationInputChange}
        selectedDurationOption={selectedDurationOption}
        selectedType={selectedType}
        setSelectedDurationOption={setSelectedDurationOption}
        setSelectedType={setSelectedType}
        styles={styles}
        varientType={varientType || DefaultVarientType}
        translations={translations}
        durationOptions={durationOptions}
        setIsMenuDropdownOpen={setIsMenuDropdownOpen}
      />
    )
  }

  const renderDateTimeDate = () => {
    return (
      <DynamicFilterDateTimeDate
        styles={styles}
        onChangeDates={onChangeDates}
        onDatePickerOpen={onDatePickerOpen}
        otherPropsFrom={otherPropsFrom}
        otherPropsTo={otherPropsTo}
        selectedTime={componentState.selectedTime}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        varientType={varientType || DefaultVarientType}
        translations={translations}
      />
    )
  }

  const renderByVarient = () => {
    switch (varientType || DefaultVarientType) {
      case DateTimeVarientType.Duration:
        return renderDateTimeDuration()
      case DateTimeVarientType.Time:
        return renderDateTimeDate()
      default:
        return (
          <>
            {renderDateTimeDuration()}
            {renderDateTimeDate()}
          </>
        )
    }
  }

  return (
    <div className={styles.dateTimeContainer}>
      <Tooltip overflowOnly placement='right' content={title}>
        <div className={styles.title}>{title}</div>
      </Tooltip>
      {componentState?.selectedTime && renderByVarient()}
    </div>
  )
}

export default DynamicFilterDateTime
