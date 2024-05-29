import React, { useState } from "react";
import {
  getCamelCasedAttributes,
  objectToCSS
} from "@/lib/utils/get-camel-cased-attr";
import useEmailStore from "@/store/email";
import { CSSProperties } from "styled-components";
import HoverInfo from "./ItemOnHover";
import TextEditor from "@/components/EmailTextEditor/TextEditor";
import TestTextEditor from "../RightSidebar/TextAttributes/TestTextEditor";

interface ITextPreview {
  section: any;
  index: number;
  textIndex?: number;
  path: string;
}

const hoverStyle = {
};

const defaultStyle = {
  position: "relative"
};

const TextPreview = ({ section, index, textIndex, path }: ITextPreview) => {
  const [isHovered, setIsHovered] = useState(false);
  const { setActiveNode, activeNode } = useEmailStore();
  const objectCss = objectToCSS(getCamelCasedAttributes(section.attributes));
  const [textValue, setTextValue] = useState(section.content)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    const activeNode = {
      sectionIndex: index,
      section,
      path
    };

    setActiveNode(activeNode);
  };

  const activeSectionId = activeNode && activeNode["section"]?.id;
  const currentSectionId = section.id;
  const showControls = activeSectionId === currentSectionId;

  const getStyle = () => {
    if (showControls) {
      const activeCss = {
        outline: "4px solid #1939B7"
      };

      return { ...defaultStyle, ...objectCss, ...activeCss } as CSSProperties;
    }

    return { ...defaultStyle, ...objectCss, ...hoverStyle } as CSSProperties;
  };


  return (
    <div
      onMouseEnter={() => setIsHovered(false)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ ...getStyle() }}
      className="w-full"
    >
      {/* <textarea style={{width: "100%"}} value={textValue} onChange={handleTextChange} /> */}
      <div className="w-full">
        {
          // !showControls ?
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
            // :
            // <TestTextEditor content={section.content}/>
        }
      </div>

      {(isHovered || showControls) && (
        <HoverInfo section={section} path={path} />
      )}
    </div>
  );
};
export default TextPreview;
