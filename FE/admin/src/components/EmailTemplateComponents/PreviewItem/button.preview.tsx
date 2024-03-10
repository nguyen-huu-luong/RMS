import React, { useState } from "react";
import useEmailDataStore from "@/store/email";

import {
    getCamelCasedAttributes,
    objectToCSS
} from "@/lib/utils/get-camel-cased-attr";
import ItemOnhover from "./ItemOnHover";
import { CSSProperties } from "styled-components";

interface IButtonPreview {
    section: any;
    index: number;
    path: string;
}

const hoverStyle = {
    "&:hover": {
        outline: "2px dashed white",
        outlineOffset: "2px"
    }
};

const defaultStyle: CSSProperties = {
    display: "inline-block",
    backgroundColor: "#414141",
    color: "#ffffff",
    fontFamily: "Ubuntu, Helvetica, Arial, sans-serif",
    fontSize: "13px",
    fontWeight: "normal",
    lineHeight: "120%",
    textDecoration: "none",
    textTransform: "none",
    margin: "10px 25px",
    padding: "10px 25px",
    backgroundPosition: "center center"
};

const ButtonPreview = ({ section, index, path }: IButtonPreview) => {
    const [isHovered, setIsHovered] = useState(false);
    const { setActiveNode, activeNode } = useEmailDataStore();
    const objectCss = objectToCSS(getCamelCasedAttributes(section.attributes));
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        setActiveNode({
            section,
            path,
            sectionIndex: index
        });
    };

    console.log("objectCss", objectCss)

    const activeSectionId = activeNode && activeNode["section"]?.id;
    const currentSectionId = section.id;
    const showControls = activeSectionId === currentSectionId;

    const getStyle = () => {
        if (showControls) {
            const activeCss = {
                outline: "4px solid #1939B7"
            };

            return { ...activeCss };
        }

        return { ...hoverStyle };
    };

    const allStyle: CSSProperties = {
        ...getStyle(),
        ...defaultStyle,
        ...objectCss,
    };

    console.log(allStyle)

    return (
       <div style={{textAlign: objectCss["textAlign"] as any}}>
            <div
                style={{ ...allStyle }}
                className="relative"
                
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
            >
                {section.content}
                {(isHovered || showControls) && (
                    <ItemOnhover section={section} path={path} />
                )}
            </div>
       </div>
    );
};
export default ButtonPreview;
