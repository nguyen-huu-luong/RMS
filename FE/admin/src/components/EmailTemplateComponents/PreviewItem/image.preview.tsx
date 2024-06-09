import useEmailStore from "@/store/email";
import { Image } from "antd";
import ItemOnHover from "./ItemOnHover";
import { useState } from "react";
import { CSSProperties } from "styled-components";
import { getCamelCasedAttributes, objectToCSS } from "@/lib/utils/get-camel-cased-attr";

interface IImagePreview {
    section: any;
    index: number;
    imageIndex: number;
    columnIndex: number;
    path: string;
}

const ImagePreview = ({
    section,
    index,
    imageIndex,
    columnIndex,
    path
}: IImagePreview) => {
    const { setActiveNode, activeNode } = useEmailStore();
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        const activeNode = {
            sectionIndex: index,
            imageIndex,
            columnIndex,
            section,
            path
        };

        setActiveNode(activeNode);
    };

    const activeSectionId = activeNode && activeNode["section"]?.id;
    const currentSectionId = section.id;
    const showControls = activeSectionId === currentSectionId;


    const hoverStyle = {
        outline: "none",
        "&:hover": {
            outline: "2px dashed white",
            outlineOffset: "2px"
        }
    };

    const getStyle = () => {
        if (showControls) {
            const activeCss = {
                outline: "4px solid #1939B7"
            };

            return { ...activeCss };
        }

        return { ...hoverStyle };
    };

    const objectCss = objectToCSS(getCamelCasedAttributes(section.attributes));

    // Hanlde padding  as offset  is mjml  different  from padding css when  image rendered
    const newObjCss = Object.keys(objectCss).reduce((acc: { [key: string]: string }, key: string) => {
        const newKey = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"].includes(key) ?
                                key.replace("padding", "margin") : key;
        acc[newKey] = objectCss[key];
        return acc;
    }, {});

    const allStyle: CSSProperties = {
        ...getStyle(),
        ...newObjCss,
    };
    return (
        <div 
            className="relative w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{textAlign: section.attributes.align}}
            onClick={handleMouseClick}
        >
            <Image
                className="cursor-pointer max-w-full"
                src={section.attributes.src}
                width={section.attributes.width}
                height={section.attributes.height}
                preview={false}
                style={{
                    ...allStyle
                }}
            />
            {(isHovered || showControls) && (
                <ItemOnHover section={section} path={path} />
            )}
        </div>
    );
};

export default ImagePreview;
