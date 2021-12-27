/* eslint-disable @typescript-eslint/no-explicit-any */
import {given} from '@geeebe/jest-bdd';
import YAML from 'yaml';
import {jsoncalc, parseJson, parseYaml} from '../jsoncalc';
import fs from 'fs';

jest.mock('fs');
const spy = jest.spyOn(console, 'warn').mockImplementation();

afterAll(spy.mockRestore);

given(
  'loadFile',
  () => {},
  (when, then) => {
    when('no path is supplied', () => {
      spy.mockReset();
      jsoncalc('', {});
      then('a warning should be reported', () => {
        expect(console.warn).toBeCalled();
      });
    });
    when('an invalid path is supplied', () => {
      spy.mockReset();
      jsoncalc('xxx', {});
      then('a warning should be reported', () => {
        expect(console.warn).toBeCalled();
      });
    });
  }
);

given(
  'parseJSON or -YAML',
  () => {},
  (when, then) => {
    when('invalid JSON is supplied', () => {
      parseJson('x');
      then('a warning should be reported', () => {
        expect(console.warn).toBeCalled();
      });
    });
    when('valid YAML is supplied', () => {
      const contents = YAML.stringify({
        a: 1,
        b: 2,
        c: {
          ca: 3.1,
          cb: [4, 5, 6],
        },
      });
      const yml = parseYaml(contents);
      then('an object should be parsed', () => {
        expect(yml).not.toBeNull();
        expect(yml).toHaveProperty('a');
        expect(yml.c).toHaveProperty('cb');
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
          //TODO: fix the issue with arrays
          c: 3, //[1, 2],
          d: 0,
          e: {
            e1: 1,
            //TODO: fix the issue with strings
            e2: 0, //'',
          },
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
        expect((calculated as any)._total).toBe(7);
      });
    });
    const sample = {
      sum: {
        field: '_total',
        result: 7,
      },
      count: {
        field: '_count',
        result: 6,
      },
      avg: {
        field: '_avg',
        result: 1.167,
      },
      yep: {
        field: '_yep',
        result: 4,
      },
      nope: {
        field: '_nope',
        result: 2,
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
