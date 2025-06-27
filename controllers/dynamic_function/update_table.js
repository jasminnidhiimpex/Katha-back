const db = require("../../model/connection");


const getTableColumns = (tableNames, callback) => {
    // Convert comma-separated values to an array if needed
    if (typeof tableNames === 'string') {
        tableNames = tableNames.split(',').map(name => name.trim());
    }

    const placeholders = tableNames.map(() => '?').join(', ');
    const query = `
        SELECT TABLE_NAME, COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME IN (${placeholders}) AND TABLE_SCHEMA = DATABASE();
    `;

    db.query(query, tableNames, (err, results) => {
        if (err) return callback(err, null);

        const tableColumnsMap = results.reduce((acc, row) => {
            acc[row.TABLE_NAME] = acc[row.TABLE_NAME] || [];
            acc[row.TABLE_NAME].push(row.COLUMN_NAME);
            return acc;
        }, {});

        callback(null, tableColumnsMap);
    });
};

const updateTable = (tableNames, fields, conditions, callback) => {
    getTableColumns(tableNames, (err, tableColumnsMap) => {
        if (err) return callback(err, null);

        let whereClause = '';
        let conditionsValues = [];

        const processConditions = (conditions) => {
            if (Array.isArray(conditions)) {
                return conditions.map(processConditions).join(' OR ');
            }

            if (typeof conditions === 'object') {
                return Object.entries(conditions)
                    .map(([key, value]) => {
                        if (value === null) return `${key} IS NULL`;
                        if (Array.isArray(value) && value.length > 0) {
                            conditionsValues.push(...value);
                            return `${key} IN (${value.map(() => '?').join(', ')})`;
                        } else {
                            conditionsValues.push(value);
                            return `${key} = ?`;
                        }
                    })
                    .join(' AND ');
            }
            throw new Error('Invalid conditions format');
        };

        try {
            if (conditions) {
                whereClause = processConditions(conditions);
            } else {
                throw new Error('Update operation requires conditions to prevent updating all rows.');
            }
        } catch (error) {
            return callback(error, null);
        }

        let completed = 0;
        let errors = [];
        let resultsArray = [];

        Object.entries(tableColumnsMap).forEach(([tableName, columns]) => {
            // Filter only valid fields that exist in this table
            const validFields = Object.entries(fields)
                .filter(([key, value]) => value !== undefined && columns.includes(key))
                .map(([key, value]) => ({ key, value }));

            if (validFields.length === 0) {
                completed++;
                return;
            }

            const setClause = validFields.map(({ key }) => `${key} = ?`).join(', ');
            const values = validFields.map(({ value }) => value);

            const updateQuery = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;

            db.query(updateQuery, [...values, ...conditionsValues], (err, results) => {
                if (err) {
                    console.error(`Error updating table ${tableName}:`, err);
                    errors.push({ table: tableName, error: err });
                } else {
                    resultsArray.push({ table: tableName, results });
                }

                completed++;
                if (completed === Object.keys(tableColumnsMap).length) {
                    if (errors.length) {
                        return callback(errors, null);
                    }
                    callback(null, resultsArray);
                }
            });
        });
    });
};

module.exports = updateTable;