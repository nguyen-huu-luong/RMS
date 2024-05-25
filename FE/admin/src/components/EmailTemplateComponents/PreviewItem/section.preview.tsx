import { useDrop } from "react-dnd";
import useEmailDataStore from "@/store/email";
import { useState } from "react";
import ColumnPreview from "./column.preview";
import SpacerPreview from "./spacer.preview";
import { getCamelCasedAttributes, objectToCSS } from "@/lib/utils/get-camel-cased-attr";
import ItemOnHover from "./ItemOnHover";
import { CSSProperties } from "styled-components";
import { Space } from "antd";

const defaultStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    // maxWidth: 600,
    minHeight: "200px",
    height: "auto",
};

interface ISectionPreview {
    section: any;
    index: number;
    path: string;
}

const hoverStyle = {
    "&:hover": {
        outline: "2px dashed black"
    }
};



const SectionPreview = ({ section, index, path }: ISectionPreview) => {
    const [isHovered, setIsHovered] = useState(false);
    const { activeNode, setActiveNode, pushTagElement } = useEmailDataStore();

    const activeSectionId = activeNode && activeNode["section"]?.id;
    const currentSectionId = section.id;
    const showControls = activeSectionId === currentSectionId;

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ["mj-column", "mj-spacer"],
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
    const objectCss = objectToCSS(getCamelCasedAttributes(section.attributes));

    const getBoxStyle = () => {
        const isActiveOver = isOver && canDrop;

        // For showing green border on success element hover
        if (isActiveOver) {
            const hoverCss = {
                outline: "4px solid #00AB55 !important"
            };

            return { ...defaultStyle, ...objectCss, ...hoverCss } as CSSProperties;
        }

        // For currently active node border color
        if (showControls) {
            const activeCss = {
                outline: "4px solid #1939B7"
            };

            return { ...defaultStyle, ...objectCss, ...activeCss };
        }

        // Default behaviour
        return { ...defaultStyle, ...objectCss, ...hoverStyle };
    };

    const hasChildren = section["children"];

    const loadHtmlElements = (pSection: any, nIndex: number) => {
        switch (pSection.tagName) {
            case "mj-column": {
                return (
                    <ColumnPreview
                        section={pSection}
                        index={index}
                        columnIndex={nIndex}
                        key={nIndex}
                        path={`${path}.children.${nIndex}`}
                    />
                );
            }

            case "mj-spacer": {
                return (
                    <SpacerPreview
                        section={pSection}
                        index={index}
                        key={nIndex}
                        path={`${path}.children.${nIndex}`}
                    />
                );
            }

            case "mj-carousel": {
                return (
                    <SpacerPreview
                        section={pSection}
                        index={index}
                        key={nIndex}
                        path={`${path}.children.${nIndex}`}
                    />
                );
            }

            default:
                break;
        }
    };

    const onMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        setIsHovered(true);
        event.stopPropagation();
    };

    const onMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
        setIsHovered(false);
        event.stopPropagation();
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();

        setActiveNode(null);
        setActiveNode({
            section,
            path,
            sectionIndex: index
        });
    };

    return (
        <div ref={drop} className="flex justify-center">
            <div
                style={{
                    ...getBoxStyle(),
                }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={handleClick}
                className="border border-dashed"
            >
                <div className="">
                    {hasChildren.length > 0 &&
                        hasChildren.map((tsection: any, tindex: number) => {
                            return loadHtmlElements(tsection, tindex);
                        })}
                </div>
                {hasChildren.length === 0 && (
                    <div className="flex-row justify-center align-center w-full">
                        <p>Drop Column here</p>
                    </div>
                )}
                {(isHovered || showControls) && (
                    <ItemOnHover section={section} path={path} />
                )}
            </div>
        </div>
    );
};

export default SectionPreview;
