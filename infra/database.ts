import { Client, QueryConfig } from 'pg';

async function query(queryObject: string | QueryConfig) {
  const client = await getNewClient();

  try {
    return await client.query(queryObject);
  } catch (error) {
    console.error('error at database.ts `query` method', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  try {
    const client = new Client({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      ssl: process.env.NODE_ENV !== 'production' ? false : true,
    });

    client.connect();

    return client;
  } catch (error) {
    console.error('error at database.ts `getNewClient` method', error);
    throw error;
  }
}

const database = {
  query,
  getNewClient,
};
export default database;
