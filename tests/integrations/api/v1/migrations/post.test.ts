import database from '@infra/database';
import { beforeAll, describe, expect } from '@jest/globals';

import { resetDatabase } from '../../../../setup';

describe('POST /api/v1/migrations', () => {
  let response: Response;
  let body: unknown;

  beforeAll(async () => {
    await resetDatabase();

    response = await fetch('http://localhost:3000/api/v1/migrations', {
      method: 'POST',
    });
    body = await response.json();
  });

  it('should return status 201', () => {
    expect(response.status).toEqual(201);
  });

  it('body should be an array greater than 0', () => {
    expect(Array.isArray(body)).toBeTruthy();
    expect((body as []).length).toBeGreaterThan(0);
  });

  it('database should have a table named `pgmigrations` with at least one migration', async () => {
    const { rows: migrations } = await database.query(
      'SELECT * FROM pgmigrations'
    );

    expect(migrations.length).toBeGreaterThan(0);
  });
});
