import React from "react";
import { addDecorator } from "@storybook/react"

import "./index.scss"

const storyWrapper = (story) => (
  <div className={"story-wrapper"}>{story()}</div>
)

addDecorator(storyWrapper);
