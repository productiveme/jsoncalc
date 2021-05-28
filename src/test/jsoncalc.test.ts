import {given} from '@geeebe/jest-bdd';

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
