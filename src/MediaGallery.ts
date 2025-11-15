import { Item } from "./Item";

export class MediaGallery extends Item {
  media: string[] = [];
  constructor(...media: string[]) {
    super();
    this.media = media || [];
  }

  get width(): number { return 5; }

  copy_text(): string { return this.media.join("\n"); }
}
