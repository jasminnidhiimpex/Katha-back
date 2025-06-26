const logger = require("../../logger");
const db = require("../../model/connection");

const insertTable = (tableName, data, callback) => {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return callback(new Error("No data provided"));
  }

  // Normalize to array
  const dataArray = Array.isArray(data) ? data : [data];
  const columns = Object.keys(dataArray[0]);

  const placeholders = dataArray.map(() => `(${columns.map(() => '?').join(', ')})`).join(', ');
  const values = dataArray.flatMap(row => columns.map(col => row[col]));

  const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${placeholders}`;
  db.query(insertQuery, values, (err, result) => {
    if (err) {
        logger.error("Insert error:", err);
        return callback(err);
    }
    callback(null, result);
  });
};

module.exports = insertTable;