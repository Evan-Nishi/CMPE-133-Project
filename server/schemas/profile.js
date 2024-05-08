import mongoose from 'mongoose'
const { Schema } = mongoose

const Day = new Schema({
    slots: {
        type: [Number],
        default: () => Array(96).fill(0), // 96 x 15 minute time slots in a day
    },
}, { _id: false });

const Week = new Schema({
    sunday: Day, 
    monday: Day, 
    tuesday: Day,
    wednesday: Day,
    thursday: Day,
    friday: Day, 
    saturday: Day,
}, { _id: false });

const profileSchema = new Schema({
    //need friends field, simply an array _id of friends
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    schedule: {
        type: Week,
        default: () => ({
            sunday: { slots: Array(96).fill(0) },
            monday: { slots: Array(96).fill(0) },
            tuesday: { slots: Array(96).fill(0) },
            wednesday: { slots: Array(96).fill(0) },
            thursday: { slots: Array(96).fill(0) },
            friday: { slots: Array(96).fill(0) },
            saturday: { slots: Array(96).fill(0) },
        }),
    },
    friends: [{
        friend: {
            type: Schema.Types.ObjectId,
            ref: 'Profile',
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'invited'],
            required: true,
        }
    }],
    events: [{
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted'],
            required: true,
        }
    }],
})

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;