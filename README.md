# discord-container-ui

Leichte **Container‑UI** als TypeScript‑Bibliothek – kompatibel mit **JS** und **TS**.  
Beinhaltet folgende Elemente:

- `Container` (Wurzel/Composer)
- `TextDisplay` (einfacher Textblock)
- `Section` (Gruppe von Items)
- `Separator` (Trennlinie/Spacing)
- `MediaGallery` (Sammlung von Bild/Medien‑URLs)
- `FileItem` (beliebige Datei‑URL; optional als Spoiler)

> ✅ **Dual Build (ESM & CJS)** – funktioniert out‑of‑the‑box mit modernen Bundlern sowie mit `require()` in Node.

---

## Installation

```bash
npm install discord-container-ui
# oder im Repo:
npm install
npm run build
```

> Das Build erzeugt `dist/index.mjs` (ESM), `dist/index.cjs` (CJS) sowie Typdefinitionen.

## Schnellstart

### JavaScript (CJS)

```js
// Node CommonJS
const { Container } = require("discord-container-ui");

const c = new Container()
  .add_text("Hello world")
  .add_separator()
  .add_text("Another line");

console.log(JSON.stringify(c.toJSON(), null, 2));
```

### JavaScript (ESM) / TypeScript

```ts
import { Container } from "discord-container-ui";

const c = new Container();
c.add_text("Hello world");
c.add_separator();
c.add_text("Another line");

console.log(c.copy_text());      // "Hello world\n---\nAnother line"
console.log(c.toJSON());
```

## API (Kurzüberblick)

### `class Container`

- `add_item(item: Item | string | number): this`
- `add_text(content: string, id?: number | null): TextDisplay`
- `add_separator(opts?: { divider?: boolean; spacing?: SeparatorSpacingSize; id?: number|null }): Separator`
- `add_gallery(...media: string[]): MediaGallery`
- `add_file(url: string, spoiler?: boolean, id?: number|null): FileItem`
- `walk_items(): Iterable<Item>` – flache Iteration inkl. Items in `Section`
- `copy_text(): string`
- `toJSON(): SerializedContainer`
- `static fromJSON(obj: SerializedContainer): Container`

### `class TextDisplay`

- `content: string`
- `copy_text(): string`

### `class Section`

- `items: Item[]`
- `copy_text(): string` – verkettet Inhalte der enthaltenen Items

### `class Separator`

- `divider: boolean` (Standard: `true`)
- `spacing: "small" | "medium" | "large"` (Standard: `"medium"`)

### `class MediaGallery`

- `media: string[]` (URLs)

### `class FileItem`

- `url: string`
- `spoiler: boolean`

## Serialisierung

Die Container können verlustarm in ein neutrales JSON‑Format konvertiert werden:

```ts
type SerializedItem =
  | { type: "TextDisplay"; id?: number|null; payload: { content: string } }
  | { type: "Separator";  id?: number|null; payload: { divider: boolean; spacing: "small"|"medium"|"large" } }
  | { type: "Section";    id?: number|null; payload: { items: SerializedItem[] } }
  | { type: "MediaGallery"; id?: number|null; payload: { media: string[] } }
  | { type: "FileItem";   id?: number|null; payload: { url: string; spoiler?: boolean } };

type SerializedContainer = {
  type: "Container";
  id?: number|null;
  colour?: number|null;
  spoiler?: boolean;
  components: SerializedItem[];
};
```

- `toJSON()` erzeugt `SerializedContainer`.
- `Container.fromJSON()` baut eine Instanz daraus wieder auf.

## Entwickeln

- `npm run dev` – Watch‑Build mit tsup
- `npm run typecheck` – TypeScript‑Typprüfung
- `npm run build` – ESM & CJS Output inkl. Typen

## Lizenz

MIT – siehe [LICENSE](./LICENSE).
