import React from 'react'
import {
  CheckCircleFilled,
  TimesCircleFilled,
  InfoCircleOutlined,
} from '@anyvision/anv-icons'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Tooltip } from '../Tooltip'
import { Button } from '../Button'
import StaticInfoTable from './StaticInfoTable'
import styles from '../../storybook/index.module.scss'

export default {
  title: 'Content/StaticInfoTable',
  component: StaticInfoTable,
  subcomponents: {
    StaticInfoTableHeader: StaticInfoTable.Header,
    StaticInfoTableBody: StaticInfoTable.Body,
  },
  decorators: [centerDecorator],
}

const title = (
  <p style={{ display: 'flex', flexDirection: 'column' }}>
    <InfoCircleOutlined style={{ fill: 'green', fontSize: '24px' }} />{' '}
    StaticTableText
  </p>
)

const viewer = {
  roles: 'Viewer',
  watchList: {
    title,
    tooltipData: 'Limited A Tooltip',
  },
  liveCameras: {
    title,
    tooltipData: 'Limited A Tooltip',
  },
  reports: false,
  adminSettings: false,
}

const operator = {
  roles: 'Operator',
  watchList: {
    title: 'Limited B',
    tooltipData: 'Limited B Tooltip',
  },
  liveCameras: {
    title: 'Limited B A 1231234562222',
    tooltipData: 'Limited B Tooltip',
  },
  reports: false,
  adminSettings: false,
}

const superator = {
  roles: 'Superator',
  watchList: true,
  liveCameras: true,
  reports: true,
  adminSettings: false,
}

const admin = {
  roles: 'Admin',
  watchList: true,
  liveCameras: true,
  reports: true,
  adminSettings: {
    title: 'Limited',
    tooltipData: 'Settings Limit',
  },
}
const superAdmin = {
  roles: 'Super Admin',
  watchList: true,
  liveCameras: true,
  reports: true,
  adminSettings: true,
}

const rolesPermissions = [viewer, operator, superator, admin, superAdmin]

const tableItemStyle = value => ({
  width: '100%',
  height: '100%',
  alignSelf: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fill: value ? 'green' : 'red',
  fontSize: '24px',
})

const renderTableItem = value => {
  if (value.title) {
    const { title, tooltipData } = value
    return (
      <Tooltip content={tooltipData}>
        <div>{title}</div>
      </Tooltip>
    )
  }

  return (
    <div style={tableItemStyle(value)}>
      {value ? <CheckCircleFilled /> : <TimesCircleFilled />}
    </div>
  )
}

const featureHeaders = ['watchList', 'liveCameras', 'reports', 'adminSettings']
const tableFeatureHeaders = featureHeaders.map(header => ({
  field: header,
  content:
    header[0].toUpperCase() +
    header.replace(/([a-z])([A-Z])/g, '$1 $2').slice(1),
  columnRender: renderTableItem,
}))

const headers = [
  {
    field: 'roles',
    content: 'Role',
    width: '240',
    className: styles.primaryBackgroundColor,
  },
  ...tableFeatureHeaders,
]

export const Basic = () => (
  <StaticInfoTable>
    <StaticInfoTable.Header columns={headers} />
    <StaticInfoTable.Body data={rolesPermissions} />
  </StaticInfoTable>
)

const renderBottom = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Button value='ghost'>upgrade</Button>
  </div>
)

const headersCallToAction = ['team', 'organization', 'enterprise'].map(
  value => ({
    field: value,
    content: value[0].toUpperCase() + value.slice(1),
    columnBottomRender: renderBottom,
    width: '240',
    className: styles.primaryBackgroundColor,
  }),
)

const rowCallToAction = {
  team: 'Text1',
  organization: 'Text2',
  enterprise: 'Text3',
}

const dataCallToAction = new Array(3).fill(rowCallToAction)

export const WithCallToAction = () => (
  <StaticInfoTable>
    <StaticInfoTable.Header columns={headersCallToAction} />
    <StaticInfoTable.Body data={dataCallToAction} />
  </StaticInfoTable>
)
