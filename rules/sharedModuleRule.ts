import { RuleFailure, Rules, RuleWalker } from 'tslint';
import {
  CallExpression, ClassDeclaration, Decorator, ImportDeclaration,
  PropertyAssignment, PropertyDeclaration, SourceFile, SyntaxKind, ObjectLiteralExpression, ArrayLiteralExpression,
} from 'typescript';
import { hasDecorator, getDecoratorByName, isCallExpression } from './utils';

export class Rule extends Rules.AbstractRule {

  public static FAILURE_STRING = `Shared Modules should not define providers,
  consider using a static forRoot function instead`;

  public apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(new SharedModuleWalker(sourceFile, this.getOptions()));
  }
}

class SharedModuleWalker extends RuleWalker {

  public isSharedModule: boolean = false;

  protected visitClassDeclaration(node: ClassDeclaration): void {

    const sharedModuleDecroator = getDecoratorByName(node, 'SharedModule');

    if (sharedModuleDecroator) {
      this.failIfThereAreProviders(node);
    }
    super.visitClassDeclaration(node);
  }

  private failIfThereAreProviders(node) {
    const ngModuleDecorator = getDecoratorByName(node, 'NgModule');

    if (!ngModuleDecorator) {
      return;
    }
    const providersProperty = this.getProvidersPropertyFromNgModule(ngModuleDecorator);
    if (!providersProperty) {
      return;
    }
    const { initializer } = providersProperty;
    if (!initializer || initializer.kind !== SyntaxKind.ArrayLiteralExpression) {
      return;
    }

    if ((initializer as ArrayLiteralExpression).elements.length > 0) {
      this.addFailure(this.createFailure(providersProperty.name.getStart(),
        providersProperty.name.getWidth(),
        Rule.FAILURE_STRING));
    }
  }

  private getProvidersPropertyFromNgModule(ngModuleDecorator: CallExpression): PropertyAssignment | undefined {

    const expressionsArgs = ngModuleDecorator.arguments;
    if (!expressionsArgs || expressionsArgs.length === 0) {
      return;
    }
    const { properties } = expressionsArgs[0] as ObjectLiteralExpression;

    if (!properties || properties.length === 0) {
      return;
    }
    const providersProperty = properties.find((property) => {
      return (!!property && !!property.name && property.name.getText() === 'providers');
    });

    if (providersProperty && providersProperty.kind === SyntaxKind.PropertyAssignment) {
      return providersProperty as PropertyAssignment;
    }
  }

}
