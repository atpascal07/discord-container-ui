# discord-container-ui

Ein UI-Toolkit, das den **python-discord Container** in Discord.js/TypeScript nachbildet.

## Installation

```
npm install discord-container-ui
```

## Nutzung

```ts
import { Container } from "discord-container-ui";

const c = new Container()
  .setTitle("Fehler beim Löschen alter DMs")
  .setIcon("⚠️")
  .addText("2055: Lost connection to MySQL server at 'panel.shadowra.de:3306'")
  .addSeparator()
  .addText("system error: 32 Broken pipe");

channel.send(c.render());
```


