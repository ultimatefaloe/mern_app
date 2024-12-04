
const { check, validationResult } = require('express-validator');

const validateInput = (title, description, address) => {
    check(title).not().isEmpty(),
    check(description).isLength({min: 5}),
    check(address).not().isEmpty().optional()
}
const validationError = (req) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error)
        throw new httpError('Invalid input passed, check the input data', 422)
    }
}

exports.validateInput = validateInput
exports.validationError = validationError