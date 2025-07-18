const logger = require("../../logger");
const db = require("../../model/connection");


exports.getOneYajmanYadi = (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT ym.id AS member_id,
        ym.yajman_id,
        ym.full_name,
        ym.age,
        ym.gender,
        ym.aadhaar,
        ym.mobile,
        ym.is_main_member, yf.* 
      FROM yajman_members ym
      LEFT JOIN yajman_form yf ON ym.yajman_id = yf.id
      WHERE ym.is_deleted = 0 AND yf.is_deleted = 0
    `;

    if (id) {
      query += ` AND ym.yajman_id = ${db.escape(id)} `;
    }

    query += ` ORDER BY ym.yajman_id, ym.is_main_member DESC`;

    db.query(query, (err, results) => {
      if (err) {
        logger.error("Error getting yajman_members", err);
        return res.status(500).json({ message: 'Error getting yajman_members', error: err.message });
      }

      const yajmanMap = {};
      let total_members = 0;
      let total_received_amount = 0;
      let total_pending_amount = 0;

      results.forEach(member => {
        const {
          member_id,
          yajman_id,
          full_name,
          age,
          gender,
          aadhaar,
          mobile,
          is_main_member,
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

          if (status === "pending") total_pending_amount += numericAmount;
          else if (status === "received") total_received_amount += numericAmount;

          yajmanMap[yajman_id] = {
            id: yajman_id,
            member_id,
            name: full_name,
            age,
            gender,
            aadhaar,
            mobile,
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
            id: member_id,
            yajman_id,
            name: full_name,
            age,
            gender,
            aadhaar,
            mobile
          });
        }
      });

      const treeData = Object.values(yajmanMap);
      const total_yajman_group = treeData.length;

      res.json({
        total: {
          total_members,
          total_pending_amount,
          total_received_amount,
          total_yajman_group
        },
        data: treeData
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
