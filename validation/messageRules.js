import { body } from 'express-validator';

// This defines validation and sanitation for our message
// It specifically examines the body of a request and makes sure
// that if there is a message inside, the contents of the message is OK
export const messageRules = [
    body("message").isLength({ min: 0, max: 120 }).withMessage("message-betwenn-0-and-120"),
    // body("message").isAlphanumeric("de-DE").matches(/^[A-Za-z\s]+$/).withMessage("invalid-chars"), // .matches(...) comes from Milad
    body("message").isAlphanumeric("de-DE", {ignore: ' '}).withMessage("invalid-chars"), // try this one (only tested for .isAlpha() before)
    body("message").trim(),
    body("message").blacklist("e")
]