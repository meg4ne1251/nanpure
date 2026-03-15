const { getPuzzle, initPools, getPoolStatus, stopPools } = require('./puzzlePool');

afterAll(() => {
  stopPools();
});

describe('PuzzlePool', () => {
  it('should return a valid puzzle from getPuzzle', () => {
    const result = getPuzzle('easy');
    expect(result).toHaveProperty('puzzle');
    expect(result).toHaveProperty('solution');
    expect(result).toHaveProperty('difficulty', 'easy');
    expect(result).toHaveProperty('hints');
    expect(result).toHaveProperty('grade');
    expect(result.puzzle).toHaveLength(9);
    expect(result.solution).toHaveLength(9);
  }, 15000);

  it('should work for all difficulty levels', () => {
    for (const diff of ['easy', 'medium', 'hard']) {
      const result = getPuzzle(diff);
      expect(result).toHaveProperty('puzzle');
      expect(result).toHaveProperty('solution');
      expect(result.puzzle).toHaveLength(9);
    }
  }, 30000);

  it('should initialize pools and report status', async () => {
    initPools();
    // プール補充は非同期なので、少し待ってからステータスを確認
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const status = getPoolStatus();
    expect(status.easy).toBeGreaterThan(0);
    expect(status.medium).toBeGreaterThan(0);
    expect(status.hard).toBeGreaterThan(0);
  }, 30000);

  it('should refill pool after taking a puzzle', async () => {
    // プールが充填されるまで待つ
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const beforeStatus = getPoolStatus();
    const beforeCount = beforeStatus.easy;

    // パズルを1つ取得
    getPuzzle('easy');

    // 補充が始まるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 8000));
    const afterStatus = getPoolStatus();
    // 補充されてプールサイズが維持される
    expect(afterStatus.easy).toBeGreaterThanOrEqual(beforeCount);
  }, 30000);
});
