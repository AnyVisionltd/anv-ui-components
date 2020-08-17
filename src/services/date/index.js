import moment from 'moment'

export const formatDate = date => {
  return moment(date).format('L')
}

export const formatDateTime = date => {
  return `${moment(date).format('L')} ${moment(date).format('HH:MM')}`
}