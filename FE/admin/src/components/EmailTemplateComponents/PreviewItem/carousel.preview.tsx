import React, { useState } from "react";
import useEmailDataStore from "@/store/email";

import {
    getCamelCasedAttributes,
    objectToCSS
} from "@/lib/utils/get-camel-cased-attr";
import ItemOnhover from "./ItemOnHover";
import { CSSProperties } from "styled-components";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"

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
    fontFamily: "Ubuntu, Helvetica, Arial, sans-serif",
    fontSize: "18px",
    fontWeight: "normal",
    lineHeight: "120%",
    textDecoration: "none",
    textTransform: "none",
    margin: "10px 25px",
    padding: "10px 25px"
};

const CarouselPreview = ({ section, index, path }: IButtonPreview) => {
    const [isHovered, setIsHovered] = useState(false);
    const { setActiveNode, activeNode } = useEmailDataStore();
    const objectCss = objectToCSS(getCamelCasedAttributes(section.attributes));
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        const activeNode = {
            section,
            path,
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
    // const newObjCss = Object.keys(objectCss).reduce((acc: { [key: string]: string }, key: string) => {
    //     // console.log(key)
    //     const newKey = ["paddingLeft", "paddingRight", "paddingTop", "paddindBottom"].includes(key) ?
    //                             key.replace("padding", "margin") : key;
    //     acc[newKey] = objectCss[key];
    //     // console.log(newKey)
    //     return acc;
    // }, {});

    // console.log(newObjCss)

    const allStyle: CSSProperties = {
        ...getStyle(),
        ...defaultStyle,
        ...objectCss,
    };

    // console.log(allStyle)
    const onChange = (currentSlide: number) => {
        console.log(currentSlide);
    };
    const contentStyle: React.CSSProperties = {
        margin: 0,
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };

    return (
        <div
            // style={{ ...allStyle, display: "inline-flex" }}
            // className="relative inline-flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            <Carousel showIndicators={false}>
                {
                    section.children.map((item: any, index: number) => (
                        <div key={index}>
                            <img src={item.attributes.src}/>
                        </div>
                    ))
                }
            </Carousel>
            {(isHovered || showControls) && (
                <ItemOnhover section={section} path={path} />
            )}
        </div>
    );
};
export default CarouselPreview;
