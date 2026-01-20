import mongoose from 'mongoose';
import app from './app';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/webdevtask2';
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected (Port 27017)');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => console.error('DB connection error:', err));
