import { expect } from 'chai';
import { $c } from '../../../../src/chibiScript/ChibiGenerator';
import { ChibiConsumer } from '../../../../src/chibiScript/ChibiConsumer';
import controlFlowFunctions from '../../../../src/chibiScript/functions/controlFlowFunctions';

describe('Control Flow Functions', () => {
  describe('then function', () => {
    it('should execute thenAction when input is truthy', () => {
      const code = $c.string('test').then($c => $c.string('executed').run()).run();
      expect(generateAndExecute(code).run()).to.equal('executed');

      const numberCode = $c.number(42).then($c => $c.string('executed').run()).run();
      expect(generateAndExecute(numberCode).run()).to.equal('executed');
    });

    it('should not execute thenAction when input is falsy', () => {
      const falseCode = $c.boolean(false).then($c => $c.string('executed').run()).run();
      expect(generateAndExecute(falseCode).run()).to.equal(false);

      const emptyStringCode = $c.string('').then($c => $c.string('executed').run()).run();
      expect(generateAndExecute(emptyStringCode).run()).to.equal('');

      const zeroCode = $c.number(0).then($c => $c.string('executed').run()).run();
      expect(generateAndExecute(zeroCode).run()).to.equal(0);
    });

    it('should pass the input to the thenAction', () => {
      const code = $c.string('input-value').then($c => $c.concat('-modified').run()).run();
      expect(generateAndExecute(code).run()).to.equal('input-value-modified');
    });

    it('should support chaining multiple then functions', () => {
      const code = $c
        .string('start')
        .then($c => $c.concat('-1').run())
        .then($c => $c.concat('-2').run())
        .then($c => $c.concat('-3').run())
        .run();

      expect(generateAndExecute(code).run()).to.equal('start-1-2-3');
    });

    it('should not continue chain after a falsy value', () => {
      const code = $c
        .string('start')
        .then($c => $c.boolean(false).run())
        .then($c => $c.string('should-not-execute').run())
        .run();

      expect(generateAndExecute(code).run()).to.equal(false);
    });
  });
});

function generateAndExecute(input: any) {
  const json = JSON.stringify(input);
  const script = JSON.parse(json);
  const consumer = new ChibiConsumer(script);
  return consumer;
}
