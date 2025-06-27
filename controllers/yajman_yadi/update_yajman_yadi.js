const logger = require('../../logger');
const db = require('../../model/connection');
const moment = require('moment');
const updateTable = require('../dynamic_function/update_table');


exports.updateYajmaYadi = async (req, res, next) => {
    try {
        const { 
            id,
            type,
            data
        } = req.body;
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    
        db.beginTransaction((err) => {
            if (err) {
                logger.error("Error starting transaction",err);
                return res.status(400).json({ message: "Error starting transaction", error: err.message });
            }
            
            if(type === "member"){
                const { aadhaar, age, mobile, name, gender } = data;
                const update = {
                    aadhaar, age, mobile, full_name : name, gender, update_at: currentDateTime
                }
                const conditions = {
                    id
                }
                updateTable('yajman_members', update, conditions, (err) => {
                    if(err){
                        logger.error("Error in yajman_members",err);
                        return db.rollback(() => {
                            return res.status(400).json({ message: "Error in yajman_members", error: err.message });
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
                        return res.status(200).json({message: "Members Updated Successfully"});
                    });
                });
            } else {
                const { aadhaar, age, mobile, name, gender,ref_name,city, village, department,member_count,total_amount,payment_status,payment_date,
                   payment_ref,address,ref_city,ref_mobile,slip_no
                } = data;

                const update = {
                    aadhaar, age, mobile, full_name : name, gender, update_at: currentDateTime
                }

                const conditions = {
                    yajman_id:id,
                    is_main_member : 1
                }

                if(update) {
                    updateTable('yajman_members', update, conditions, (err) => {
                        if(err){
                            logger.error("Error in yajman_members",err);
                            return db.rollback(() => {
                                return res.status(400).json({ message: "Error in yajman_members", error: err.message });
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
                            return res.status(200).json({message: "Members Updated Successfully"});
                        });
                    });
                } else {
                    const update = {
                        ref_name,city, village, department,member_count,total_amount,payment_status,payment_date,
                        payment_ref,address,ref_city,ref_mobile,slip_no
                    }
                    const conditions = {
                        id
                    }
                    updateTable('yajman_form', update, conditions, (err) => {
                        if(err){
                            logger.error("Error in yajman_form",err);
                            return db.rollback(() => {
                                return res.status(400).json({ message: "Error in yajman_form", error: err.message });
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
                            return res.status(200).json({message: "From Updated Successfully"});
                        });
                    });
                }
            }
        });
    } catch (error) {
        logger.error("Error in updateYajmaYadi",error);
        res.status(400).json({
          message: "Error in updateYajmaYadi",
          error: error.message,
        });
    }
};