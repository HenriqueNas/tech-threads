import database from '@infra/database';
import { beforeAll, describe, expect } from '@jest/globals';

import { resetDatabase } from '../../../../setup';

describe('GET /api/v1/migrations', () => {
  beforeAll(async () => {
    await resetDatabase();
  });

  describe('Anonymous user', () => {
    describe('running pending migrations', () => {
      it('for the first time', async () => {
        const response = await fetch(
          'http://localhost:3000/api/v1/migrations',
          { method: 'GET' }
        );
        const body = await response.json();

        expect(response.status).toEqual(201);

        expect(Array.isArray(body)).toBeTruthy();
        expect((body as []).length).toBeGreaterThan(0);
      });

      it('retrieaving migrations list from database', async () => {
        const { rows: migrations } = await database.query(
          'SELECT * FROM pgmigrations'
        );

        expect(migrations).toHaveLength(0);
      });

      it('when migrations are already ran before', async () => {
        const response = await fetch(
          'http://localhost:3000/api/v1/migrations',
          { method: 'GET' }
        );
        const body = await response.json();

        expect(response.status).toEqual(201);

        expect(Array.isArray(body)).toBeTruthy();
        expect((body as []).length).toBeGreaterThan(0);
      });
    });
  });
});
