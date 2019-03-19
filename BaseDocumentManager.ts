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

  init(context: vscode.ExtensionContext) {}
  constructor() {}
  // Normalize path of document filename
  protected normalizePathtoDoc(document: vscode.TextDocument) {
    return path.normalize(vscode.workspace.asRelativePath(document.fileName));
  }

  protected parseSymbolsUsingRegex(
    fileTries: BaseFileTries,
    document: vscode.TextDocument,
    regex: RegExp,
    callback: {
      (
        document: vscode.TextDocument,
        captures: RegExpExecArray
      ): BaseSymbolInfo | null;
    }
  ) {
    let text = document.getText();
    let captures: RegExpExecArray | null;
    while ((captures = regex.exec(text))) {
      let symbolInfo = callback(document, captures);
      if (!symbolInfo) continue;
      fileTries.add(symbolInfo);
    }
  }
  protected hasDocument(document: vscode.TextDocument) {
    let filename = this.normalizePathtoDoc(document);
    return this.tries.has(filename);
  }
  // Parse and add a document to our list of managed documents
  parseAndAddDocument(document: vscode.TextDocument) {
    let filename = this.normalizePathtoDoc(document);
    let fileTries = this.tries.get(filename);
    console.assert(
      fileTries !== undefined,
      "Somehow did not set filetrie properly"
    );
    if (fileTries === undefined) return;
    // Add system symbols.  In theory we should only do this once, but it takes
    // no appreciable time/memory anyway.
    for (var sym of this.systemSymbols) {
      fileTries.add(sym);
    }
  }

  resetDocument(document: vscode.TextDocument) {
    this.removeDocumentInternal(document);
    this.parseAndAddDocument(document);
  }
  removeDocument(document: vscode.TextDocument) {
    this.removeDocumentInternal(document);
  }
  protected removeDocumentInternal(document: vscode.TextDocument) {
    let filename = this.normalizePathtoDoc(document);
    this.tries.delete(filename);
  }
  getTriesForDocument(document: vscode.TextDocument) {
    let filename = this.normalizePathtoDoc(document);
    return this.tries.get(filename);
  }
}
