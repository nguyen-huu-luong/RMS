import { useDrop } from "react-dnd";
import React, { useState } from "react";

import {
    getCamelCasedAttributes,
    objectToCSS
} from "@/lib/utils/get-camel-cased-attr";
import ItemOnhover from "./ItemOnHover";
import useEmailDataStore from "@/store/email";
import TextPreview from "./text.preview";
import { CSSProperties } from "styled-components";
import ButtonPreview from "./button.preview";

interface ITextPreview {
    section: any;
    index: number;
    columnIndex: number;
    path: string;
}

const defaultStyle: CSSProperties = {
    minHeight: "150px",
    height: "auto",
    outline: "2px dashed black",
    position: "relative",
    margin: 16,
    padding: 16
};

const hoverStyle = {
    "&:hover": {
        outline: "2px dashed black"
    }
};

const ColumnPreview = ({ section, index, columnIndex, path }: ITextPreview) => {
    const [isHovered, setIsHovered] = useState(false);

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ["mj-image", "mj-text", "mj-button"],
        drop: (item: any, monitor) => {
            if (!monitor.didDrop()) {
                const nestedPath = `${path}.children`;

                pushTagElement(item["type"], nestedPath);
            }
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));

    const hasChildren = section["children"];
    const objectCss = objectToCSS(getCamelCasedAttributes(section.attributes));
    const { activeNode, setActiveNode, pushTagElement } = useEmailDataStore();

    const activeSectionId = activeNode && activeNode["section"]?.id;
    const currentSectionId = section.id;
    const showControls = activeSectionId === currentSectionId;

    const loadHtmlElements = (pSection: any, tindex: number) => {
        switch (pSection.tagName) {
            case "mj-text": {
                return (
                    <TextPreview
                        section={pSection}
                        index={index}
                        textIndex={tindex}
                        key={tindex}
                        path={`${path}.children.${tindex}`}
                    />
                );
            }
            
            case "mj-button": {
                return (
                    <ButtonPreview
                        section={pSection}
                        index={index}
                        key={tindex}
                        path={`${path}.children.${tindex}`}
                    />
                );
            }

            default:
                break;
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        setActiveNode(null);
        setActiveNode({
            section,
            path,
            sectionIndex: index
        });
    };

    const getBoxStyle = () => {
        const isActiveOver = isOver && canDrop;

        // For showing green border on success element hover
        if (isActiveOver) {
            const hoverCss = {
                outline: "4px solid #00AB55 !important"
            };

            return { ...defaultStyle, ...objectCss, ...hoverCss };
        }

        // For currently active node border color
        if (showControls) {
            const activeCss = {
                outline: "4px solid #1939B7"
            };

            return { ...defaultStyle, ...objectCss, ...activeCss };
        }

        // Default behaviour
        return { ...defaultStyle, ...objectCss, ...hoverStyle } as CSSProperties;
    };

    const onMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        setIsHovered(true);
        event.stopPropagation();
    };

    const onMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
        setIsHovered(false);
        event.stopPropagation();
    };

    return (
        <div className="flex-1" ref={drop}>
            <div
                style={{
                    ...getBoxStyle()
                }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={handleClick}
            >
                {hasChildren.length > 0 &&
                    hasChildren.map((tsection: any, tindex: any) => {
                        return loadHtmlElements(tsection, tindex);
                    })}
                {(isHovered || showControls) && (
                    <ItemOnhover section={section} path={path} />
                )}
            </div>
        </div>
    );
};

export default ColumnPreview;
