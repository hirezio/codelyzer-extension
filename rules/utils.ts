import { ClassDeclaration, SyntaxKind, Decorator, CallExpression, Expression } from 'typescript';

export function hasDecorator(node: ClassDeclaration, decoratorName: string): boolean {
  let decoratorExists: boolean = false;

  const decorators = getDecoratorsAsCallExpressions(node);
  decorators.forEach((decorator: CallExpression) => {
    decoratorExists = decorator.expression.getText() === decoratorName;
  });

  return decoratorExists;
}

export function getDecoratorByName(node: ClassDeclaration, decoratorName: string): CallExpression | undefined {
  const decorators = getDecoratorsAsCallExpressions(node);
  return decorators.find((decorator) => {
    return (decorator.expression.getText() === decoratorName);
  });
}

export function getDecoratorsAsCallExpressions(node: ClassDeclaration): CallExpression[] {
  if (node.decorators) {
    return node.decorators
      .filter(({ expression }: Decorator) => isCallExpression(expression))
      .map(({ expression }: Decorator) => expression as CallExpression);
  }
  return [];
}

export function isCallExpression(expression: Expression): boolean{
  return expression.kind === SyntaxKind.CallExpression;
}
