import { beforeAll, describe, expect, test } from '@jest/globals';

import database from '@infra/database';
import { resetDatabase } from '../../../../setup';

describe('POST /api/v1/migrations', () => {
  var response: Response;
  var body: any;

  beforeAll(async () => {
    await resetDatabase();

    response = await fetch('http://localhost:3000/api/v1/migrations', {
      method: 'POST',
    });
    body = await response.json();
  });

  test('should return status 201', () => {
    expect(response.status).toEqual(201);
  });

  test('body should be an array greater than 0', () => {
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('database should have a table named `pgmigrations` with at least one migration', async () => {
    const { rows: migrations } = await database.query(
      'SELECT * FROM pgmigrations'
    );

    expect(migrations.length).toBeGreaterThan(0);
  });
});
