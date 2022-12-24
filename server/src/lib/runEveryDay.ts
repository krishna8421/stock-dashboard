const cron = require("node-cron");

export const runEveryDay = (cronFunction: any) =>
  // cron.schedule("0 0 * * *", cronFunction);
  cron.schedule("* * * * *", cronFunction);
