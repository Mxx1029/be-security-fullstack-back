import bcrypt from 'bcrypt';

// you can leave out the async and await here, you need it, when you call it 
/**
 * This hashes the input string
 * 
 * @param {string} input to hash
 * @returns {Promise<string>} the hashed input
 */
export function hash(input) {
    return bcrypt.hash(input, 10);
}

/**
 * This compares a plain text input to a hash
 * 
 * @param {string} input 
 * @param {string} hash 
 * @returns {Promise<boolean>} true, if input matches hash
 */

export function compareHashes(input, hash) {
    if (!input) {
        return false;
    }
    return bcrypt.compare(input, hash);
}