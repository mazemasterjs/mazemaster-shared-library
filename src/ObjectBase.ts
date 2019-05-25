import Logger from '@mazemasterjs/logger';
import { TROPHY_IDS } from './Enums';
import { ITrophyStub } from './ITrophyStub';
import { isArray } from 'util';

const log = Logger.getInstance();

/**
 * Base class providing functions/features common to most of the MMJS
 * game objects.
 *
 */

export abstract class ObjectBase {
  /**
   * Validate that the given value is of the expected type.
   *
   * @param field string - the field name being validated
   * @param val any - the field value to check for proper typing
   * @param type string - the type name to check for for
   *
   * @returns any - Returns the given val if validation succeeds
   * @throws Error - Will throw a 'Type Error' if the typing is incrrect
   */
  protected validateField(field: string, val: any, type: string): any {
    let valType;

    if (type === 'array') {
      if (isArray(val)) {
        valType = 'array';
      }
    } else {
      valType = typeof val;
    }

    if (valType !== type) {
      const err = new Error(`${field} field is ${valType}, expected ${type}.`);
      log.error(__filename, `validateField(${field}, ${val}, ${type})`, 'Type Error ->', err);
      throw err;
    }

    log.debug(__filename, `validateField(${field}, ${val}, ${type})`, `${field} field is ${valType}, as expected.`);
    return val;
  }

  /**
   * Grants a trophy by increasing the count or adding a s to the given array
   *
   * @param trophyId number - An enumeration value from Enums.TROPHY_IDS
   * @param trophyStubs Array<ITrophyStub> - Array of stubs to to add the trophy to.
   * @returns Array<ITrophyStub>
   */
  protected addTrophy(trophyId: TROPHY_IDS, trophyStubs: Array<ITrophyStub>): Array<ITrophyStub> {
    // first check for existing trophy and increment count
    for (const trophy of trophyStubs) {
      if (trophy.id === trophyId) {
        trophy.count++;
        return trophyStubs;
      }
    }

    // trophy wasn't found, so we have to add a new stub with a count of 1
    const tStub: ITrophyStub = {
      count: 1,
      id: trophyId,
      name: TROPHY_IDS[trophyId],
    };

    // add it to the array
    trophyStubs.push(tStub);

    // return the array
    return trophyStubs;
  }

  /**
   * Returns the count (number of times awarded) of the
   * trophy with the given TrophyId from Enums.TROPHY_IDS
   *
   * @param trophyId (Enums.TROPHY_IDS) - The Id of the trophy to get a count of
   */
  protected countTrophy(trophyId: TROPHY_IDS, trophyStubs: Array<ITrophyStub>): number {
    for (const trophy of trophyStubs) {
      if (trophy.id === trophyId) {
        return trophy.count;
      }
    }
    return 0;
  }
}
