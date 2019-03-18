import * as vscode from "vscode";

export class BaseSymbolInfo<T> extends vscode.CompletionItem {
  /* If this is a constant symbol, what is the value. */
  symbolValue: number;
  /* What offset in the file did the symbol appear at. */
  symbolDeclPos: number;
  /* What offset in the file did the symbol get defined at. */
  symbolDefPos: number;
  /* What offset in the file did the symbol end at (for stages). */
  symbolDefEndPos: number;
  /* What is the type of this symbol */
  symbolType: T;
  constructor(
    name: string,
    type: T,
    kind: vscode.CompletionItemKind,
    documentation: string,
    detail: string,
    sortText: string,
    value: number,
    declPos: number
  ) {
    super(name, kind);
    this.symbolValue = value;
    this.symbolDeclPos = declPos;
    this.documentation = new vscode.MarkdownString(documentation);
    this.detail = detail;
    this.sortText = sortText;
    this.symbolDefPos = -1;
    this.symbolDefEndPos = -1;
    this.symbolType = type;
  }
}
