# shared-library

Shared Library for MazeMaster. This is published to npm at @mazemasterjs/shared-library.

## Change Log

### v1.9.4

- New trap type: Cheese. It's poisoned, but it smells so gouda that if the player comes near it, they will
  - be helpless to avoid it's allure and will involuntarily consume it.
- Traps now have implied difficulty levels to make Challenge Level more meaningful:
  - All : Pit >p<, Mouse Trap >m<
  - CL 4: Tarpit >t<
  - CL 5: Flamethrower >f<
  - CL 6: Deadfall >D<
  - CL 7: Poison Dart >d<
  - CL 8: Fragile Floor >F<
  - CL 9: Teleporter >T<
  - CL 10: Poisoned Cheese >c<
- New trap types now included with textRender

### v1.9.3

- getCell, getNeighbor, and generateTextRender all moved to MazeBase. Maze is now only needed for generation.
- Added new CELL_TRAPS enum values: POISON_DART = 16, TELEPORTER = 32, DEADFALL = 64, FRAGILE_FLOOR = 128
- Corrected spelling of CELL_TRAPS.FLAMETHOWER

### v1.9.2

- Removed the hardcoded "You see...", "You smell...", etc. text in the engram constructor.

### v1.9.1

- Added LEFT and RIGHT (16, 32) to DIRS to support turn/facing
- Added SNIFF, LISTEN, WAIT, FACE, and TURN to COMMANDS Enum (some may not get used)

### v1.9.0

- added facing for the player object based on the existing cardinal direction ENUMs.

### v1.8.12

- added game.getLastAction() function that returns the latest IAction from an active game

### v1.8.10

- Removed bad unidentified string coercions in Game, Helpers, and Score

### v1.8.9

- Player starting location was inadvertantly mapped as reference to maze's StartCell... Fixed.
- Added two new TROPHY_IDS: STANDING_AROUND and TAKING_A_STAND
- TROPHY_IDS id fields updated to map against actual data

### v1.8.7

- Redefined BASE_SCORE as environment var. Default is 1000 - used as the starting score for a maze run

### v1.8.5

- Removed IMazeLoc - it's not very useful (and may be causing issues with instantiation?
- Location class renamed to "MazeLoc" - there's a core node class called "Location" that seemed to be interfering with some things
  - It didn't help - something about this class prevents it from exposing internal functions when referenced via a parent object (e.g. Game->Player->MazeLoc)
- Re-added lastUpdated to Score object to support date-sorted database queries
- Stripped property accessors from Engram - what was the point anyway? Lots of pointless accessors all over the place after recent refactoring, but may not get around to removing them all.
- Fixed mismatch in Enum.TROPHY_IDS: WINNER_WINNER_CHEDDAR_DINNER is now CHICKEN_DINNER
- Added COMMANDS enum: {NONE, LOOK, MOVE, JUMP, WRITE, SIT, STAND, QUIT}
- Static .fromJson(data: any) instantiators added Action, MazeLoc, and Score classes (probably will repace other "loadData" functions with this appropach in the future)
- Action class requires command, direction, and message values in constructor
- Trophies removed from Team and Bot - now maintained in Score
- updated validateDataField(field: string, val: any, type: string, noTrim?: boolean): any
- added ObjectBase.validateEnumField(fieldName: string, enumName: string, enumObj: object, enumVal: number): number
- fixed isNumber check in Helpers getSelectedBitNames and listSelectedBitNames functions
- Completely reworked Action and Score classes and how they relate to Game
- Moved interfaces into ./Interfaces subfolder - it was just getting crowded

### v1.8.2

- Team / Bot (aka Single / Multiplayer) game modes set automatically - if a botId is provided, game is single-player
- Validation now automatically trims string variables (unless told not to)
- Maze.getMazeStub() moved to MazeBase
- Player.ts updated to ensure that player is never left as PLAYER_STATES.NONE - Default state is now PLAYER_STATES.STANDING (1)
- Bot.ts data validation will now report the correct field names when validaton fails
- Reworked logging to improve performance across the board
- All maze tests now compare hash values instead of stringified json
- Generated IDs have been shorted to hashed UUIDs (Team, Score, Bot, and Game)

### v1.8.1

- Added forced type conversion (string -> number) to maze.generate() via a new validateAndSetGenParams(...) method to fix a bug where generated mazes were returning string values for height, width, and challengeLevel.
- Added tests to cover parameter validation in maze.generate()
- Cleaned up logging in Maze.ts and removed util.format dependency

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
