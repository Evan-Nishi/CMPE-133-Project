import mongoose from 'mongoose'
const { Schema } = mongoose

const Day = new Schema({
    slots: {
        type: [Boolean],
        default: () => Array(96).fill(false), // 96 x 15 minute time slots in a day
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
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    schedule: Week,
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'Profile',
    }],
})

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;