import { assert } from 'chai';
import { DIRS } from '../src/Enums';
import { Logger } from '@mazemasterjs/logger';
import { Maze } from '../src/Maze';
import { MazeLoc } from '../src/MazeLoc';
import { reverseDir } from '../src/Helpers';

Logger.getInstance().LogLevel = 4; // trace

// test cases
describe(__filename + ' - Cell Exit Tests', () => {
  const maze = new Maze().generate(3, 3, 1, 'Tiny', 'Maze');

  it(`cell.addExit(all dirs) should add all  local and neighboring exits.`, () => {
    const ctrLoc = new MazeLoc(1, 1);
    const ctrCell = maze.getCell(ctrLoc);

    console.log('Before Add:', `\n\r${maze.generateTextRender(true, ctrCell.Location)}`);
    for (let dir = 1; dir <= DIRS.WEST; dir = dir << 1) {
      const rid = reverseDir(dir);
      const nCell = maze.getNeighbor(ctrCell, dir);
      maze.addExit(ctrCell, dir);

      // check for exit out of cell
      if (!(ctrCell.Exits & dir)) {
        return assert.fail(`Expected exit from ${ctrCell.Location.toString()} to the ${DIRS[dir]} not found. Exits are ${ctrCell.listExits()}`);
      }

      // check for neighboring return wall
      if (!(nCell.Exits & rid)) {
        return assert.fail(`Expected exit from ${nCell.Location.toString()} to the ${DIRS[rid]} not found. Exits are ${nCell.listExits()}`);
      }
    }
    console.log('After Add:', `\n\r${maze.generateTextRender(true, ctrCell.Location)}`);

    return assert(true);
  });

  it(`cell.removeExit (all dirs) should remove all local and neighboring exits.`, () => {
    const ctrLoc = new MazeLoc(1, 1);
    const ctrCell = maze.getCell(ctrLoc);

    console.log('Before Remove:', `\n\r${maze.generateTextRender(true, ctrCell.Location)}`);
    for (let dir = 1; dir <= DIRS.WEST; dir = dir << 1) {
      const rid = reverseDir(dir);
      const nCell = maze.getNeighbor(ctrCell, dir);

      maze.removeExit(ctrCell, dir);

      // check for wall out of cell
      if (!!(ctrCell.Exits & dir)) {
        console.log('After Remove:', `\n\r${maze.generateTextRender(true, ctrCell.Location)}`);
        return assert.fail(`Expected wall in ${ctrCell.Location.toString()} to the ${DIRS[dir]} not found. Exits are ${ctrCell.listExits()}`);
      }

      // check for neighboring return wall
      if (!!(nCell.Exits & rid)) {
        console.log('After Remove:', `\n\r${maze.generateTextRender(true, ctrCell.Location)}`);
        return assert.fail(`Expected wall in ${nCell.Location.toString()} to the ${DIRS[rid]} not found. Exits are ${nCell.listExits()}`);
      }
    }
    console.log('After Remove:', `\n\r${maze.generateTextRender(true, ctrCell.Location)}`);

    return assert(true);
  });
});
