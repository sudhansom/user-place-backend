const express = require('express');
const chalk = require('chalk');

const dev = require('./config');
const mongoDB = require('./config/db');
const userRoute = require('./routes/user-route');
const placeRoute = require('./routes/place-route');
const HttpError = require('./models/http-error');

const app = express();

app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/places', placeRoute);

const PORT = dev.app.port ;

app.use((req, res, next)=> {
    const error = new HttpError('No such route found...', 404);
    throw next(error);
})

app.use((error, req, res, next)=> {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'Something went wrong in Server side...'})
})


app.listen(PORT, async () => {
    console.log(chalk.blueBright(
        `server running at http://localhost:${PORT}`)
    )
    await mongoDB();
});