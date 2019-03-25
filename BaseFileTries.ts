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
import { Trie } from "tiny-trie";
import { BaseSymbolInfo } from "./BaseSymbolInfo";
import { normalizeSymbolName } from "../util";

export class BaseFileTries {
  protected allSymbols: Trie = new Trie();
  protected symbolMap: Map<string, BaseSymbolInfo> = new Map();
  /**
   * Return all symbols that are valid completions of prefix.
   *
   * @param prefix - prefix to get all completions for.
   */
  getAllCompletions(prefix: string): BaseSymbolInfo[] {
    const wordResults: string[] = <string[]>(
      this.allSymbols.search(normalizeSymbolName(prefix), { prefix: true })
    );
    return <BaseSymbolInfo[]>(
      wordResults.map(obj => this.getSymbol(obj)).filter(obj => obj)
    );
  }
  /**
   * Test whether we have any information about a named symbol.
   *
   * @param label - Symbol name to look for.
   * @returns Whether the symbol was found.  This will be true if we processed
   * the symbol, even if various forms of lookups may not find it due to type
   * not matching, etc.
   */
  contains(label: string): boolean {
    return this.allSymbols.test(normalizeSymbolName(label));
  }
  /**
   * Add a symbol to the symbol tries.
   *
   * This function takes care of adding the symbol to the relevant tries.
   * @param symbolInfo - Symbol to add to tries.
   */
  add(symbolInfo: BaseSymbolInfo) {
    const name = normalizeSymbolName(symbolInfo.label);
    this.allSymbols.insert(name);
    this.symbolMap.set(name, symbolInfo);
  }
  /**
   * Return information about a named symbol.
   *
   * @param label - Symbol name to look for.
   * @returns The found symbol or null.
   */
  getSymbol(label: string): BaseSymbolInfo | null {
    const res = this.symbolMap.get(normalizeSymbolName(label));
    return !res ? null : res;
  }
  /**
   * Freeze all the tries so no more insertion can take place,
   * and convert them into DAWGs
   */
  freeze() {
    this.allSymbols.freeze();
  }
}
