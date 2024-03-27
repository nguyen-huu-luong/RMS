import React, { useState } from "react";
import useEmailDataStore from "@/store/email";

import {
  getCamelCasedAttributes,
  objectToCSS
} from "@/lib/utils/get-camel-cased-attr"

interface IButtonPreview {
  section: any;
  index: number;
  path: string;
}

const defaultStyle = {
  "&:hover": {
    outline: "2px dashed white",
    outlineOffset: "2px"
  }
};

const activeStyle = {
  ...defaultStyle,
  outline: "2px solid white",
  outlineOffset: "2px"
};

const SpacerPreview = ({ section, index, path }: IButtonPreview) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { setActiveNode } = useEmailDataStore();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setActiveNode({
      section,
      path,
      sectionIndex: index
    });
    setIsActive(true);
  };

  return (
    <div className="text-center">
      <div
        id="spacer"
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        style={{
          ...(isActive ? activeStyle : defaultStyle),
          ...objectToCSS(getCamelCasedAttributes(section.attributes)) as any
        }}
      ></div>
    </div>
  );
};
export default SpacerPreview;
