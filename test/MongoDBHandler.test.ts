import { MongoDBHandler } from '../src/MongoDBHandler';
import { assert, expect } from 'chai';
import { Maze } from '../src/Maze';
import Config from '../src/Config';
import { Cursor } from 'mongodb';

// tslint:disable-next-line: no-var-requires
require('dotenv').config();

// test cases
describe('MongoDBHandler Tests', () => {
  let mongo: MongoDBHandler;
  let mazeRaw: Maze;
  let mazeStored: Maze;
  let config: Config;

  before('Mongo Client should connect', () =>
    MongoDBHandler.getInstance()
      .then(instance => {
        mongo = instance;
        return expect(mongo.isConnected()).to.be.true;
      })
      .then(() => {
        config = Config.getInstance();
        mazeRaw = new Maze().generate(3, 3, 5, 'MongoDBHandler_TestName', 'MongoDBHandler_TestSeed');
      })
      .catch(error => {
        assert.fail(error);
      }),
  );

  after('Mongo Client should disconnect', () => {
    mongo.disconnect();
    expect(mongo.isConnected()).to.equal(false);
  });

  it(`MongoDB should be connected`, () => {
    expect(mongo.isConnected()).to.be.equal(true);
  });

  it(`Mazes collection count should be greater than 0`, () => {
    return mongo.countDocuments(config.MONGO_COL_MAZES).then(result => {
      expect(result).to.be.greaterThan(0);
    });
  });

  it(`Scores collection count should be 0.`, () => {
    return mongo.countDocuments(config.MONGO_COL_SCORES).then(result => {
      expect(result).to.equal(0);
    });
  });

  it(`Teams collection count should be 0.`, () => {
    return mongo.countDocuments(config.MONGO_COL_TEAMS).then(result => {
      expect(result).to.equal(0);
    });
  });

  it(`getAllDocuments cursor.count should be greater than 0`, () => {
    const cur: Cursor = mongo.getAllDocuments(config.MONGO_COL_MAZES);
    return cur.count(true).then(count => {
      expect(count).to.be.greaterThan(0);
    });
  });

  it(`Maze document should be inserted`, () => {
    // need to create a copy of the maze to insert
    // since mongo tags the object with the generated object _id
    mazeStored = new Maze(mazeRaw);
    return mongo.insertDocument(config.MONGO_COL_MAZES, mazeStored).then(result => {
      expect(result.insertedCount).to.equal(1);
    });
  });

  it(`getDocument should return null if document is not found`, () => {
    return mongo.getDocument(config.MONGO_COL_MAZES, '0:0:0:FakeName:FakeSeed').then(doc => {
      expect(doc).to.be.equal(null);
    });
  });

  it(`Same maze cannot be inserted twice`, () => {
    // need to create a copy of the maze to insert
    // since mongo tags the object with the generated object _id
    const tmpMaze = new Maze(mazeRaw);
    return mongo
      .insertDocument(config.MONGO_COL_MAZES, tmpMaze)
      .then(result => {
        expect(result).to.equal(undefined);
      })
      .catch(err => {
        expect(err.message).to.contain('E11000 duplicate key error collection');
      });
  });

  it(`Maze from database should match maze in memory`, () => {
    return mongo.getDocument(config.MONGO_COL_MAZES, mazeRaw.Id).then(doc => {
      const mazeFromDb: Maze = new Maze(doc);
      expect(JSON.stringify(mazeFromDb)).to.equal(JSON.stringify(mazeRaw));
    });
  });

  it(`updateDocument should return successfully`, () => {
    mazeStored.Note = 'MongDBHandler.test Unit Test Note';
    return mongo.updateDocument(config.MONGO_COL_MAZES, mazeStored.Id, mazeStored).then(result => {
      expect(result.modifiedCount).to.equal(1);
    });
  });

  it(`Maze from database contain updates`, () => {
    return mongo.getDocument(config.MONGO_COL_MAZES, mazeRaw.Id).then(doc => {
      const mazeFromDb: Maze = new Maze(doc);
      expect(mazeFromDb.Note).to.equal(mazeStored.Note);
    });
  });

  it(`Maze document should be deleted`, () => {
    return mongo.deleteDocument(config.MONGO_COL_MAZES, mazeRaw.Id).then(result => {
      expect(result.deletedCount).to.equal(1);
    });
  });
});
