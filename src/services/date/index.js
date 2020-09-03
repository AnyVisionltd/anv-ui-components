import moment from 'moment'

export const formatDate = date => {
  if(moment(date).isValid()){
    return moment(date).format('L')
  }
  return ''
}

export const formatDateTime = date => {
  if(moment(date).isValid()) {
    return `${moment(date).format('L')} ${moment(date).format('HH:mm')}`
  }
  return ''
}
