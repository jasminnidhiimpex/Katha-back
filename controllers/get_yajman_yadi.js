const logger = require("../logger");
const db = require("../model/connection");


exports.getYajmanYadi = (req, res) => {
  try {
    const query = `SELECT ym.*, yf.* 
      FROM yajman_members ym
      LEFT JOIN yajman_form yf ON ym.yajman_id = yf.id
      ORDER BY ym.yajman_id, ym.is_main_member DESC, ym.id`;
    db.query(query, (err, results) => {
      if (err) {
        logger.error("Error getting yajman_members", err);
        return res.status(500).json({ message: 'Error getting yajman_members', error: err.message });
      }

      const yajmanMap = {};
      let total_members = 0;
      let total_received_amount = 0;
      let total_pending_amount = 0;
      let total_yajman_group = 0;

      results.forEach(member => {
        const {
          id, // from yajman_members
          yajman_id,
          full_name,
          age,
          gender,
          aadhaar,
          mobile,
          is_main_member,

          // From yajman_form (all prefixed with yf.)
          ref_name,
          city,
          village,
          department,
          member_count,
          total_amount,
          payment_status,
          payment_date,
          payment_ref,
          created_at,
          address,
          ref_city,
          ref_mobile,
          slip_no,
          main_member
        } = member;

        total_members++;

        if (is_main_member === 1) {
          const numericAmount = parseFloat(total_amount || 0);
          const status = (payment_status || "").toLowerCase();

          if (status === "pending") {
            total_pending_amount += numericAmount;
          } else if (status === "received") {
            total_received_amount += numericAmount;
          }

          yajmanMap[yajman_id] = {
            id: yajman_id,
            name: full_name,
            age,
            gender,
            aadhaar,
            mobile,

            // yajman_form info
            ref_name,
            city,
            village,
            department,
            member_count,
            total_amount,
            payment_status,
            payment_date,
            payment_ref,
            created_at,
            address,
            ref_city,
            ref_mobile,
            slip_no,
            main_member,            

            children: []
          };
        } else {
          if (!yajmanMap[yajman_id]) {
            yajmanMap[yajman_id] = {
              id: yajman_id,
              name: 'Unknown',
              children: []
            };
          }
          yajmanMap[yajman_id].children.push({
            id,
            name: full_name,
            age,
            gender,
            aadhaar,
            mobile
          });
        }
      });
      
      const treeData = Object.values(yajmanMap);
      total_yajman_group += treeData.length;

      res.json({
        total: {
          total_members:total_members,
          total_pending_amount:total_pending_amount,
          total_received_amount:total_received_amount,
          total_yajman_group:total_yajman_group,
        },
        data:treeData,
      });
    });
  } catch (error) {
    logger.error("Error in getYajmanYadi", error);
    res.status(400).json({
      message: "Error in getYajmanYadi",
      error: error.message,
    });
  }
};