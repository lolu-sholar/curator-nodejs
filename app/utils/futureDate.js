// Generate future date relative to now
const futureDate = (timeLapse, unit = 'minute', past, real) => {
  // Check unit 
  switch(unit) {
    case 'sec':
    case 'second':
    case 'seconds':
      return new Date((past ? 0 : Date.now()) + (timeLapse * (real ? 1 : 1000)))
    case 'min':
    case 'minute':
    case 'minutes':
      return new Date((past ? 0 : Date.now()) + (timeLapse * 60 * (real ? 1 : 1000)))
    case 'hr':
    case 'hour':
    case 'hours':
      return new Date((past ? 0 : Date.now()) + (timeLapse * 60 * 60 * (real ? 1 : 1000)))
    case 'day':
    case 'days':
      return new Date((past ? 0 : Date.now()) + (timeLapse * 24 * 60 * 60 * (real ? 1 : 1000)))
  }
}
futureDate.getNow = () => {
  return Date.now()
}
futureDate.getTime = (dateTime) => {
  return (new Date(dateTime ?? Date.now())).getTime() / 1000
}
futureDate.isTimeBeforeNow = (dateTime) => {
  return (((new Date(dateTime)).getTime() / 1000) < ((new Date()).getTime() / 1000))
}

module.exports = futureDate