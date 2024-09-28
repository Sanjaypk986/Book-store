import  express from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { connectDB } from './config/dbConfig.js';
import apiRouter from './routes/index.js';
const app = express();
const PORT = 3000;


// acces req.body
app.use(express.json())
// cors 
app.use(cors(
  {
    origin: true,
    credentials:true
  }
))
// to get req.cookies
app.use(cookieParser())

// connetion mongodb
connectDB()

//routing
app.use('/api',apiRouter)


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
