import database from '@infra/database';
import { NextApiRequest, NextApiResponse } from 'next/types';

interface StatusResponse {
  env: typeof process.env.NODE_ENV;
  updated_at: string;
  database: DatabaseStatusResponse;
}

interface DatabaseStatusResponse {
  status: 'helthly' | 'unhealthy';
  max_connections: number;
  opened_connections: number;
  version: string;
}

async function status(
  _: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const updatedAt = new Date().toISOString();

  const queryServerVersion = await database.query('SHOW server_version;');
  const serverVersionResult = queryServerVersion.rows[0].server_version;

  const queryMaxConnections = await database.query('SHOW max_connections;');
  const maxConnectionsResult = queryMaxConnections.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;

  const queryOpenedConnections = await database.query({
    text: `SELECT count(*)::int
       FROM pg_stat_activity
      WHERE datname = $1
        AND state = 'active';`,
    values: [databaseName],
  });
  const openedConnectionsResult = queryOpenedConnections.rows[0].count;

  const databaseStatus: DatabaseStatusResponse = {
    status: 'helthly',
    opened_connections: Number(openedConnectionsResult),
    max_connections: Number(maxConnectionsResult),
    version: serverVersionResult.toString(),
  };

  response.status(200).json({
    env: process.env.NODE_ENV,
    updated_at: updatedAt,
    database: databaseStatus,
  });
}

export default status;
export type { DatabaseStatusResponse, StatusResponse };
