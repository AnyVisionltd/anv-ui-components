import React from 'react'
import { CheckCircleFilled, TimesCircleFilled } from '@anyvision/anv-icons'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Tooltip } from '../Tooltip'
import StaticInfoTable from './StaticInfoTable'
import styles from './StaticInfoTable.module.scss'

export default {
  title: 'Content/StaticInfoTable',
  component: StaticInfoTable,
  decorators: [centerDecorator],
}

const viewer = {
  roles: 'Viewer',
  watchList: {
    title: 'Limited A',
    tooltipData: 'Limited A Tooltip',
  },
  liveCameras: {
    title: 'Limited A',
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
    title: 'Limited B',
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
    <div
      style={{
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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
    className: styles.roles,
  },
  ...tableFeatureHeaders,
]

export const Basic = () => (
  <StaticInfoTable data={rolesPermissions} columns={headers} />
)
