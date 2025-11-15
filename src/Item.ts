export type ItemCallback = (parent: any, item: Item, ...args: any[]) => any;

export abstract class Item<V = any> {
  parent: any = null;
  id?: number | null = null;
  _view: V | null = null;
  callback: ItemCallback | null = null;

  constructor() {}

  abstract get width(): number;

  is_dispatchable(): boolean {
    return false;
  }

  is_persistent(): boolean {
    return true;
  }

  walk_items(): Iterable<Item> {
    return [this];
  }

  copy_text(): string {
    return "";
  }

  refresh_component(_comp: any): void {
    // no-op (placeholder for ports that parse components)
  }
}
