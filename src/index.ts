import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { loadCountries } from './utils/countryCache';
// console.log("Queue URL:", process.env.BirthdayGreetingQueueUrl);
const PORT = process.env.PORT || 3000;
await loadCountries(); // 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});