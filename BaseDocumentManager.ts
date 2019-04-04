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
"use strict";
import * as path from "path";
import * as vscode from "vscode";
import { BaseFileTries } from "./BaseFileTries";
import { BaseSymbolInfo } from "./BaseSymbolInfo";

// This is the format the JSON files have
interface JSONSymbol {
  kind: string;
  detail: string;
  documentation: string;
  sortText: string;
  name: string;
}

/**
 * Main class handling managing open VSCode documents and associated symbols.
 */
export class BaseDocumentSymbolManagerClass {
  protected tries: Map<string, BaseFileTries> = new Map<
    string,
    BaseFileTries
  >();
  protected systemSymbols: BaseSymbolInfo[] = [];
  // tslint:disable: no-empty
  constructor() {}

  public init(context: vscode.ExtensionContext) {}
  // Parse and add a document to our list of managed documents
  public parseAndAddDocument(document: vscode.TextDocument) {
    const filename = this.normalizePathtoDoc(document);
    const fileTries = this.tries.get(filename);
    console.assert(
      fileTries !== undefined,
      "Somehow did not set filetrie properly",
    );
    if (fileTries === undefined) {
      return;
    }
    // Add system symbols.  In theory we should only do this once, but it takes
    // no appreciable time/memory anyway.
    for (const sym of this.systemSymbols) {
      fileTries.add(sym);
    }
  }

  public resetDocument(document: vscode.TextDocument) {
    this.removeDocumentInternal(document);
    this.parseAndAddDocument(document);
  }
  public removeDocument(document: vscode.TextDocument) {
    this.removeDocumentInternal(document);
  }
  public getTriesForDocument(document: vscode.TextDocument) {
    const filename = this.normalizePathtoDoc(document);
    return this.tries.get(filename);
  }
  // Normalize path of document filename
  protected normalizePathtoDoc(document: vscode.TextDocument) {
    return path.normalize(vscode.workspace.asRelativePath(document.fileName));
  }

  protected parseSymbolsUsingRegex(
    fileTries: BaseFileTries,
    document: vscode.TextDocument,
    regex: RegExp,
    callback: (
      document: vscode.TextDocument,
      captures: RegExpExecArray,
    ) => BaseSymbolInfo | null,
  ) {
    const text = document.getText();
    let captures: RegExpExecArray | null;
    while ((captures = regex.exec(text))) {
      const symbolInfo = callback(document, captures);
      if (!symbolInfo) {
        continue;
      }
      fileTries.add(symbolInfo);
    }
  }
  protected hasDocument(document: vscode.TextDocument) {
    const filename = this.normalizePathtoDoc(document);
    return this.tries.has(filename);
  }
  protected removeDocumentInternal(document: vscode.TextDocument) {
    const filename = this.normalizePathtoDoc(document);
    this.tries.delete(filename);
  }
}
