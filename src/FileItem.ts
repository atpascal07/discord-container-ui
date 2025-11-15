import { Item } from "./Item";

export class FileItem extends Item {
  url: string;
  spoiler: boolean;
  constructor(url: string, spoiler=false, id?: number|null) {
    super();
    this.url = url;
    this.spoiler = spoiler;
    if (id !== undefined) this.id = id;
  }

  get width(): number { return 5; }

  copy_text(): string { return this.url; }
}
