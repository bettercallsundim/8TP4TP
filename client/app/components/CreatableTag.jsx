import AsyncCreatableSelect from "react-select/async-creatable";
import { colourOptions } from "../data";

const filterColors = (inputValue) => {
  return colourOptions.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const promiseOptions = (inputValue) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(filterColors(inputValue));
    }, 1000);
  });

export default () => (
  <AsyncCreatableSelect
    cacheOptions
    defaultOptions
    loadOptions={promiseOptions}
  />
);
