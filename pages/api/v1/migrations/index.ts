import { join } from 'node:path';

import database from '@infra/database';
import { NextApiRequest, NextApiResponse } from 'next/types';
import migrationRunner from 'node-pg-migrate';

const allowedMethods = ['GET', 'POST'];

async function migrations(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  if (!request.method || !allowedMethods.includes(request.method)) {
    response.status(405).end();
    return;
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrations = await migrationRunner({
      dbClient: dbClient,
      dryRun: request.method === 'GET',
      direction: 'up',
      migrationsTable: 'pgmigrations',
      dir: join(process.cwd(), 'infra', 'migrations'),
      log: () => {},
    });

    const statusCode = migrations.length > 0 ? 201 : 200;
    response.status(statusCode).json(migrations);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    response.status(500).json({ error: errorMessage });
  } finally {
    dbClient?.end();
  }
}

export default migrations;
