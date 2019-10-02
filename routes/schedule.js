var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const { Schedule } = require('../models');

const logger = require('../util/logger');

// GET all schedules
router.get('/', (req, res, next) => {
    Schedule.findAll().then((result) => {
        if (!result) {
            logger.error(`schedule get error`);
            return res.status(400).send({
                status: 'fail',
                message: `can't load data from the server`
            });
        }

        return res.status(200).send({
            status: 'success',
            data: {
                'schedules': result
            }
        })
    }).catch((err) => {
        logger.error(`schedule get error ${err.message}`);
        return res.status(400).send({
            status: 'fail',
            message: err.message
        })
    });
});

// create schedule
router.post('/', [
    check('name').isLength({min: 1}),
    check('desc').isLength({min: 1}),
    check('startDate').isISO8601().toDate().
        custom((value, {req, loc, path}) => {
            if (value > req.body.endDate) {
                throw new Error("Can't be greater than endDate");
            }

            return value;
        }),
    check('endDate').isISO8601().toDate().
        custom((value, {req, loc, path}) => {
            if (value < req.body.startDate) {
                throw new Error("Can't be less than startDate");
            }

            return value;
        })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(`schedule post error request body is bad`);
        return res.status(422).send({
            status: 'error',
            message: errors.array()
        })
    }

    Schedule.create({
        name: req.body.name,
        desc: req.body.desc,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        createAt: new Date(),
        updatedAt: new Date(),
    }).then((result) => {
        return res.status(201).send({
            status: 'success',
            data: {
                'schedule': result.dataValues
            }
        })
    }).catch((err) => {
        logger.error(`schedule post error ${err.message}`);
        return res.status(400).send({
            status: 'fail',
            message: err.message
        })
    });

});

module.exports = router;
