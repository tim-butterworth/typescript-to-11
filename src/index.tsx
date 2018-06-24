import * as React from "react";
import { render } from "react-dom";
import { someExamples } from "./someexamples";

someExamples();

render(
    <div>
        Check someexamples.ts for typescript examples
    </div>,
    document.getElementById("app"),
);
