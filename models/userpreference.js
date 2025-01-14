const mongoose=require('mongoose');
const userPreferenceSchema=new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});


module.exports=mongoose.model('userpreference',userPreferenceSchema)