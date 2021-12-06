import React from 'react'
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  ErrorCircleOutlined,
  TimesCircleOutlined,
} from '@anyvision/anv-icons'
import styles from '../../storybook/index.module.scss'

const map = {
  success: {
    fillColor: styles.successFillColor,
    icon: <CheckCircleOutlined />,
  },
  info: {
    fillColor: styles.infoFillColor,
    icon: <InfoCircleOutlined />,
  },
  error: {
    fillColor: styles.errorFillColor,
    icon: <TimesCircleOutlined />,
  },
  alert: {
    fillColor: styles.alertFillColor,
    icon: <ErrorCircleOutlined />,
  },
}

const toastMessageTypeMapper = type => map[type]

export default toastMessageTypeMapper
