import { render } from "preact";
import Generator from "./app";

render(<Generator />, document.querySelector("main") as HTMLElement);
