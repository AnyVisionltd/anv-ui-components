import React, { useState } from 'react';
import RangeSlider from './';
import { centerDecorator } from '../../../utils/storybook/decorators';

export default {
  title: 'User Inputs/RangeSlider',
  component: RangeSlider,
  decorators: [centerDecorator],
};

export const Basic = () => {
  const [value1, setValue1] = useState(50);
  const [value2, setValue2] = useState(0.5);
  const [value3, setValue3] = useState(360);
  const [value4, setValue4] = useState(0.2);

  return (
    <>
      <RangeSlider
        min={0}
        max={100}
        value={value1}
        isDarkTheme
        onChange={e => setValue1(e.target.value)}
      />

      <RangeSlider
        min={0}
        max={1}
        value={value2}
        onChange={e => setValue2(e.target.value)}
      />

      <RangeSlider
        min={100}
        max={500}
        value={value3}
        onChange={e => setValue3(e.target.value)}
        disabled
      />

      <RangeSlider
        min={0}
        max={1}
        value={value4}
        onChange={e => setValue4(e.target.value)}
        isDarkTheme
        disabled
      />
    </>
  );
};
