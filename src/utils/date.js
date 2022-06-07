export const getVideoDurationToShow = timeInSeconds => {
  const dateObj = new Date(timeInSeconds * 1000)
  const hours = dateObj.getUTCHours()
  const minutes = dateObj.getUTCMinutes()
  const seconds = dateObj.getSeconds()
  let timeStr = ''
  if (hours > 0) {
    timeStr += `${hours}:`
  }
  if (minutes > 0 && minutes < 10) {
    timeStr += `0${minutes}:`
  } else if (minutes > 0 && minutes >= 10) {
    timeStr += `${minutes}:`
  } else if (minutes === 0) {
    timeStr += '00:'
  }
  if (seconds === 0) {
    timeStr += '00'
  } else if (seconds < 10) {
    timeStr += `0${seconds}`
  } else {
    timeStr += `${seconds}`
  }

  return timeStr
}
