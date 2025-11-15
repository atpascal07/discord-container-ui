export type ItemCallback = (parent: any, item: Item, ...args: any[]) => any;

/** Base class for all UI items */
export abstract class Item<V = any> {
  /** Parent container/section */
  parent: any = null;
  /** Optional numeric id to correlate interactions */
  id?: number | null = null;
  /** Optional view state – consumers can use this to attach view specific data */
  protected _view: V | null = null;
  /** Optional callback (e.g. for interactive usage in higher layers) */
  callback: ItemCallback | null = null;

  constructor() {}

  /** Logical width in "columns" – consumers can use this for layout decisions */
  abstract get width(): number;

  /** Whether this item can dispatch events (no-op in this lightweight port) */
  is_dispatchable(): boolean {
    return false;
  }

  set view(v: V | null) { this._view = v; }
  get view(): V | null { return this._view; }

  /** Iterate (depth-1) over contained items; default returns just this item */
  walk_items(): Iterable<Item> {
    return [this];
  }

  /** Plain text representation (used by Container.copy_text) */
  copy_text(): string {
    return "";
  }

  /** Hook to update a (external) component representation */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refresh_component(_comp: any): void {
    // no-op (placeholder for ports that parse components)
  }
}
