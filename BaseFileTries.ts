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
    let wordResults: string[] = <string[]>(
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
    let name = normalizeSymbolName(symbolInfo.label);
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
    let res = this.symbolMap.get(normalizeSymbolName(label));
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
