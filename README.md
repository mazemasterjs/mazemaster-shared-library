# shared-library

Shared Library for MazeMaster. This is published to npm at @mazemasterjs/shared-library.

## Change Notes

### v1.8.0

- [BREAKING CHANGE] Cell.trap is now Cell.traps and supports a bitwise value that allows multiple traps in one cell
- Maze and MazeBase now both accept optional constructor parameter "jsonData:any" in addition to the public "loadData(jsonData:any)"
- CellBase added - supports a cleaner implementation of Cell when maze building / cell modification tools aren't required -- The idea is that CellBase should be able to stand alone during gameplay, so any functions (addVist, LastVisitMoveNumber, etc.) that track movement or support scoring should exist on CellBase, while functions needed for maze generation (addExit, addTag, addTrap, etc.) are scoped to Cell (extends CellBase, extends ObjectBase)
- Several smaller changes caused by the additon of CellBase - look carefully!
- Cell and CellBase both validate input jsonData parameter types
- Cell.AddTrap(trap: CELL_TRAPS) function added to allow the safe addition of bitwise trap values
- Cell.RemoveTrap(trap: CELL_TRAPS) function added to allow the safe removal of bitwise trap values
- Added clearTraps and clearTags functions to Cell class - mostly useful for unit testing

### v1.7.2

- ObjectBase.validateField - changed all debug logging to trace

### v1.7.1

- Separated basic Maze content (properties & accessors) and extended functionality (generate, solve, etc) into two classes: BaseMaze and Maze (not so sure this was a great idea...)
- Maze class now extends BaseMaze class with extended functionality (generate, solve, etc)
- Added 'array' type to ObjectBase.validateField(field: string, val: any, type: string)
- Removed url field from maze objects
- Removed Config class and reworked Maze/MazeBase - it was not required and caused dependency issues

### v1.7.0

- Maze, Trophy, Bot, Team, and Score now all validate parameter data types when instantiated from json
- Validation function moved to abstract ObjectBase which classes needing validation now extend
- Trophy Add and Trophy Count functions moved from Helpers to ObjectBase

### v1.6.3

- Trophy.ts now validates data when instantiated from JSON
- Factored duplicated functions (addTrophy and getTrophyCount) from Bot and Team into Helpers
- Added test cases for trophies

### v1.6.1

- Service() serviceFile parameter is now optional, if undefined, an empty service will be returned
- Added Service.loadFromJson(svcData:any) - allows JSON to be passed in to populate service, endpoints, and arguments
- lastUpdated field added to maze
- isValid() method added that validates field existence and datatypes before json-based instantiation
- Added checks for valid enumeration values to isValid()
- Unit tests added to cover lastUpdated and isValid
