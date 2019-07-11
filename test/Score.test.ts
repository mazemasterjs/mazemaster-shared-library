import { expect } from 'chai';
import { GAME_MODES, GAME_RESULTS, TROPHY_IDS } from '../src/Enums';
import { Score } from '../src/Score';
import { IScore } from '../src/Interfaces/IScore';
import ITrophyStub from '../src/Interfaces/ITrophyStub';
import { Logger } from '@mazemasterjs/logger';
Logger.getInstance().LogLevel = 3;

/**
 * Test cases for Team object
 *
 * Note: Mostly covered by Game.test.ts - just need to test data instanatiation here
 */
describe(__filename + ' - Score Tests', () => {
  const invalidScoreData1 =
    '{"id":"fake-score-id","gameId":"fake-game-id","mazeId":"fake-maze-id","teamId":"fake-team-id","botId":"fake-bot-id","gameMode":1,"gameRound":"NaN","gameResult":6,"moveCount":2,"backtrackCount":3,"trophyStubs":[],"bonusPoints":4}';
  const invalidScoreData2 =
    '{"id":"fake-score-id","gameId":"fake-game-id","mazeId":"fake-maze-id","teamId":"fake-team-id","botId":"fake-bot-id","gameMode":1,"gameRound":1,"gameResult":6,"moveCount":2,"backtrackCount":3,"trophyStubs":"WASTED_TIME","bonusPoints":4}';
  const invalidScoreData3 =
    '{"id":"fake-score-id","gameId":"fake-game-id","mazeId":"fake-maze-id","teamId":"fake-team-id","botId":"fake-bot-id","gameMode":1,"gameRound":1,"gameResult":99,"moveCount":2,"backtrackCount":3,"trophyStubs":[],"bonusPoints":4}';

  const EXPECTED_TOTAL_SCORE = 1092;

  const scoreData: IScore = {
    id: 'fake-score-id',
    gameId: 'fake-game-id',
    mazeId: 'fake-maze-id',
    teamId: 'fake-team-id',
    botId: 'fake-bot-id',
    gameMode: GAME_MODES.NONE,
    gameRound: 1,
    gameResult: GAME_RESULTS.DEATH_LAVA,
    moveCount: 10,
    backtrackCount: 4,
    trophyStubs: new Array<ITrophyStub>(),
    bonusPoints: 100,
    totalScore: 982,
    lastUpdated: Date.now(),
  };

  const score = Score.fromJson(scoreData);

  it(`should throw error on bad score data: gameRound`, () => {
    expect(() => {
      Score.fromJson(JSON.parse(invalidScoreData1)).addBacktrack();
    }).to.throw();
  });

  it(`should throw error on bad score data: trophyStubs`, () => {
    expect(() => {
      Score.fromJson(JSON.parse(invalidScoreData2)).addBacktrack();
    }).to.throw();
  });

  it(`should throw error on bad score data: gameResult`, () => {
    expect(() => {
      Score.fromJson(JSON.parse(invalidScoreData3));
    }).to.throw();
  });

  it(`new Score() should return default score object`, () => {
    const tmpScore = new Score('blah', 'blah', 'blah', GAME_MODES.NONE);
    return expect(tmpScore.Id).to.not.be.empty;
  });

  it(`score.BotId should equal ${scoreData.botId}`, () => {
    expect(score.BotId).to.equal(scoreData.botId);
  });

  it(`score.TeamId should equal ${scoreData.teamId}`, () => {
    expect(score.TeamId).to.equal(scoreData.teamId);
  });

  it(`score.MazeId should equal ${scoreData.mazeId}`, () => {
    expect(score.MazeId).to.equal(scoreData.mazeId);
  });

  it(`score.MazeId be changed to ${scoreData.mazeId + '_updated'}`, () => {
    score.MazeId += '_updated';
    expect(score.MazeId).to.equal(scoreData.mazeId + '_updated');
  });

  it(`score.GameId should equal ${scoreData.gameId}`, () => {
    expect(score.GameId).to.equal(scoreData.gameId);
  });

  it(`score.GameId be changed to ${scoreData.gameId + '_updated'}`, () => {
    score.GameId += '_updated';
    expect(score.GameId).to.equal(scoreData.gameId + '_updated');
  });

  it(`score.TeamId be changed to ${scoreData.teamId + '_updated'}`, () => {
    score.TeamId += '_updated';
    expect(score.TeamId).to.equal(scoreData.teamId + '_updated');
  });

  it(`score.BotId be changed to ${scoreData.botId + '_updated'}`, () => {
    score.BotId += '_updated';
    expect(score.BotId).to.equal(scoreData.botId + '_updated');
  });

  it(`score.GameResult should equal ${scoreData.gameResult}`, () => {
    expect(score.GameResult).to.equal(scoreData.gameResult);
  });

  it(`score.GameMode should equal ${scoreData.gameMode}`, () => {
    expect(score.GameMode).to.equal(scoreData.gameMode);
  });

  it(`score.GameMode = GAME_MODES.SINGLE_PLAYER should set gameMode to ${GAME_MODES.SINGLE_PLAYER}`, () => {
    score.GameMode = GAME_MODES.SINGLE_PLAYER;
    expect(score.GameMode).to.equal(GAME_MODES.SINGLE_PLAYER);
  });

  it(`score.GameResult = GAME_RESULTS.IN_PROGRESS should set gameResult to ${GAME_RESULTS.IN_PROGRESS}`, () => {
    score.GameResult = GAME_RESULTS.IN_PROGRESS;
    expect(score.GameResult).to.equal(GAME_RESULTS.IN_PROGRESS);
  });

  it(`score.BonusPoints should equal ${scoreData.bonusPoints}`, () => {
    expect(score.BonusPoints).to.equal(scoreData.bonusPoints);
  });

  it(`score.addBonusPoints to increase bonusPoints to ${scoreData.bonusPoints + 10}`, () => {
    score.addBonusPoints(10);
    expect(score.BonusPoints).to.equal(scoreData.bonusPoints + 10);
  });

  it(`score.lastUpdated accepts new value`, () => {
    const curVal = score.LastUpdated;
    score.LastUpdated = Date.now();
    expect(curVal).to.be.lessThan(score.LastUpdated);
  });

  it(`score.moves should equal ${scoreData.moveCount}`, () => {
    expect(score.MoveCount).to.equal(scoreData.moveCount);
  });

  it(`score.addMove() to increase moveCount to ${scoreData.moveCount + 1}`, () => {
    score.addMove();
    expect(score.MoveCount).to.equal(scoreData.moveCount + 1);
  });

  it(`score.addMoves(2) to increase moveCount to ${scoreData.moveCount + 3}`, () => {
    score.addMoves(2);
    expect(score.MoveCount).to.equal(scoreData.moveCount + 3);
  });

  it(`score.backTrackCount should equal ${scoreData.backtrackCount}`, () => {
    expect(score.BacktrackCount).to.equal(scoreData.backtrackCount);
  });

  it(`score.GameRound should equal ${scoreData.gameRound}`, () => {
    expect(score.GameRound).to.equal(scoreData.gameRound);
  });

  it(`score.GameRound = 2 should set score.GameRound to 2`, () => {
    score.GameRound = 2;
    expect(score.GameRound).to.equal(2);
  });

  it(`score.addBackTrack() should increase backtrackCount to ${scoreData.backtrackCount + 1}`, () => {
    score.addBacktrack();
    expect(score.BacktrackCount).to.equal(scoreData.backtrackCount + 1);
  });

  it(`score.getTotalScore() should return ... `, () => {
    expect(score.getTotalScore()).to.equal(EXPECTED_TOTAL_SCORE);
  });

  it(`score.AddTrophy(TROPHY_IDS.WASTED_TIME) to return count of 1`, () => {
    expect(score.addTrophy(TROPHY_IDS.WASTED_TIME)).to.equal(1);
  });

  it(`score.AddTrophy(TROPHY_IDS.WASTED_TIME) to return count of 2`, () => {
    expect(score.addTrophy(TROPHY_IDS.WASTED_TIME)).to.equal(2);
  });

  it(`score.getTrophyCount(TROPHY_IDS.DAZED_AND_CONFUSED) to return count of 3`, () => {
    score.addTrophy(TROPHY_IDS.DAZED_AND_CONFUSED);
    score.addTrophy(TROPHY_IDS.DAZED_AND_CONFUSED);
    score.addTrophy(TROPHY_IDS.DAZED_AND_CONFUSED);
    expect(score.getTrophyCount(TROPHY_IDS.DAZED_AND_CONFUSED)).to.equal(3);
  });

  it(`score.trophyStubs.length to equal 2`, () => {
    expect(score.Trophies.length).to.equal(2);
  });
  // ... Just a few tests here - the rest of this is covered in Game.test.ts
});
