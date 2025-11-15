import { Item } from "./Item";

export class TextDisplay extends Item {
  content: string;
  constructor(content: string, id?: number|null) {
    super();
    this.content = content ?? "";
    if (id !== undefined) this.id = id;
  }

  get width(): number { return 5; }

  copy_text(): string {
    return this.content;
  }
}
