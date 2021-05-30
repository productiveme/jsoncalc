/* eslint-disable @typescript-eslint/no-explicit-any */
import {given} from '@geeebe/jest-bdd';
import {jsoncalc} from '../jsoncalc';
import fs from 'fs';

jest.mock('fs');
jest.spyOn(global.console, 'warn');

given(
  'loadJson',
  () => {},
  (when, then) => {
    when('no path is supplied', () => {
      jest.clearAllMocks();
      jsoncalc('', {});
      then('a warning should be reported', () => {
        expect(console.warn).toBeCalled();
      });
    });
    when('an invalid path is supplied', () => {
      jest.clearAllMocks();
      jsoncalc('xxx', {});
      then('a warning should be reported', () => {
        expect(console.warn).toBeCalled();
      });
    });
  }
);

given(
  'jsoncalc initializes',
  () => {
    (fs.readFileSync as any).mockReturnValue(
      JSON.stringify({
        test: {
          a: 1,
          b: 2,
          c: 3,
        },
      })
    );
  },
  (when, then) => {
    when('no reducer is specified', () => {
      let calculated: string;
      jsoncalc('mock.json', {
        applyChanges({result}) {
          calculated = result;
        },
      });
      then('a sum calculation should be applied', () => {
        expect(calculated).toHaveProperty('_total');
      });
    });
    when('sum reducer is specified', () => {
      let calculated: string;
      jsoncalc('mock.json', {
        reducer: 'sum',
        applyChanges({result}) {
          calculated = result;
        },
      });
      then('a sum calculation should be applied', () => {
        expect(calculated).toHaveProperty('_total');
      });
    });
    when.each(['count', 'avg', 'yep', 'nope'])(
      '%s reducer is specified',
      (_ignore, i) => {
        let calculated: string;
        jsoncalc('mock.json', {
          reducer: i,
          applyChanges({result}) {
            calculated = result;
          },
        });
        then(`a ${i} calculation should be applied`, () => {
          expect(calculated).toHaveProperty(`_${i}`);
        });
      }
    );
    when('sum,count reducers are supplied', () => {
      let calculated: string;
      jsoncalc('mock.json', {
        reducer: 'sum,count',
        applyChanges({result}) {
          calculated = result;
        },
      });
      then('a sum and count calculation should be applied', () => {
        expect(calculated).toHaveProperty('_total');
        expect(calculated).toHaveProperty('_count');
      });
    });
  }
);

// given(
//   'an empty array',
//   () => {
//     // perform any logic to fulfil the "given" condition described
//     const array: number[] = [];

//     // return any artifacts required by the tests
//     return {array};
//   },
//   (when, then) => {
//     when('pop() is called', ({array}) => {
//       // perform pop operation described
//       const result = array.pop();

//       then('the result will be undefined', () => {
//         expect(result).toBeUndefined();
//       });

//       then('the length of the array will still be 0', () => {
//         expect(array.length).toBe(0);
//       });
//     });

//     when.each([1, -2, 3])('push(%s) is called', ({array}, i) => {
//       // perform push operation described
//       const result = array.push(i);

//       then(
//         'the result will be 1 (length of array with single item added)',
//         () => {
//           expect(result).toBe(1);
//         }
//       );

//       then('the length of the array will be 1', () => {
//         expect(array.length).toBe(1);
//       });

//       then('the array will contain the item pushed', () => {
//         expect(array).toContain(i);
//       });
//     });
//   }
// );
