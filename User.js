const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return emailRegex.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 6; // Example: minimum length of 6 characters
            },
            message: 'Password must be at least 6 characters long.'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    this.updatedAt = Date.now(); // Update the timestamp on save
    next();
});

UserSchema.post('save', function(error, doc, next) {
    if (error) {
        next(new Error('Error saving user: ' + error.message));
    } else {
        next();
    }
});

module.exports = mongoose.model('User', UserSchema);
