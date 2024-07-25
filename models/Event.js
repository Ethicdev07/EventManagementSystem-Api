const mongoose = require('mongoose');


const Eventschema = new mongoose.Schema({

});

const Events = mongoose.model('Events', Eventschema);
module.exports = Events;