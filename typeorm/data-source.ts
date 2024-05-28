import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  migrations: [`${__dirname}/migrations/**/*.ts`],
});
export default dataSource;
