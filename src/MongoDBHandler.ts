import {
  Collection,
  Cursor,
  Db,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  MongoClient,
  UpdateWriteOpResult,
} from 'mongodb';
import { Config } from './Config';
import { Logger } from '@mazemasterjs/logger';

export class MongoDBHandler {
  /**
   * Hacky singleton pattern that returns a promise instead of an instance - there must be a better way!
   *
   * Consumers need to .then((instance)=>){} this promise and assign the returned instance to a MongoDBHandler
   * variable in order to use it.
   *
   * @resolve Promise<any>
   * @reject Error
   */
  public static async getInstance(): Promise<any> {
    if (!MongoDBHandler.instance) {
      Logger.getInstance().debug(__filename, 'getInstance()', 'Instantiating new instance of class.');
      const instance = new MongoDBHandler();

      instance.log.debug(__filename, 'initConnection()', 'Awaiting MongoClient.connect()');
      instance.mongoClient = await MongoClient.connect(Config.getInstance().MONGO_CONNSTR, { useNewUrlParser: true });

      // set the static instance
      MongoDBHandler.instance = instance;
      instance.log.debug(__filename, 'initConnection()', 'Instance set, caching collections...');

      // Cache the collection objects as static member variables - vastly improves performance
      const db: Db = instance.mongoClient.db(instance.config.MONGO_DB);
      MongoDBHandler.mazes = db.collection(instance.config.MONGO_COL_MAZES);
      MongoDBHandler.scores = db.collection(instance.config.MONGO_COL_SCORES);
      MongoDBHandler.teams = db.collection(instance.config.MONGO_COL_TEAMS);

      // w00t! Log some success :)
      instance.log.debug(
        __filename,
        'initConnection()',
        `Collections cached. MongoDBHandler instance is connected and ready.`,
      );
    }

    // return the promise containing our instance (or an error)
    return new Promise((resolve, reject) => {
      if (!MongoDBHandler.instance) {
        reject(new Error('MongoDBHandler.instance is not defined.'));
      } else {
        resolve(MongoDBHandler.instance);
      }
    });
  }
  // get/declare static variables
  private static instance: MongoDBHandler;

  private static mazes: Collection;
  private static scores: Collection;
  //    private static games: Collection;
  private static teams: Collection;
  private config: Config = Config.getInstance();
  private log: Logger = Logger.getInstance();

  // declare mongo classes
  private mongoClient: MongoClient | undefined;

  // must use getInstance()
  private constructor() {}

  /**
   * Return the document count of the given collection
   *
   * @param collectionName string
   */
  public countDocuments(collectionName: string): Promise<number> {
    this.log.debug(__filename, `countDocuments(${collectionName})`, 'Attempting to get document count.');
    return this.getCollection(collectionName).countDocuments({});
  }

  /**
   * Return all documents in the given collection (danger - not paged!)
   *
   * @param collectionName string
   */
  public getAllDocuments(collectionName: string): Cursor<any> {
    this.log.debug(__filename, `getAllDocuments(${collectionName})`, 'Attempting to get all documents in collection.');
    return this.getCollection(collectionName).find();
  }

  /**
   * Return all documents in the given collection (danger - not paged!)
   *
   * @param collectionName string
   */
  public async getDocument(collectionName: string, docId: string): Promise<any> {
    const method = `getDocument(${collectionName}, ${docId})`;
    this.log.debug(__filename, method, 'Fetching document...');
    const doc = await this.getCollection(collectionName).findOne({ id: docId });

    if (!doc) {
      this.log.warn(__filename, method, 'Document not found.');
    }

    return doc;
  }

  /**
   * Update the document with the given docId with the given document data
   *
   * @param collectionName string
   * @param docId string
   * @param doc <any>
   */
  public updateDocument(collectionName: string, docId: string, doc: any): Promise<UpdateWriteOpResult> {
    const method = `updateDocument(${collectionName}, ${docId}, ${doc})`;
    this.log.debug(__filename, method, 'Attempting to update document.');
    return this.getCollection(collectionName)
      .updateOne({ id: docId }, { $set: doc }, { upsert: false })
      .catch(err => {
        this.log.error(__filename, method, 'Error while updating document -> ', err);
        return err;
      });
  }

  /**
   * Insert the given document into the specified collection
   *
   * @param collectionName string
   * @param doc any
   */
  public insertDocument(collectionName: string, doc: any): Promise<InsertOneWriteOpResult> {
    const method = `insertDocument(${collectionName}, ${doc})`;
    this.log.debug(__filename, method, 'Attempting to insert document.');

    return this.getCollection(collectionName).insertOne(doc);
    // .catch((err) => {
    //     this.log.error(__filename, method, 'Error while inserting document -> ', err);
    //     return err;
    // });
  }

  /**
   * Delete the document with the given ID from the specified collection
   *
   * @param collectionName string
   * @param id string
   */
  public deleteDocument(collectionName: string, id: string): Promise<DeleteWriteOpResultObject> {
    this.log.debug(__filename, `deleteDocument(${id})`, 'Attempting to delete document.');

    return this.getCollection(collectionName)
      .deleteOne({ id })
      .catch(err => {
        this.log.error(__filename, 'deleteDocument()', 'Error while deleting document', err);
        return err;
      });
  }

  /**
   * Returns true of the db object is defined.
   */
  public isConnected(): boolean {
    if (this.mongoClient) {
      return this.mongoClient.isConnected();
    } else {
      return false;
    }
  }

  /**
   * Close the database connection.
   */
  public disconnect() {
    if (this.mongoClient && this.mongoClient.isConnected()) {
      this.log.debug(__filename, 'disconnect()', 'Closing MongoClient Connection');
      this.mongoClient.close();
    } else {
      this.log.warn(__filename, 'disconnect()', 'MongoClient is not ' + (this.mongoClient ? 'defined' : 'connected'));
    }
  }

  /**
   * Gets and returns the database collection with the matching collectionName
   *
   * @param collectionName
   * @return MongDB Collection
   * @throws Invalid Collection Name error
   * @throws Undefined / Not Connected error
   */
  private getCollection(collectionName: string): Collection {
    this.log.trace(__filename, `getCollection(${collectionName})`, 'Getting collection.');
    if (this.mongoClient && this.mongoClient.isConnected()) {
      switch (collectionName) {
        case 'mazes':
          return MongoDBHandler.mazes;
        case 'scores':
          return MongoDBHandler.scores;
        case 'teams':
          return MongoDBHandler.teams;
        default:
          throw new Error(`Invalid collection name: ${collectionName}`);
      }
    } else {
      throw new Error('mongoClient is ' + (this.mongoClient ? 'undefined' : 'not connected'));
    }
  }
}

export default MongoDBHandler;
