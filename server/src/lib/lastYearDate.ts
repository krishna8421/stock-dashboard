export const lastYearDate = (): string => {
    const currentDate = new Date().toISOString().split('T')[0].split("-")
    currentDate[0] = (parseInt(currentDate[0]) - 1).toString()
    return currentDate.join("-")
}