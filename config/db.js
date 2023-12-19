const mongoose = require('mongoose');
const chalk = require('chalk');
const dev = require('./index');

const connectDB = async () => {
    try {
        await mongoose.connect(dev.db.mongoUrl);
        console.log(chalk.whiteBright("Connected to mongoDB..."))
    }
    catch(error){
        console.log(chalk.redBright("Could not connect to MongoDB."))
    }
}

module.exports = connectDB;