import { assertSuccess, assertAnnotated } from '../test-utils/testHelper';
import { Rule } from './statelessRule';

describe('Stateless Rule', () => {

  it('should fail on empty properties', () => {

    const source = `
      @Stateless()
      class MyService{
        myName: string;
        ~~~~~~
      }
    `;
    assertAnnotated({
      ruleName: 'stateless',
      message: Rule.FAILURE_STRING,
      source
    });
  });

  it('should not fail when there is no decorator', () => {

    const source = `
      class MyService{
        myName: string;
      }
    `;
    assertSuccess('stateless', source);
  });
});
