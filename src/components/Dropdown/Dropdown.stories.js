import React, { useState } from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Chip } from '../Chip'
import Dropdown from './Dropdown'
import styles from '../../storybook/index.module.scss'
import dropdownStyles from '../../storybook/dropdown.module.scss'

export default {
  title: 'Content/Dropdown',
  component: Dropdown,
  decorators: [centerDecorator],
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  marginBottom: '240px',
}

const items = [
  { myValue: 'Banana', id: 1 },
  { myValue: 'Apple', id: 2 },
  { myValue: 'Mango', id: 3, disabled: true },
  { myValue: 'Blueberry', id: 4 },
  { myValue: 'Cucumber', id: 5 },
  { myValue: 'Olives', id: 6, disabled: true },
  { myValue: 'Parsley', id: 7 },
  { myValue: 'Berries', id: 8 },
  { myValue: 'Raspberry', id: 9 },
  { myValue: 'Strawberry', id: 10 },
  { myValue: 'Watermelon', id: 11 },
  { myValue: 'Kiwi', id: 12 },
]

const genders = [
  { value: 'Male', id: 1 },
  { value: 'Female', id: 2 },
  { value: 'I do not know', id: 3, disabled: true },
  { value: 'Very very very very very very very long paragraph', id: 4 },
]

export const Basic = () => {
  const [, setValues] = useState([])
  const handleChange = newValues => setValues(newValues)

  return (
    <div style={{ ...containerStyle, marginBottom: '200px' }}>
      <Dropdown
        options={genders}
        label='Gender'
        defaultValues={[genders[0]]}
        onChange={handleChange}
      />
    </div>
  )
}

export const WithoutSearch = () => {
  const [, setValues] = useState([])
  const handleChange = newValues => setValues(newValues)

  return (
    <div style={{ ...containerStyle, marginBottom: '200px' }}>
      <Dropdown
        options={genders}
        label='Gender'
        defaultValues={[genders[0]]}
        onChange={handleChange}
        isSearchable={false}
      />
    </div>
  )
}

export const Multiple = () => {
  const [, setValues] = useState([])
  const handleChange = newValues => setValues(newValues)

  return (
    <div style={{ ...containerStyle, marginBottom: '320px' }}>
      <Dropdown
        options={items}
        multiple
        label='Fruits'
        onChange={handleChange}
        isSelectedShownInHeader={false}
        displayValue='myValue'
      />
    </div>
  )
}

export const MultipleWithSelectedInHeader = () => {
  const [, setValues] = useState([])
  const handleChange = newValues => setValues(newValues)

  return (
    <div style={{ ...containerStyle, width: '450px' }}>
      <Dropdown
        className={styles.fullWidth}
        options={items}
        multiple
        label='Fruits'
        onChange={handleChange}
        isSelectedShownInHeader
        displayValue='myValue'
      />
    </div>
  )
}

export const ValueRender = () => {
  const [, setValues] = useState([])
  const handleChange = newValues => setValues(newValues)

  return (
    <div style={containerStyle}>
      <Dropdown
        multiple
        onChange={handleChange}
        options={items}
        label='Fruits'
        displayValue='myValue'
        valueRender={value => <Chip label={value} />}
      />
    </div>
  )
}

export const Disabled = () => (
  <div style={containerStyle}>
    <Dropdown
      options={genders}
      label='Gender'
      defaultValues={[genders[0]]}
      disabled
    />
  </div>
)

export const Error = () => (
  <div style={containerStyle}>
    <Dropdown options={genders} label='Gender' message='Some error' error />
  </div>
)

const subjectGroups = [
  { name: 'Default Group', id: '1', subjectsCount: 100 },
  { name: 'Office', id: '2', subjectsCount: 19 },
  { name: 'Network', id: '3', subjectsCount: 100 },
  { name: 'Kitchen', id: '4', subjectsCount: 19 },
  { name: 'Store', id: '5', subjectsCount: 100 },
  { name: 'Gym', id: '6', subjectsCount: 19 },
]

export const MultipleDropdownControlledFromOutside = () => {
  const [options, setOptions] = useState(subjectGroups)

  const [, setValues] = useState({ excludeMode: false, items: [] })
  const onSelect = newValues => setValues(newValues)

  const onSearch = searchValue => {
    setTimeout(() => {
      setOptions(
        subjectGroups.filter(item =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )
    }, 200)
  }

  const optionRender = (option, { renderCheckbox }) => {
    const { name, subjectsCount } = option
    return (
      <div className={dropdownStyles.optionRenderExample}>
        <div className={dropdownStyles.checkbox}>{renderCheckbox()}</div>
        <div className={dropdownStyles.content}>
          <p className={dropdownStyles.title}>{name}</p>
          <p className={dropdownStyles.body}>{subjectsCount} Subjects</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...containerStyle, width: '450px', marginBottom: '300px' }}>
      <Dropdown
        className={styles.fullWidth}
        options={options}
        multiple
        label='Fruits'
        onChange={onSelect}
        isSelectedShownInHeader={false}
        displayValue='name'
        keyValue='id'
        addBulkSelectionButton
        selfControlled={false}
        onSearch={onSearch}
        optionRender={optionRender}
        menuItemHeight={64}
        menuClassName={dropdownStyles.menu}
        bulkSelectionClassName={dropdownStyles.bulkSelect}
      />
    </div>
  )
}

export const InPortalMultipleDropdown = () => {
  const [, setValues] = useState([])
  const handleChange = newValues => setValues(newValues)

  return (
    <div style={containerStyle}>
      <Dropdown
        options={items}
        multiple
        label='Fruits'
        onChange={handleChange}
        isSelectedShownInHeader={false}
        displayValue='myValue'
        inPortal
      />
    </div>
  )
}

export const InPortalDropdown = () => {
  const [, setValues] = useState([])
  const handleChange = newValues => setValues(newValues)

  return (
    <div style={{ ...containerStyle, marginBottom: '200px' }}>
      <Dropdown
        options={genders}
        label='Gender'
        defaultValues={[genders[0]]}
        onChange={handleChange}
        inPortal
      />
    </div>
  )
}
