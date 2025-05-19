const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-1',
      username: 'threadstesthelper',
      password: 'test',
      fullname: 'threads plugin test helper',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should respond with 201 and thread persists', async () => {
      const requestPayload = {
        title: 'my first thread',
        body: 'Halo!',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 'user-1' },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should respond with 401 when request not authenticated', async () => {
      const requestPayload = {
        title: 'my first thread',
        body: 'Halo!',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 400 when payload does not contain required property', async () => {
      const requestPayload = { body: 'Halo!' };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 'user-1' },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal memposting thread karena judul atau badan thread kosong');
    });

    it('should respond with 400 when payload does not meet data type specification', async () => {
      const requestPayload = {
        title: 1,
        body: 'Halo!',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 'user-1' },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal memposting thread karena judul atau badan thread tidak berupa string');
    });

    // maybe no need to test userId since it comes from database via auth strategy?
    // it('should respond with 400 when userId exceeds 50 characters')
  });
});
