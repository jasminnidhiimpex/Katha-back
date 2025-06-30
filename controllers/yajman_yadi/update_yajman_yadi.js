const logger = require('../../logger');
const db = require('../../model/connection');
const moment = require('moment');
const updateTable = require('../dynamic_function/update_table');
const insertTable = require('../dynamic_function/insert_table');


exports.updateYajmaYadi = async (req, res, next) => {
  try {
    const {
      id,
      // member_id,
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

    const formData = {
      ref_name: refName,
      city,
      address,
      village,
      department,
      created_at: currentDateTime,
      member_count: memberCount,
      total_amount: totalAmount,
      payment_status: paymentStatus,
      payment_date: paymentDate,
      payment_ref: paymentRef,
      ref_city: refCity,
      ref_mobile: refMobile,
      slip_no: slipNo,
      main_member: mainMember.fullName
    };

    db.beginTransaction(async (err) => {
      if (err) {
        logger.error("Error starting transaction", err);
        return res.status(400).json({ message: "Error starting transaction", error: err.message });
      }    

      updateTable('yajman_form', formData, { id }, async (err) => {
        if (err) {
          logger.error("Error updating yajman_form", err);
          return db.rollback(() => {
            res.status(400).json({ message: "Error updating yajman_form", error: err.message });
          });
        }

        // 2. Update main member by ID
        const mainMemberData = {
          full_name: mainMember.fullName,
          age: mainMember.age,
          aadhaar: mainMember.aadhaar,
          mobile: mainMember.mobile,
          gender: mainMember.gender,
          updated_at: currentDateTime,
        };
        
        updateTable('yajman_members', mainMemberData, { id: mainMember.member_id }, async (err) => {
          if (err) {
            logger.error("Error updating main member", err);
            return db.rollback(() => {
              res.status(400).json({ message: "Error updating main member", error: err.message });
            });
          }

          // 3. Update other members by their IDs
          const updateOtherMembers = async () => {
            for (const member of otherMembers) {
              const memberData = {
                full_name: member.fullName,
                age: member.age,
                aadhaar: member.aadhaar,
                mobile: member.mobile,
                gender: member.gender,
                updated_at: currentDateTime,
                created_at: currentDateTime,
                yajman_id: id,
                is_main_member: 0
              };
          
              try {
                if (member.id) {
                  // UPDATE
                  await new Promise((resolve, reject) => {
                    updateTable('yajman_members', memberData, { id: member.id }, (err) =>
                      err ? reject(err) : resolve()
                    );
                  });
                } else {
                  // INSERT
                  await new Promise((resolve, reject) => {
                    insertTable('yajman_members', memberData, (err) =>
                      err ? reject(err) : resolve()
                    );
                  });
                }
              } catch (err) {
                logger.error("Error in insert/update other member", err);
                // Detect duplicate error
                if (err.code === 'ER_DUP_ENTRY') {
                  err.customMessage = `Duplicate entry: ${err.sqlMessage}`;
                }
                return err; // This will be caught and handled below
              }
            }
            return null;
          };

          const otherErr = await updateOtherMembers();
          if (otherErr) {
            const isDuplicate = otherErr.code === 'ER_DUP_ENTRY';
            const errorMessage = isDuplicate
              ? `${otherErr.sqlMessage}`
              : otherErr.message;
                  
            return db.rollback(() => {
              res.status(400).json({
                message: "Error updating other member",
                error: errorMessage,
              });
            });
          }

          db.commit((err) => {
            if (err) {
              logger.error("Transaction commit error:", err);
              return db.rollback(() => {
                res.status(500).json({ message: "Transaction commit error", error: err.message });
              });
            }

            logger.info("Updated successfully.");
            res.status(200).json({ message: "Updated successfully." });
          });
        });
      });
    });
  } catch (error) {
    logger.error("Error in updateYajmaYadi", error);
    res.status(400).json({ message: "Error in updateYajmaYadi", error: error.message });
  }
};