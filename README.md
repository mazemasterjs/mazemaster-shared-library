# shared-library

Shared Library for MazeMaster. This is published to npm at @mazemasterjs/shared-library.

## Change Notes

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
