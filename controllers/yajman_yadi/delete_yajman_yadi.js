const logger = require('../../logger');
const db = require('../../model/connection');
const moment = require('moment');
const updateTable = require('../dynamic_function/update_table');


exports.deleteYajmaYadi = async (req, res, next) => {
    try {
        const { type,is_deleted,id,yajman_id } = req.body;
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    
        db.beginTransaction((err) => {
            if (err) {
                logger.error("Error starting transaction",err);
                return res.status(400).json({ message: "Error starting transaction", error: err.message });
            }

            const update = {
                is_deleted,
                updated_at:currentDateTime
            }
            const conditions = {
                id
            }

            if(type === "member") {
                updateTable('yajman_members', update, conditions, (err) => {
                    if(err){
                        logger.error("Error in yajman_members",err);
                        return db.rollback(() => {
                            return res.status(400).json({ message: "Error in yajman_members", error: err.message });
                        });
                    }
                    const selectQuery = `SELECT member_count FROM yajman_form WHERE id = ?`;
                    db.query(selectQuery, [yajman_id], (err, result) => {
                        if(err){
                            logger.error("Error fetching member_count from yajman_form",err);
                            return db.rollback(() => {
                                return res.status(400).json({ message: "Error fetching member_count from yajman_form", error: err.message });
                            });
                        }
                        if(result.length === 0){
                            return db.rollback(() => {
                                return res.status(400).json({ message: "No member_count found"});
                            });
                        }
                        const member_count = result[0].member_count;
                        const updateMember = parseInt(member_count - 1);
                        const update = {
                            member_count : updateMember
                        }
                        const conditions = {
                            id:yajman_id
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
                                return res.status(200).json({message: "Members Deleted Successfully"});
                            });
                        });
                    });
                });
            } else {
                updateTable('yajman_form', update, conditions, (err) => {
                    if(err){
                        logger.error("Error in yajman_form",err);
                        return db.rollback(() => {
                            return res.status(400).json({ message: "Error in yajman_form", error: err.message });
                        });
                    }

                    const conditions = {
                        yajman_id : id
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
                            return res.status(200).json({message: "From Deleted Successfully"});
                        });
                    });
                });
            }
        });
    } catch (error) {
        logger.error("Error in deleteYajmaYadi",error);
        res.status(400).json({
          message: "Error in deleteYajmaYadi",
          error: error.message,
        });
    }
};