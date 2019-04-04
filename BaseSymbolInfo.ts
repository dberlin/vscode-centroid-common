/*
 * MIT License
 *
 * Copyright (c) 2019 Daniel Berlin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import * as vscode from "vscode";

export class BaseSymbolInfo extends vscode.CompletionItem {
  /* If this is a constant symbol, what is the value. */
  public symbolValue: number;
  /* What offset in the file did the symbol appear at. */
  public symbolDeclPos: number;
  /* What offset in the file did the symbol get defined at. */
  public symbolDefPos: number;
  /* What offset in the file did the symbol end at (for stages). */
  public symbolDefEndPos: number;
  constructor(
    name: string,
    kind: vscode.CompletionItemKind,
    documentation: string,
    detail: string,
    sortText: string,
    value: number,
    declPos: number,
  ) {
    super(name, kind);
    this.symbolValue = value;
    this.symbolDeclPos = declPos;
    this.documentation = new vscode.MarkdownString(documentation);
    this.detail = detail;
    this.sortText = sortText;
    this.symbolDefPos = -1;
    this.symbolDefEndPos = -1;
  }
}
