const mongoose = require('mongoose');

const hifiQuerySchema = mongoose.Schema({
    country: { type: String, required: true },
    added: { type: Number, required: true },
    otherCountry: { type: String }
})

hifiQuerySchema.index({ "added": -1 });
module.exports = mongoose.model("HifiQuery", hifiQuerySchema);