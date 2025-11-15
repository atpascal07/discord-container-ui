import { Item } from "./Item";
import { TextDisplay } from "./TextDisplay";
import { Section } from "./Section";
import { Separator, SeparatorSpacingSize } from "./Separator";
import { MediaGallery } from "./MediaGallery";
import { FileItem } from "./FileItem";

type ItemLike = Item | string | number;

export interface SerializedItem {
  type: "TextDisplay" | "Separator" | "Section" | "MediaGallery" | "FileItem";
  payload?: any;
  id?: number | null;
}

export interface SerializedContainer {
  type: "Container";
  id?: number | null;
  colour?: number | null;
  spoiler?: boolean;
  components: SerializedItem[];
}

export class Container extends Item {
  items: Item[] = [];
  colour: number | null = null;
  spoilerFlag: boolean = false;

  static __container_children_items__: Array<any> = []; // kept for API compatibility

  constructor(...items: ItemLike[]) {
    super();
    items.forEach(it => this.add_item(it));
  }

  get width(): number { return 5; }

  get spoiler(): boolean { return this.spoilerFlag; }
  set spoiler(v: boolean) { this.spoilerFlag = !!v; }

  add_item(item: ItemLike): this {
    let i: Item;
    if (typeof item === "string" || typeof item === "number") {
      i = new TextDisplay(String(item));
    } else {
      i = item;
    }
    i.parent = this;
    this.items.push(i);
    return this;
  }

  add_text(content: string, id?: number | null): TextDisplay {
    const t = new TextDisplay(content, id ?? undefined);
    this.add_item(t);
    return t;
  }

  add_separator(opts: { divider?: boolean; spacing?: SeparatorSpacingSize; id?: number | null } = {}): Separator {
    const s = new Separator(opts);
    this.add_item(s);
    return s;
  }

  add_gallery(...media: string[]): MediaGallery {
    const g = new MediaGallery(...media);
    this.add_item(g);
    return g;
  }

  add_file(url: string, spoiler=false, id?: number | null): FileItem {
    const f = new FileItem(url, spoiler, id ?? undefined);
    this.add_item(f);
    return f;
  }

  /** Depth-first walk of all items (flattened) */
  override walk_items(): Iterable<Item> {
    const out: Item[] = [];
    for (const it of this.items) {
      out.push(it);
      // Sections can contain items
      if (it instanceof Section) {
        for (const sub of it.items) out.push(sub);
      }
    }
    return out;
  }

  copy_text(): string {
    return this.items.map(i => i.copy_text()).filter(Boolean).join("\n");
  }

  toJSON(): SerializedContainer {
    const components: SerializedItem[] = this.items.map((i): SerializedItem => {
      if (i instanceof TextDisplay) {
        return { type: "TextDisplay", id: i.id ?? null, payload: { content: i.content } };
      } else if (i instanceof Separator) {
        return { type: "Separator", id: i.id ?? null, payload: { divider: i.divider, spacing: i.spacing } };
      } else if (i instanceof Section) {
        // serialize nested items of the section
        const nested = i.items.map((child) => {
          if (child instanceof TextDisplay) return { type: "TextDisplay", id: child.id ?? null, payload: { content: child.copy_text() } };
          if (child instanceof Separator) return { type: "Separator", id: child.id ?? null, payload: { divider: child.divider, spacing: child.spacing } };
          if (child instanceof MediaGallery) return { type: "MediaGallery", id: child.id ?? null, payload: { media: (child as MediaGallery).media } };
          if (child instanceof FileItem) return { type: "FileItem", id: child.id ?? null, payload: { url: (child as FileItem).url, spoiler: (child as FileItem).spoiler } };
          return { type: "TextDisplay", payload: { content: child.copy_text() } };
        });
        return { type: "Section", id: i.id ?? null, payload: { items: nested } };
      } else if (i instanceof MediaGallery) {
        return { type: "MediaGallery", id: i.id ?? null, payload: { media: (i as MediaGallery).media } };
      } else if (i instanceof FileItem) {
        return { type: "FileItem", id: i.id ?? null, payload: { url: (i as FileItem).url, spoiler: (i as FileItem).spoiler } };
      }
      return { type: "TextDisplay", payload: { content: i.copy_text() } };
    });

    return {
      type: "Container",
      id: this.id ?? null,
      colour: this.colour ?? null,
      spoiler: this.spoilerFlag,
      components
    };
  }

  static fromJSON(obj: SerializedContainer): Container {
    const c = new Container();
    if (obj.id !== undefined) c.id = obj.id ?? null;
    if (obj.components && Array.isArray(obj.components)) {
      for (const comp of obj.components) {
        switch (comp.type) {
          case "TextDisplay":
            c.add_text(String(comp?.payload?.content ?? ""));
            break;
          case "Separator":
            c.add_separator({
              divider: !!comp?.payload?.divider,
              spacing: comp?.payload?.spacing ?? SeparatorSpacingSize.medium,
              id: comp?.id ?? null
            });
            break;
          case "Section": {
            const s = new Section();
            const children = Array.isArray(comp?.payload?.items) ? comp.payload.items : [];
            for (const ch of children) {
              switch (ch.type) {
                case "TextDisplay": s.items.push(new TextDisplay(String(ch?.payload?.content ?? ""))); break;
                case "Separator": s.items.push(new Separator({ divider: !!ch?.payload?.divider, spacing: ch?.payload?.spacing })); break;
                case "MediaGallery": s.items.push(new MediaGallery(...(ch?.payload?.media ?? []))); break;
                case "FileItem": s.items.push(new FileItem(String(ch?.payload?.url ?? ""), !!ch?.payload?.spoiler)); break;
                default: s.items.push(new TextDisplay(""));
              }
            }
            c.add_item(s);
            break;
          }
          case "MediaGallery":
            c.add_gallery(...(comp?.payload?.media ?? []));
            break;
          case "FileItem":
            c.add_file(String(comp?.payload?.url ?? ""), !!comp?.payload?.spoiler);
            break;
          default:
            // ignore unknown
            break;
        }
      }
    }
    if (obj.colour !== undefined && obj.colour !== null) c.colour = obj.colour;
    if (obj.spoiler !== undefined) c.spoiler = !!obj.spoiler;
    return c;
  }
}
