import React from "react";
import { addDecorator } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";

import "./index.scss";

const storyWrapper = (story) => (
  <div className={"story-wrapper"}>{story()}</div>
);

addDecorator(
  withInfo({
    inline: true,
    header: false,
    source: true,
    maxPropsIntoLine: 1,
  })
);

addDecorator(storyWrapper);
