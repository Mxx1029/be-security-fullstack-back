import bcrypt from 'bcrypt';

// you can leave out the async and await here, you need it, when you call it 
export function hash(input) {
    return bcrypt.hash(input, 10);
}

export function compareHashes(input, hash) {
    if (!input) {
        return false;
    }
    return bcrypt.compare(input, hash);
}