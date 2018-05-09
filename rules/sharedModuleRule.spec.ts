import { assertSuccess, assertAnnotated } from '../test-utils/testHelper';
import { Rule } from './sharedModuleRule';

describe('SharedModule Rule', () => {

  it('should fail if module has providers', () => {

    const source = `
      @SharedModule()
      @NgModule({
        providers: [
        ~~~~~~~~~
          MyService
        ]
      })
      class MyModule{ }
    `;
    assertAnnotated({
      ruleName: 'shared-module',
      message: Rule.FAILURE_STRING,
      source
    });
  });

});
