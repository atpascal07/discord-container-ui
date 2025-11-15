import { Item } from "./Item";
import { TextDisplay } from "./TextDisplay";
import { Section } from "./Section";
import { Separator, SeparatorSpacingSize } from "./Separator";
import { MediaGallery } from "./MediaGallery";
import { FileItem } from "./FileItem";

type ItemLike = Item | string | number;

export class Container extends Item {
  items: Item[] = [];
  colour: number | null = null;
  spoilerFlag: boolean = false;
  containerId: number | null = null;

  static __container_children_items__: Array<any> = [];

  constructor(...items: Item[]) {
    super();
    for (const i of items) {
      this.add_item(i);
    }
  }

  get width(): number { return 5; }

  is_dispatchable(): boolean {
    return this.items.some(i => i.is_dispatchable());
  }

  is_persistent(): boolean {
    return this.items.every(i => i.is_persistent());
  }

  add_item(item: Item): this {
    if (!(item instanceof Item)) {
      throw new TypeError(`expected Item not ${typeof item}`);
    }
    item.parent = this;
    // assign view if exists
    if ((item as any).items) {
      (item as any).view = (this as any);
    }
    this.items.push(item);
    return this;
  }

  remove_item(item: Item | string | number): this {
    if (typeof item === "string" || typeof item === "number") {
      const found = this.get_item(item);
      if (found) {
        this.items = this.items.filter(x => x !== found);
      }
    } else {
      this.items = this.items.filter(x => x !== item);
    }
    return this;
  }

  get_item(id: string | number): Item | null {
    if (!id) return null;
    const attr = (typeof id === "number") ? "id" : "custom_id";
    let child = this.items.find(i => (i as any)[attr] === id);
    if (!child) {
      for (const i of this.items) {
        if (typeof (i as any).get_item === "function") {
          const c = (i as any).get_item(id);
          if (c) return c;
        }
      }
    }
    return child ?? null;
  }

  add_section(...items: Item[]): this {
    const accessory = items.pop() as any;
    const section = new Section(...items as Item[]);
    section.accessory = accessory ?? null;
    return this.add_item(section);
  }

  add_text(content: string, id?: number|null): this {
    const t = new TextDisplay(content, id ?? undefined);
    return this.add_item(t);
  }

  add_gallery(...items: string[]): this {
    const g = new MediaGallery(...items);
    return this.add_item(g);
  }

  add_file(url: string, spoiler=false, id?: number|null): this {
    const f = new FileItem(url, spoiler, id ?? undefined);
    return this.add_item(f);
  }

  add_separator(opts: {divider?: boolean, spacing?: SeparatorSpacingSize, id?: number|null} = {}): this {
    const s = new Separator(opts);
    return this.add_item(s);
  }

  copy_text(): string {
    return this.items.map(i => i.copy_text()).filter(Boolean).join("\n");
  }

  get spoiler(): boolean { return this.spoilerFlag; }
  set spoiler(v: boolean) { this.spoilerFlag = v; }

  get color(): number | null { return this.colour; }
  set color(v: number | null) { this.colour = v; }

  set view(value: any) {
    this._view = value;
    for (const item of this.items) {
      item.parent = this;
      item._view = value;
      if ((item as any).items) {
        (item as any).view = value;
      }
    }
  }

  refresh_component(component: any): void {
    // no-op in this port; placeholder to match API
    // Would map underlying component payload to items
  }

  disable_all_items(exclusions: Item[] | null = null): this {
    for (const item of this.walk_items()) {
      if ((item as any).disabled !== undefined && (!exclusions || !exclusions.includes(item))) {
        (item as any).disabled = true;
      }
    }
    return this;
  }

  enable_all_items(exclusions: Item[] | null = null): this {
    for (const item of this.walk_items()) {
      if ((item as any).disabled !== undefined && (!exclusions || !exclusions.includes(item))) {
        (item as any).disabled = false;
      }
    }
    return this;
  }

  *walk_items(): IterableIterator<Item> {
    for (const item of this.items) {
      if (typeof (item as any).walk_items === "function") {
        yield* (item as any).walk_items();
      } else {
        yield item;
      }
    }
  }

  toJSON(): any {
    // Lightweight representation - keep structure and types for potential mapping
    return {
      type: "container",
      id: this.containerId,
      colour: this.colour,
      spoiler: this.spoilerFlag,
      components: this.items.map(i => {
        return { _type: (i as any).constructor?.name || "Item", payload: (i as any) };
      })
    };
  }

  static fromJSON(obj: any): Container {
    const c = new Container();
    if (obj?.components && Array.isArray(obj.components)) {
      for (const comp of obj.components) {
        // naive mapping by constructor name
        const name = comp._type;
        switch (name) {
          case "TextDisplay": c.add_text(comp.payload.content); break;
          case "Separator": c.add_separator(); break;
          case "Section": c.add_item(new Section()); break;
          case "MediaGallery": c.add_gallery(...(comp.payload.media||[])); break;
          case "FileItem": c.add_file(comp.payload.url, !!comp.payload.spoiler); break;
          default: break;
        }
      }
    }
    if (obj.colour) c.colour = obj.colour;
    if (obj.spoiler) c.spoiler = !!obj.spoiler;
    return c;
  }
}
