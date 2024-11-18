require('dotenv').config();
const express = require('express');
const cookieParser =  require('cookie-parser');
const{UnauthenticatedError,
    NotFoundError} = require('./errors/index');
    const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const fileUpload = require('express-fileupload');    
const morgan = require('morgan');
//db
const connectDB = require('./db/connect');
//router
const authrouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const reviewRouter = require('./routes/reviewRouter');
const orderRouter = require('./routes/orderRouter');
//middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler') ;

const app = express();
app.use(express.json())
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());


app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(express.static('./public'));
app.use(fileUpload());

app.use('/api/v1/auth',authrouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/products',productRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/orders',orderRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000
const start = async()=>{
 
    try{
        app.listen(port)
        await connectDB(process.env.MONGO_URL);
        console.log(`Server listening to port ${port}`)
    }catch(error){
        console.log(error);
    }
   
}
start();