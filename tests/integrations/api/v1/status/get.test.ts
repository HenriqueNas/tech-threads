import { describe, expect } from '@jest/globals';

describe('GET /api/v1/status', () => {
  describe('Anonymous User', () => {
    it('Retrieving current status', async () => {
      const response = await fetch('http://localhost:3000/api/v1/status');
      const body = await response.json();

      expect(response.status).toEqual(200);

      expect(body.updated_at).toBeDefined();

      const parsedUpdatedAt = new Date(body.updated_at).toISOString();
      expect(parsedUpdatedAt).toEqual(body.updated_at);

      // Database
      const database = body.database;

      expect(database.status).toBeDefined();
      expect(database.status).toEqual('helthly');

      expect(database.version).toBeDefined();
      expect(typeof database.version).toBe('string');
      expect(database.version).toEqual('16.0');

      expect(database.opened_connections).toBeDefined();
      expect(typeof database.opened_connections).toBe('number');
      expect(database.opened_connections).toEqual(1);

      expect(database.max_connections).toBeDefined();
      expect(typeof database.max_connections).toBe('number');
    });
  });
});
