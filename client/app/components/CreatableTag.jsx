"use client";
import React from "react";

import CreatableSelect from "react-select/creatable";

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

export default function CreatableTag({ tags, setTags }) {
  const [inputValue, setInputValue] = React.useState("");

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setTags((prev) => [...prev, createOption(inputValue)]);
        setInputValue("");
        event.preventDefault();
    }
  };
  const handleKeyDown2 = (event) => {
    if (!inputValue) return;

    setTags((prev) => [...prev, createOption(inputValue)]);
    setInputValue("");
    event.preventDefault();
  };

  return (
    <CreatableSelect
      components={components}
      inputValue={inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={(newValue) => setTags(newValue)}
      onBlur={handleKeyDown2}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder="Type a tag and press enter..."
      value={tags}
    />
  );
}
