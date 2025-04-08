
import mongoose from 'mongoose';
import 'dotenv/config'


const mongoURL=process.env.MONGO_URL;

mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})


const db=mongoose.connection;

db.on('connected',()=>{
    console.log('Connected to mongodb server');
});

db.on('error',()=>{
    console.error('Connected error to mongodb server');
});

db.on('disconnected',()=>{
    console.log('disConnected to mongodb server');
});


export default db;