const request = require('supertest');
const app = require('./server');
const { stopPools } = require('./puzzlePool');

afterAll(() => {
  stopPools();
});

describe('Server', () => {
  describe('GET /api/puzzle', () => {
    it('should return a valid puzzle with default difficulty', async () => {
      const res = await request(app).get('/api/puzzle');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('puzzle');
      expect(res.body).toHaveProperty('solution');
      expect(res.body).toHaveProperty('difficulty', 'medium');
      expect(res.body).toHaveProperty('hints');
      expect(res.body).toHaveProperty('grade');
      expect(res.body.puzzle).toHaveLength(9);
      expect(res.body.solution).toHaveLength(9);
    }, 15000);

    it('should accept valid difficulty parameters', async () => {
      const res = await request(app).get('/api/puzzle?difficulty=easy');
      expect(res.status).toBe(200);
      expect(res.body.difficulty).toBe('easy');
    }, 15000);

    it('should reject invalid difficulty parameter', async () => {
      const res = await request(app).get('/api/puzzle?difficulty=invalid');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return security headers', async () => {
      const res = await request(app).get('/api/puzzle');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    }, 15000);

    it('should return puzzle cells matching solution where given', async () => {
      const res = await request(app).get('/api/puzzle?difficulty=easy');
      const { puzzle, solution } = res.body;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (puzzle[r][c] !== 0) {
            expect(puzzle[r][c]).toBe(solution[r][c]);
          }
        }
      }
    }, 15000);

    it('should include grade info in response', async () => {
      const res = await request(app).get('/api/puzzle?difficulty=medium');
      expect(res.body.grade).toHaveProperty('totalScore');
      expect(res.body.grade).toHaveProperty('maxTechniqueLevel');
      expect(res.body.grade).toHaveProperty('techniquesUsed');
    }, 15000);

    it('should return 404 for unknown API routes', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Not found');
    });
  });

  describe('Static file serving', () => {
    it('should serve index.html at root', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/html/);
    });

    it('should serve privacy.html', async () => {
      const res = await request(app).get('/privacy.html');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/html/);
    });

    it('should serve robots.txt', async () => {
      const res = await request(app).get('/robots.txt');
      expect(res.status).toBe(200);
    });

    it('should serve sitemap.xml', async () => {
      const res = await request(app).get('/sitemap.xml');
      expect(res.status).toBe(200);
    });

    it('should serve manifest.json', async () => {
      const res = await request(app).get('/manifest.json');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Difficulty landing pages', () => {
    it('should serve /easy with correct title', async () => {
      const res = await request(app).get('/easy');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/html/);
      expect(res.text).toContain('ナンプレ 初級');
      expect(res.text).toContain('data-difficulty="easy"');
    });

    it('should serve /medium with correct title', async () => {
      const res = await request(app).get('/medium');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/html/);
      expect(res.text).toContain('ナンプレ 中級');
      expect(res.text).toContain('data-difficulty="medium"');
    });

    it('should serve /hard with correct title', async () => {
      const res = await request(app).get('/hard');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/html/);
      expect(res.text).toContain('ナンプレ 上級');
      expect(res.text).toContain('data-difficulty="hard"');
    });

    it('should include canonical URL for difficulty pages', async () => {
      const res = await request(app).get('/easy');
      expect(res.text).toContain('href="https://nanpure.meg4ne.net/easy"');
    });

    it('should include difficulty SEO content section', async () => {
      const res = await request(app).get('/hard');
      expect(res.text).toContain('seo-difficulty-page');
      expect(res.text).toContain('diff-page-links');
    });
  });

  describe('404 handling', () => {
    it('should return 404 HTML for unknown page routes', async () => {
      const res = await request(app).get('/nonexistent-page');
      expect(res.status).toBe(404);
      expect(res.headers['content-type']).toMatch(/html/);
    });

    it('should return 404 JSON for unknown API routes', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Not found');
    });
  });

  describe('English pages (/en/)', () => {
    it('should serve /en/ with English content', async () => {
      const res = await request(app).get('/en/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/html/);
      expect(res.text).toContain('lang="en"');
      expect(res.text).toContain('data-lang="en"');
      expect(res.text).toContain('Nanpure - Free Online Sudoku Puzzle');
    });

    it('should redirect /en to /en/', async () => {
      const res = await request(app).get('/en');
      expect(res.status).toBe(301);
      expect(res.headers.location).toBe('/en/');
    });

    it('should serve /en/easy with English meta', async () => {
      const res = await request(app).get('/en/easy');
      expect(res.status).toBe(200);
      expect(res.text).toContain('lang="en"');
      expect(res.text).toContain('data-lang="en"');
      expect(res.text).toContain('data-difficulty="easy"');
      expect(res.text).toContain('Nanpure Easy');
    });

    it('should serve /en/medium with English meta', async () => {
      const res = await request(app).get('/en/medium');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Nanpure Medium');
      expect(res.text).toContain('data-difficulty="medium"');
    });

    it('should serve /en/hard with English meta', async () => {
      const res = await request(app).get('/en/hard');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Nanpure Hard');
      expect(res.text).toContain('data-difficulty="hard"');
    });

    it('should have correct hreflang on English homepage', async () => {
      const res = await request(app).get('/en/');
      expect(res.text).toContain('hreflang="ja" href="https://nanpure.meg4ne.net/"');
      expect(res.text).toContain('hreflang="en" href="https://nanpure.meg4ne.net/en/"');
    });

    it('should have correct hreflang on English difficulty page', async () => {
      const res = await request(app).get('/en/easy');
      expect(res.text).toContain('hreflang="ja" href="https://nanpure.meg4ne.net/easy"');
      expect(res.text).toContain('hreflang="en" href="https://nanpure.meg4ne.net/en/easy"');
    });

    it('should have correct canonical URL for English pages', async () => {
      const res = await request(app).get('/en/');
      expect(res.text).toContain('href="https://nanpure.meg4ne.net/en/"');
    });

    it('should have English difficulty links on English difficulty pages', async () => {
      const res = await request(app).get('/en/easy');
      expect(res.text).toContain('href="/en/medium"');
      expect(res.text).toContain('href="/en/hard"');
    });

    it('should have en_US og:locale on English pages', async () => {
      const res = await request(app).get('/en/');
      expect(res.text).toContain('og:locale" content="en_US"');
    });
  });

  describe('Hreflang on Japanese pages', () => {
    it('should have correct hreflang on Japanese homepage', async () => {
      const res = await request(app).get('/');
      expect(res.text).toContain('hreflang="ja" href="https://nanpure.meg4ne.net/"');
      expect(res.text).toContain('hreflang="en" href="https://nanpure.meg4ne.net/en/"');
    });

    it('should have correct hreflang on Japanese difficulty page', async () => {
      const res = await request(app).get('/easy');
      expect(res.text).toContain('hreflang="ja" href="https://nanpure.meg4ne.net/easy"');
      expect(res.text).toContain('hreflang="en" href="https://nanpure.meg4ne.net/en/easy"');
    });
  });
});
