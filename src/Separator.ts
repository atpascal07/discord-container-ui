import { Item } from "./Item";

export enum SeparatorSpacingSize { small = "small", medium = "medium", large = "large" }

export class Separator extends Item {
  divider: boolean;
  spacing: SeparatorSpacingSize;
  constructor({divider=true, spacing=SeparatorSpacingSize.small, id}: {divider?: boolean, spacing?: SeparatorSpacingSize, id?: number|null} = {}) {
    super();
    this.divider = divider;
    this.spacing = spacing;
    if (id !== undefined) this.id = id;
  }

  get width(): number { return 5; }

  copy_text(): string { return this.divider ? "---" : ""; }
}
