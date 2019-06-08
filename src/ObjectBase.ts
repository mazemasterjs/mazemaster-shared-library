import uuid from 'uuid/v4';
import { MD5 as hash } from 'object-hash';
import { LOG_LEVELS, Logger } from '@mazemasterjs/logger';
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
   * @throws Validation Error
   */
  protected validateDataField(field: string, val: any, type: string, noTrim?: boolean): any {
    const method = `validateDataField(${field}, ${val}, ${type})`;
    let valType;

    if (type === 'array') {
      if (isArray(val)) {
        valType = 'array';
      }
    } else {
      valType = typeof val;
    }

    // trim string values (unless noTrim flag is set)
    if (valType === 'string' && !noTrim) {
      val = val.trim();
    }

    if (valType !== type) {
      const err = new Error(`${field} field is ${valType}, expected ${type}.`);
      log.error(__filename, method, 'Validation Error ->', err);
      throw err;
    }

    this.logTrace(__filename, method, `${field} field is ${valType}, as expected.`);
    return val;
  }

  /**
   * Validate that enumeration values passed from json data match
   * values stored in the actual enumeration
   *
   * @param fieldName - name of the class field being validated
   * @param enumName - name of the enumeration to validate against
   * @param enumObj - the enumeration to validate against
   * @param enumVal - the value to validate
   *
   * @returns number - the validated value of enumVal
   * @throws Validation Error
   */
  protected validateEnumField(fieldName: string, enumName: string, enumObj: object, enumVal: number): number {
    const method = `validateEnumField(${fieldName}, ${enumName}, ${enumObj}, ${enumVal})`;
    this.logDebug(__filename, method, 'Validating enumerated field value.');

    for (const val in enumObj) {
      if (val) {
        if (!isNaN(parseInt(val, 10)) && parseInt(val, 10) === enumVal) {
          this.logDebug(__filename, method, `${fieldName} field value is valid within enumeration ${enumName}`);
          return enumVal;
        }
      }
    }

    const err = new Error(`${fieldName} field value is not valid within enumeration ${enumName}.`);
    log.error(__filename, method, 'Validation Error ->', err);
    throw err;
  }

  /**
   * Simple trace wrapper to reduce the number of useless module calls
   * @param file
   * @param method
   * @param msg
   */
  protected logTrace(file: string, method: string, msg: string) {
    if (log.LogLevel >= LOG_LEVELS.TRACE) {
      log.trace(file, method, msg);
    }
  }

  /**
   * Simple debug wrapper to reduce the number of useless module calls
   * @param file
   * @param method
   * @param msg
   */
  protected logDebug(file: string, method: string, msg: string) {
    if (log.LogLevel >= LOG_LEVELS.DEBUG) {
      log.debug(file, method, msg);
    }
  }

  /**
   * Hashed UUIDs should be shorter and easier to work with while hopefully still
   * unique enough for our needs
   */
  protected generateId(): string {
    const newId = hash(uuid());
    log.trace(__filename, 'generateId()', 'newId=' + newId);
    return newId;
  }
}
