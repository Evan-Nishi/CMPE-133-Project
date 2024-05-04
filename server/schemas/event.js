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
            required: true,
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
        type: Number, // 0-96, 0 is midnight, 96 is 11:45 PM
        required: true,
    },
    end: {
        type: Number, // 0-96, 0 is midnight, 96 is 11:45 PM
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

