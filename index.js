const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const user_routes = require('./routes/user.routes');
const student_routes = require('./routes/student.routes');

const PORT = process.env.PORT || 8060;

const MONGO_URI = process.env.MONGO_URL;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log('MongoDB Connection Success!');
});

app.use(cors());
app.use(bodyParser.json());

app.use('/user', user_routes);
app.use('/student', student_routes);

app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
});