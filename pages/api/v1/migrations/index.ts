import { NextApiRequest, NextApiResponse } from 'next/types';

import migrationRunner from 'node-pg-migrate';
import { join } from 'node:path';

import database from '@infra/database';

async function migrations(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const isMethodAllowed = request.method === 'GET' || request.method === 'POST';

  if (isMethodAllowed) {
    const dbClient = await database.getNewClient();

    const migrations = await migrationRunner({
      dbClient: dbClient,
      dryRun: request.method === 'GET',
      direction: 'up',
      migrationsTable: 'pgmigrations',
      dir: join(process.cwd(), 'infra', 'migrations'),
      log: () => {},
    });

    dbClient.end();

    const statusCode = migrations.length > 0 ? 201 : 200;
    response.status(statusCode).json(migrations);
  }

  response.status(405).end();
}

export default migrations;
