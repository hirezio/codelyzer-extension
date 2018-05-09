import { RuleFailure, Rules, RuleWalker } from 'tslint';
import {
  CallExpression, ClassDeclaration, Decorator, ImportDeclaration,
  PropertyAssignment, PropertyDeclaration, SourceFile, SyntaxKind,
} from 'typescript';
import { hasDecorator } from './utils';

export class Rule extends Rules.AbstractRule {

  public static FAILURE_STRING = 'Objects with the @Stateless() decorator cannot have properties';

  public apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(new StatelessWalker(sourceFile, this.getOptions()));
  }
}

class StatelessWalker extends RuleWalker {

  private isStateless: boolean = false;

  protected visitClassDeclaration(node: ClassDeclaration): void {
    this.isStateless = hasDecorator(node, 'Stateless');
    super.visitClassDeclaration(node);
  }

  protected visitPropertyDeclaration(node: PropertyDeclaration): void {

    if (this.isStateless) {
      this.addFailure(this.createFailure(node.name.getStart(), node.name.getWidth(), Rule.FAILURE_STRING));
    }
    super.visitPropertyDeclaration(node);
  }

}
