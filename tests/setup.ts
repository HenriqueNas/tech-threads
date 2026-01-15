import database from '@infra/database';

export async function resetDatabase() {
  const client = await database.getNewClient();

  try {
    await client.query('DROP TABLE IF EXISTS pgmigrations CASCADE;');

    await client.query('DROP SCHEMA IF EXISTS public CASCADE;');
    await client.query('CREATE SCHEMA public;');

    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  } finally {
    await client.end();
  }
}
