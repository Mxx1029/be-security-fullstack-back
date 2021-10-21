import mongoose from 'mongoose';
import { hash, compareHashes } from '../libs/crypto.js';

// Helper variables
const required = true;
const unique = true;
const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required, unique, minLength: 5 },
    password: { type: String, required, minLength: 20 },
});

//following is the syntac for JSDoc Comments
/**
 * This registers a new user into the database
 * @param {object} userData - User to create
 * @returns {object} Created User or null if it failed
 */

userSchema.statics.register = async (userData) => {
    try {
        userData.password = await hash(userData.password);
        return await User.create(userData); 
    } catch (error) {
        if (error.message.indexOf("email") !== -1) {
            console.error("Error while registering user (email"); // in production you should never email addresses into the log (data protection)
        } else {
            console.error("Error while registering user: ", error.message); 
        }
        return null;
    }
}

/** 
 * Try to login with provided user credentials
 * @param {object} userData - object containing email and password in plain text
 * @return {Promise<object>} - will resolve to user object if successful or null if not
*/

userSchema.statics.login = async (userData) => {
    const user = await User.findOne({ email: userData.email });
    if (!user) {
        // throw new Error("user not found"); // with this you need try...catch when you call this method
        return null; // means login was unsuccessful
    }

    const success = await compareHashes(userData.password, user.password);
    if(!success) {
        return null;
    }
    return user.toJSON();
};

// instance method, so we have access to this variable <--> model methods above
// this method also makes sure, that there's no password sent in the response! converts a User object to a simplefied JSON representation
userSchema.methods.toJSON = function() {
    return {
        email: this.email,
        _id: this._id
    };
}


const User = mongoose.model('users', userSchema);

export default User;