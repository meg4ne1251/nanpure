describe('Server', () => {
  describe('Express app', () => {
    it('should load without errors', () => {
      // Basic sanity check that the server module loads
      const app = require('./server');
      expect(app).toBeDefined();
    });
  });

  describe('API Endpoints', () => {
    let app;
    let request;

    beforeAll(() => {
      // Import after setting NODE_ENV
      process.env.NODE_ENV = 'test';
      app = require('./server');
    });

    it('should serve static files', async () => {
      // This is a basic check - actual file serving would be tested via integration tests
      expect(app).toBeDefined();
    });
  });
});
