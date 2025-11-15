import { Item } from "./Item";

export class Section extends Item {
  items: Item[] = [];
  accessory: Item | null = null;
  constructor(...items: Item[]) {
    super();
    this.items = items as Item[];
  }

  get width(): number { return 5; }

  walk_items(): Iterable<Item> {
    return this.items;
  }

  copy_text(): string {
    return this.items.map(i => i.copy_text()).join("\n");
  }
}
