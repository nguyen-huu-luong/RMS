export const getTagName = (tagName: string) => {
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
        
        case "mj-image":
            return "Image";

        default:
            break;
    }
};