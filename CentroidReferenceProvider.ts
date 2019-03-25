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
import * as vscode from "vscode";
import { getWordForPosition } from "../util";
/**
 * Handles finding occurrences of symbols in the document.
 *
 * @remarks Currently uses regular expressions, not real knowledge.
 */
export class CentroidReferenceProvider implements vscode.ReferenceProvider {
  provideReferences(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.ReferenceContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Location[]> {
    // This may take a while so use a promise.
    return new Promise(resolve => {
      // We use a simple regex to find the occurrences for now
      const wordToLookFor = getWordForPosition(document, position);
      if (!wordToLookFor) {
        resolve([]);
        return;
      }
      const docText = document.getText();
      const regexToUse = RegExp("\\b".concat(wordToLookFor, "\\b"), "g");
      const locationResults: vscode.Location[] = [];
      while (regexToUse.exec(docText) != null) {
        const resultPosition = document.positionAt(regexToUse.lastIndex);
        locationResults.push(new vscode.Location(document.uri, resultPosition));
      }
      resolve(locationResults);
    });
  }
}
