const { getPuzzle, initPools, getPoolStatus, stopPools } = require('./puzzlePool');

afterAll(() => {
  stopPools();
});

describe('PuzzlePool', () => {
  it('should return a valid puzzle from getPuzzle', async () => {
    const result = await getPuzzle('easy');
    expect(result).toHaveProperty('puzzle');
    expect(result).toHaveProperty('solution');
    expect(result).toHaveProperty('difficulty', 'easy');
    expect(result).toHaveProperty('hints');
    expect(result).toHaveProperty('grade');
    expect(result.puzzle).toHaveLength(9);
    expect(result.solution).toHaveLength(9);
  }, 15000);

  it('should work for all difficulty levels', async () => {
    for (const diff of ['easy', 'medium', 'hard']) {
      const result = await getPuzzle(diff);
      expect(result).toHaveProperty('puzzle');
      expect(result).toHaveProperty('solution');
      expect(result.puzzle).toHaveLength(9);
    }
  }, 30000);

  it('should initialize pools and report status', async () => {
    initPools();
    // Workerスレッドでの補充は非同期なので、少し待ってから確認
    await new Promise((resolve) => setTimeout(resolve, 15000));
    const status = getPoolStatus();
    expect(status.easy).toBeGreaterThan(0);
    expect(status.medium).toBeGreaterThan(0);
    expect(status.hard).toBeGreaterThan(0);
  }, 30000);

  it('should refill pool after taking puzzles below threshold', async () => {
    // プールから閾値以下になるまで取得
    const status = getPoolStatus();
    const toTake = status.easy; // 全部取る
    for (let i = 0; i < toTake; i++) {
      getPuzzle('easy');
    }
    expect(getPoolStatus().easy).toBe(0);

    // Worker補充が始まるので待つ
    await new Promise((resolve) => setTimeout(resolve, 15000));
    const afterStatus = getPoolStatus();
    // 補充されてプールにパズルが戻っていることを確認
    expect(afterStatus.easy).toBeGreaterThan(0);
  }, 30000);
});
