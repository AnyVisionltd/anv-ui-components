import React from 'react'
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  ErrorCircleOutlined,
  TimesCircleFilled,
} from '@anyvision/anv-icons'
import styles from '../../storybook/index.module.scss'


const map = {
  success: {
    color: styles.successColor,
    icon: <CheckCircleOutlined />,
  },
  info: {
    color: styles.infoColor,
    icon: <InfoCircleOutlined />,
  },
  error: {
    color: styles.errorColor,
    icon: <TimesCircleFilled />,
  },
  alert: {
    color: styles.alertColor,
    icon: <ErrorCircleOutlined />,
  },
}

const toastMessageTypeMapper = type => {
  return map[type]
}

export default toastMessageTypeMapper
