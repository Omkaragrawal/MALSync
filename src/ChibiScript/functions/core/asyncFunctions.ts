import type { ChibiJson } from 'src/chibiScript/ChibiGenerator';
import type { ChibiCtx } from '../../ChibiCtx';

const intervalRegistry: { [key: string]: NodeJS.Timer } = {};

export default {
  /**
   * Wait for the DOM to be ready
   * @input void - No input required
   */
  domReady: (ctx: ChibiCtx, input: void): Promise<void> => {
    return new Promise(resolve => {
      $(() => {
        resolve();
      });
    });
  },

  /**
   * Wait for a specific condition to be true
   * @param condition - Condition to evaluate
   * @param _intervalKey - Internal never provide this
   * @returns Promise that resolves when the condition is true
   */
  waitUntilTrue: (
    ctx: ChibiCtx,
    input: void,
    condition: ChibiJson<boolean>,
    _intervalKey?,
  ): Promise<void> => {
    return new Promise(resolve => {
      clearInterval(intervalRegistry[_intervalKey!]);
      intervalRegistry[_intervalKey!] = setInterval(() => {
        const conditionState = ctx.run(condition);
        if (conditionState) {
          clearInterval(intervalRegistry[_intervalKey!]);
          resolve();
        }
      }, 100);
    });
  },
};
