export function formatDate (date) {
  const month = date.getMonth() + 1
  const monthStr = month < 10 ? '0' + month : '' + month
  const day = date.getDate()
  const dayStr = day < 10 ? '0' + day : '' + day
  return date.getFullYear() + '-' + monthStr + '-' + dayStr
}
export function formatYearWeek (date, weekFirstDay = 1, yearFirstWeekNumber = 3) {
  const dateMilliseconds = 24 * 60 * 60 * 1000
  // weekEndDate 本周最后一天
  const weekEndDate = new Date(date)
  weekEndDate.setDate(weekEndDate.getDate() + ((weekFirstDay - 1) + 7 - (weekEndDate.getDay() || 7)) % 7)
  // year 本年年份
  let year = weekEndDate.getFullYear()
  if (weekEndDate.getMonth() === 0 && weekEndDate.getDate() < yearFirstWeekNumber) {
    year--
  }
  // yearBeginDate 开始周第一天
  const yearBeginDate = new Date(year, 0, 1)
  yearBeginDate.setDate(yearBeginDate.getDate() + (weekFirstDay - 7 - (yearBeginDate.getDay() || 7)) % 7)
  if (yearBeginDate.getFullYear() !== year && yearBeginDate.getDate() < (31 - yearFirstWeekNumber)) {
    yearBeginDate.setDate(yearBeginDate.getDate() + 7)
  }
  // week 本周第几周
  const week = Math.floor(((weekEndDate - yearBeginDate) / dateMilliseconds + 7) / 7)
  return year * 100 + week
}
export function formatYearMonth (date) {
  return date.getFullYear() * 100 + date.getMonth() + 1
}
export function formatYear (date) {
  return date.getFullYear()
}
