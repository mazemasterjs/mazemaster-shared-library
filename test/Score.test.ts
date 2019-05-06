import { expect } from 'chai';
import { GAME_RESULTS } from '../src/Enums';
import { Score } from '../src/Score';
import { IScore } from '../src/IScore';

/**
 * Test cases for Team object
 *
 * Note: Mostly covered by Game.test.ts - just need to test data instanatiation here
 */
describe('Team Tests', () => {
  const scoreData: IScore = {
    backtrackCount: 3,
    bonusPoints: 4,
    botId: 'fake-bot-id',
    gameId: 'fake-game-id',
    gameResult: GAME_RESULTS.DEATH_LAVA,
    gameRound: 1,
    id: 'fake-score-id',
    lastUpdated: Date.now(),
    mazeId: 'fake-maze-id',
    moveCount: 2,
    teamId: 'fake-team-id',
  };

  const score = new Score(scoreData);

  it(`score.BonusPoints should equal ${scoreData.bonusPoints}`, () => {
    expect(score.BonusPoints).to.equal(scoreData.bonusPoints);
  });

  it(`score.backTrackCount should equal ${scoreData.backtrackCount}`, () => {
    expect(score.BacktrackCount).to.equal(scoreData.backtrackCount);
  });

  it(`score.BotId should equal ${scoreData.botId}`, () => {
    expect(score.BotId).to.equal(scoreData.botId);
  });

  it(`score.GameId should equal ${scoreData.gameId}`, () => {
    expect(score.GameId).to.equal(scoreData.gameId);
  });

  it(`score.GameResult should equal ${scoreData.gameResult}`, () => {
    expect(score.GameResult).to.equal(scoreData.gameResult);
  });

  // ... Just a few tests here - the rest of this is covered in Game.test.ts
});
