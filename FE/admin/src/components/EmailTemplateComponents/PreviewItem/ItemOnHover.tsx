import useEmailDataStore from "@/store/email";
import { CSSProperties } from "styled-components";
import { BsTrash } from "react-icons/bs";
import { Button } from "antd";
import { variables } from "@/app";

interface IHoverInfo {
    section: any;
    path: string;
}

const defaultStyle: CSSProperties = {
    position: "absolute",
    top: "-30px",
    left: "-5px",
    background: "white",
    color: "black",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "20px",
    borderRadius: "10px",
    fontFamily: "Open Sans, sans-serif"
};

const getTagName = (tagName: string) => {
    switch (tagName) {
        case "mj-button":
            return "Button";

        case "mj-text":
            return "Text";

        case "mj-section":
            return "Section";

        case "mj-column":
            return "Column";

        case "mj-hero":
            return "Hero";

        default:
            break;
    }
};

const ItemOnHover = ({ section, path }: IHoverInfo) => {
    const { popTagElement, activeNode } = useEmailDataStore();

    const handleDelete = () => {
        popTagElement(path);
    };

    const activeSectionId = activeNode && activeNode["section"]?.id;
    const currentSectionId = section.id;

    const showControls = activeSectionId === currentSectionId;

    return (
        <div style={{ ...defaultStyle }}>
            {
                showControls && (
                    <>
                        <span>
                            {getTagName(section.tagName)}
                        </span>
                        <Button
                            danger size="small"
                            onClick={handleDelete}
                            icon={<BsTrash style={{ fontSize: "1rem" }} />}
                        />
                    </>
                )
            }

        </div>
    );
};

export default ItemOnHover;
