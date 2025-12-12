import expess from "express";
import cors from "cors";
import "dotenv/config.js";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
import resumeRouter from "./routes/resumeRoutes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = expess();
const PORT = process.env.PORT || 4000;

app.use(cors());

//Connect DDB
connectDB();

//Middleware

app.use(expess.json());

app.use("/api/auth", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/admin", adminRouter);

app.use(
  '/uploads', 
  expess.static(path.join(__dirname, 'uploads'),{
    setHeaders: (res, _path) => {
      res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    }
  })
);

//Routes

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
