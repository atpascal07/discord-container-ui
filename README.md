# Discord Container UI

**Discord Container UI** ist ein TypeScript/NPM-Paket für **discord.js v14**, das die **Container-API von `discord.py` 1:1** nachbildet.
Es ermöglicht das einfache Erstellen von **Container-Views, Textanzeigen, Sections, Separatoren, Galerien und Dateien**, so wie man es aus Python kennt.

---

## 📦 Installation

```bash
npm install discord-container-ui
```

oder mit Yarn:

```bash
yarn add discord-container-ui
```

---

## ⚡ Features

* **Container** – Hauptklasse für UI-Komponenten.
* **Item** – Basis aller UI-Elemente.
* **TextDisplay** – Anzeige von Text.
* **Section** – Gruppierung von Items mit optionalem Accessory.
* **Separator** – Trenner mit verschiedenen Größen.
* **MediaGallery** – Anzeige mehrerer Medieninhalte.
* **FileItem** – Einbinden von Dateien/Attachments.
* **1:1 API kompatibel mit Python `discord.py` Container**.

---

## 🛠️ Nutzung

```ts
import { Container, TextDisplay, Section, Separator, FileItem, MediaGallery } from "discord-container-ui";

// Einen Container erstellen
const container = new Container();

// Text hinzufügen
container.add_text("Hello World");

// Separator hinzufügen
container.add_separator();

// Section mit Accessory hinzufügen
container.add_section(
  new TextDisplay("Inside Section"),
  { accessory: new TextDisplay("Accessory") }
);

// Galerie hinzufügen
container.add_gallery("image1.png", "image2.png");

// Datei hinzufügen
container.add_file("attachment://example.png");

// Alle Texte kopieren
console.log(container.copy_text());
```

---

## 🌐 Exports

```ts
import { Container } from "discord-container-ui";
import { Item } from "discord-container-ui/Item";
import { TextDisplay } from "discord-container-ui/TextDisplay";
import { Section } from "discord-container-ui/Section";
import { Separator } from "discord-container-ui/Separator";
import { FileItem } from "discord-container-ui/FileItem";
import { MediaGallery } from "discord-container-ui/MediaGallery";
```

---

## 🎨 Eigenschaften

* `Container.items` – Liste aller Items im Container.
* `Container.add_item(item)` – Item hinzufügen.
* `Container.add_text(content)` – TextDisplay hinzufügen.
* `Container.add_separator()` – Separator hinzufügen.
* `Container.add_section(...items)` – Section hinzufügen.
* `Container.add_gallery(...urls)` – MediaGallery hinzufügen.
* `Container.add_file(url)` – FileItem hinzufügen.
* `Container.copy_text()` – Gibt alle TextDisplay Inhalte zurück.
* `Container.disable_all_items(exclusions?)` – Deaktiviert Buttons / Selects.
* `Container.enable_all_items(exclusions?)` – Aktiviert Buttons / Selects.
* `Container.walk_items()` – Iterator über alle Items.

---

## ⚙️ Build / Entwicklung

```bash
# Dependencies installieren
npm install

# Build
npm run build

# Development (watch mode)
npm run dev
```

---

## 🔗 Repository

[GitHub – Inn-Studios/DiscordContainerUI](https://github.com/Inn-Studios/DiscordContainerUI)

---

## 💡 Hinweis

* Dieses Paket ist **API-kompatibel mit Python `discord.py` Container**.
* Fokus liegt auf **leichter Portierung bestehender Python-Logik nach Discord.js**.
* Komponenten wie Buttons oder Selects müssen selbst angepasst werden, wenn Discord.js Interactivity benötigt wird.

---

## ⚖️ Lizenz

MIT © @pascal07_2025
