const logger = require('../../logger');
const db = require('../../model/connection');
const insertTable = require('../dynamic_function/insert_table');
const moment = require('moment');


exports.addYajmaYadi = async (req, res, next) => {
  try {
    const {
      refName,
      city,
      address,
      village,
      department,
      memberCount,
      mainMember,
      otherMembers,
      totalAmount,
      paymentStatus,
      paymentDate,
      paymentRef,
      refCity,
      refMobile,
      slipNo
    } = req.body;
    
    const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

    // 1. Insert form data into yajman_form
    const formData = {
      ref_name:refName,
      city,
      address,
      village,
      department,
      created_at:currentDateTime,
      member_count:memberCount,
      total_amount:totalAmount,
      payment_status:paymentStatus,
      payment_date:paymentDate,
      payment_ref:paymentRef,
      ref_city:refCity,
      ref_mobile:refMobile,
      slip_no:slipNo,
      main_member: mainMember.fullName
    };
    
    db.beginTransaction((err) => {
      if (err) {
        logger.error("Error starting transaction",err);
        return res.status(400).json({ message: "Error starting transaction", error: err.message });
      }

      insertTable('yajman_form', formData, async (err) => {
        if (err) {
          logger.error("Error inserting in yajman_form", err);
          return db.rollback(() => { res.status(400).json({
              message: "Error inserting in yajman_form",
              error: err.message,
            });
          });
        }

        const selectQuery = `SELECT id FROM yajman_form WHERE main_member = ? AND is_deleted = 0`;
        db.query(selectQuery,[mainMember.fullName], async (err, yajmanId) => {
          if(err){
            logger.error("Error fetching yajman_id from yajman_form",err);
            return db.rollback(() => { res.status(400).json({message: "Error fetching yajman_id from yajman_form", error:err.message}); });
          }
          if(yajmanId.length === 0){
            logger.error("Yajman id not found.")
            return db.rollback(() => { res.status(400).json({message: "Yajman id not found."}); });
          }

          const yajman_id = yajmanId[0].id;

          // 2. Create mainMember record
          const mainMemberData = {
            yajman_id,
            full_name: mainMember.fullName,
            age: mainMember.age,
            aadhaar: mainMember.aadhaar,
            mobile: mainMember.mobile,
            gender: mainMember.gender,
            is_main_member: 1,
            created_at: currentDateTime,
          };

          // 3. Create other members records
          const otherMemberData = otherMembers.map((member) => ({
            yajman_id,
            full_name: member.fullName,
            age: member.age,
            aadhaar: member.aadhaar,
            mobile: member.mobile,
            gender: member.gender,
            is_main_member: 0,
            created_at: currentDateTime,
          }));

          const allMembers = [mainMemberData, ...otherMemberData];

          insertTable('yajman_members', allMembers, async (err) => {
            if (err) {
              logger.error("Error inserting in yajman_members",err);
              return db.rollback(() => { res.status(400).json({
                  message: "Error inserting in yajman_members",
                  error: err.message,
                });
              });
            }

            db.commit((err) => {
              if (err) {
                logger.error("Transaction commit error");
                return db.rollback(() => {
                  logger.error("Transaction commit error:", err);
                  res.status(500).json({ message: "Transaction commit error", error: err.message });
                });
              }

              logger.info("Inserted successfully.");
              res.status(200).json({ message: "Inserted successfully." });
            });
          });
        });
      });
    });
  } catch (error) {
    logger.error("Error in addYajmaYadi",error);
    res.status(400).json({
      message: "Error in addYajmaYadi",
      error: error.message,
    });
  }
};