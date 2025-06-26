const logger = require('../logger');
const db = require('../model/connection');

exports.getYajmanYadi = (req, res) => {
  try {
    const query = `SELECT * FROM yajman_members ORDER BY yajman_id, is_main_member DESC, id`;
    db.query(query, (err, results) => {
      if (err) {
        logger.error("Error getting yajman_members", err);
        return res.status(500).json({ message: 'Error getting yajman_members', error: err.message });
      }
  
      const yajmanMap = {};
  
      results.forEach(member => {
        const {
          id,
          yajman_id,
          full_name,
          age,
          gender,
          aadhaar,
          mobile,
          is_main_member
        } = member;
  
        if (is_main_member === 1) {
          yajmanMap[yajman_id] = {
            id: yajman_id,
            name: full_name,
            age,
            gender,
            aadhaar,
            mobile,
            children: []
          };
        } else {
          // Ensure parent exists before pushing child
          if (!yajmanMap[yajman_id]) {
            yajmanMap[yajman_id] = {
              id: yajman_id,
              name: 'Unknown',
              age: null,
              gender: null,
              aadhaar: null,
              mobile: null,
              children: []
            };
          }
          yajmanMap[yajman_id].children.push({
            id,
            name: full_name,
            age,
            gender,
            aadhaar,
            mobile,
          });
        }
      });
  
      const treeData = Object.values(yajmanMap);
      res.json(treeData);
    });
  } catch (error) {
    logger.error("Error in getYajmanYadi",error);
    res.status(400).json({
      message: "Error in getYajmanYadi",
      error: error.message,
    });
  }
};