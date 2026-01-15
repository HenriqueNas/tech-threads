import { beforeAll, describe, expect, test } from '@jest/globals';
import { DatabaseStatusResponse, StatusResponse } from '@v1/status';

describe('GET /api/v1/status', () => {
  var response: Response;
  var body: StatusResponse;

  beforeAll(async () => {
    response = await fetch('http://localhost:3000/api/v1/status');
    body = await response.json();
  });

  test('should return status 200', () => {
    expect(response.status).toEqual(200);
  });

  test('should return valid updated_at as ISO string', () => {
    expect(body.updated_at).toBeDefined();

    const parsedUpdatedAt = new Date(body.updated_at).toISOString();
    expect(parsedUpdatedAt).toEqual(body.updated_at);
  });
});

describe('GET /api/v1/status database', () => {
  var response: Response;
  var database: DatabaseStatusResponse;

  beforeAll(async () => {
    response = await fetch('http://localhost:3000/api/v1/status');
    database = (await response.json()).database;
  });

  test('database status should be healtly', () => {
    expect(database.status).toBeDefined();
    expect(database.status).toEqual('helthly');
  });

  test('should return a valid current database version', () => {
    expect(database.version).toBeDefined();
    expect(typeof database.version).toBe('string');
    expect(database.version).toEqual('16.0');
  });

  test('should return the current opened connections as number', () => {
    expect(database.opened_connections).toBeDefined();
    expect(typeof database.opened_connections).toBe('number');
    expect(database.opened_connections).toEqual(1);
  });

  test('should return the max connections for database', () => {
    expect(database.max_connections).toBeDefined();
    expect(typeof database.max_connections).toBe('number');
  });
});
