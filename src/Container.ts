import { EmbedBuilder } from "discord.js";

export interface ContainerBlock {
  type: "text" | "separator" | "header";
  content?: string;
}

export class Container {
  private blocks: ContainerBlock[] = [];
  private title: string | null = null;
  private icon: string | null = null;

  setTitle(title: string) {
    this.title = title;
    return this;
  }

  setIcon(icon: string) {
    this.icon = icon;
    return this;
  }

  addText(text: string) {
    this.blocks.push({ type: "text", content: text });
    return this;
  }

  addHeader(text: string) {
    this.blocks.push({ type: "header", content: text });
    return this;
  }

  addSeparator() {
    this.blocks.push({ type: "separator" });
    return this;
  }

  render() {
    let description = "";

    if (this.title) {
      description += `## ${this.icon ? this.icon + " " : ""}${this.title}\n\n`;
    }

    for (const block of this.blocks) {
      switch (block.type) {
        case "header":
          description += `### ${block.content}\n\n`;
          break;
        case "text":
          description += `${block.content}\n\n`;
          break;
        case "separator":
          description += `\`\`\`────────────────────────────\`\`\`\n`;
          break;
      }
    }

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setDescription(description.trim());

    return { embeds: [embed] };
  }
}
