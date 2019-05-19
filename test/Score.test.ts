import { expect } from 'chai';
import { GAME_MODES, GAME_RESULTS } from '../src/Enums';
import { Score } from '../src/Score';
import { IScore } from '../src/IScore';

/**
 * Test cases for Team object
 *
 * Note: Mostly covered by Game.test.ts - just need to test data instanatiation here
 */
describe('Score Tests', () => {
  const invalidScoreData =
    '{"backtrackCount":3,"bonusPoints":4,"botId":"test-bot-id-1","gameId":"test-game-id-1","gameResult":"5","gameRound":1,"id":"test-score-id-1","lastUpdated":123456789,"mazeId":"test-maze-id-1","moveCount":2,"teamId":"test-team-id-1"}';

  const scoreData: IScore = {
    backtrackCount: 3,
    bonusPoints: 4,
    botId: 'fake-bot-id',
    gameId: 'fake-game-id',
    gameMode: GAME_MODES.SINGLE_PLAYER,
    gameResult: GAME_RESULTS.DEATH_LAVA,
    gameRound: 1,
    id: 'fake-score-id',
    lastUpdated: Date.now(),
    mazeId: 'fake-maze-id',
    moveCount: 2,
    teamId: 'fake-team-id',
  };

  const score = new Score(scoreData);

  it(`should error when using bad score data `, () => {
    expect(() => {
      new Score(JSON.parse(invalidScoreData)).addBacktrack();
    }).to.throw();
  });

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

  it(`score.GameMode should equal ${scoreData.gameMode}`, () => {
    expect(score.GameMode).to.equal(scoreData.gameMode);
  });

  it(`score.GameMode = MULTI_PLAYER should change GameMode to MULTI_PLAYER`, () => {
    score.GameMode = GAME_MODES.MULTI_PLAYER;
    expect(score.GameMode).to.equal(GAME_MODES.MULTI_PLAYER);
  });

  it(`score.getTotalScore() should return ... `, () => {
    expect(score.getTotalScore()).to.equal(0);
  });

  // ... Just a few tests here - the rest of this is covered in Game.test.ts
});
