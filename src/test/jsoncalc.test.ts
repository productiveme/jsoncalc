/* eslint-disable @typescript-eslint/no-explicit-any */
import {given} from '@geeebe/jest-bdd';
import {jsoncalc} from '../jsoncalc';
import fs from 'fs';

jest.mock('fs');
const spy = jest.spyOn(console, 'warn').mockImplementation();

afterAll(() => {
  spy.mockRestore();
});

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
          d: 0,
        },
      })
    );
  },
  (when, then) => {
    when('no reducer is specified', () => {
      let calculated: Object;
      jsoncalc('mock.json', {
        applyChanges({result}) {
          calculated = result;
        },
      });
      then('a sum calculation should be applied', () => {
        expect(calculated).toHaveProperty('_total');
        expect((calculated as any)._total).toBe(6);
      });
    });
    const sample = {
      sum: {
        field: '_total',
        result: 6,
      },
      count: {
        field: '_count',
        result: 4,
      },
      avg: {
        field: '_avg',
        result: 1.5,
      },
      yep: {
        field: '_yep',
        result: 3,
      },
      nope: {
        field: '_nope',
        result: 1,
      },
    };
    when.each(Object.keys(sample))('%s reducer is specified', (_ignore, i) => {
      let calculated: string;
      jsoncalc('mock.json', {
        reducer: i,
        applyChanges({result}) {
          calculated = result;
        },
      });
      then(`a ${i} calculation should be applied`, () => {
        expect(calculated).toHaveProperty((sample as any)[i].field);
        expect((calculated as any)[(sample as any)[i].field]).toBe(
          (sample as any)[i].result
        );
      });
    });
    when(`${Object.keys(sample).join(',')} reducers are supplied`, () => {
      let calculated: Object;
      jsoncalc('mock.json', {
        reducer: Object.keys(sample).join(','),
        applyChanges({result}) {
          calculated = result;
        },
      });
      then('each of the calculations should be applied', () => {
        Object.keys(sample).forEach(i => {
          expect(calculated).toHaveProperty((sample as any)[i].field);
          expect((calculated as any)[(sample as any)[i].field]).toBe(
            (sample as any)[i].result
          );
        });
      });
    });
  }
);
