const fs = require("fs");

export const cleanJson = (fileName: string) => {
  fs.readFile(fileName, "utf8", function (err: any, data: string) {
    if (err) throw err;
    const newData = data
      .replace(/"{\\/g, "{")
      .replace(/\\/g, "")
      .replace(/}"/g, "}");
    fs.writeFile(fileName, newData, (err: any) => {
      if (err) throw err;
    });
  });
};
