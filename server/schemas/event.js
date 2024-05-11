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
        participant_id: {
            type: Schema.Types.ObjectId,
            ref: 'Profile',
            required: false,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted'],
            required: true,
        }
    }],
    date: {
        type: Date,
        required: true,
    },
    start: {
        type: Number, // 0-96, representing quarter-hour intervals
        required: true,
    },
    end: {
        type: Number, // 0-96, representing quarter-hour intervals
        required: true,
    },
    creator: {
        creatorId: {
            type: Schema.Types.ObjectId,
            ref: 'Profile',
            required: true,
        },
        creatorName: {
            type: String,
            required: true,
        },
    },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;

