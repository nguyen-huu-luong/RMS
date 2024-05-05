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
    buttonIndex: number;
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
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    marginTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundPosition: "center center",
};

const ButtonPreview = ({ section, index, buttonIndex, path }: IButtonPreview) => {
    const [isHovered, setIsHovered] = useState(false);
    const { setActiveNode, activeNode } = useEmailDataStore();
    const objectCss = objectToCSS(getCamelCasedAttributes(section.attributes));
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        const activeNode = {
            section,
            path,
            buttonIndex,
            sectionIndex: index
        }
        setActiveNode(activeNode);
    };

    // console.log("objectCss", objectCss)

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

    // Hanlde padding  as offset  is mjml  different  from padding css when  button rendered
    const newObjCss = Object.keys(objectCss).reduce((acc: { [key: string]: string }, key: string) => {
        // console.log(key)
        const newKey = ["paddingLeft", "paddingRight", "paddingTop", "paddindBottom"].includes(key) ?
                                key.replace("padding", "margin") : key;
        acc[newKey] = objectCss[key];
        // console.log(newKey)
        return acc;
    }, {});

    // console.log(newObjCss)

    const allStyle: CSSProperties = {
        ...getStyle(),
        ...defaultStyle,
        ...newObjCss,
    };

    // console.log(allStyle)

    return (
        <div style={{ textAlign: objectCss["textAlign"] as any }}>
            <div
                style={{ ...allStyle, display: "inline-flex" }}
                className="relative inline-flex items-center"
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
