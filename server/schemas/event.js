import mongoose from 'mongoose'
const { Schema } = mongoose

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    }],
    date: {
        type: Date,
        required: true,
    },
    start: {
        type: Number, // 0-96, 0 is midnight, 96 is 11:45 PM
        required: true,
    },
    end: {
        type: Number, // 0-96, 0 is midnight, 96 is 11:45 PM
        required: true,
    },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;

