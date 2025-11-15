import { Container } from "./Container";

const c = new Container();
c.add_text("Hello world");
c.add_separator();
c.add_text("Another line");
console.log(JSON.stringify(c.toJSON(), null, 2));
