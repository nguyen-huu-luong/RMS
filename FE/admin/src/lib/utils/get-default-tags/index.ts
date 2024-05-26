import { v4 as uuidv4 } from "uuid";

export const getDefaultTags = (tagName: string) => {
  switch (tagName) {
    case "mj-image": {
      return {
        tagName,
        attributes: {
          "width": "200px",
          "height": "auto",
          src: "https://static.wixstatic.com/media/5cb24728abef45dabebe7edc1d97ddd2.jpg",
          "padding-left": "0px",
          "padding-right": "0px",
          "padding-bottom": "0px",
          "padding-top": "0px",
          align: "center",
        },
        children: [],
        id: uuidv4(),
      };
    }

    case "mj-section": {
      return {
        tagName,
        attributes: {
          display: "flex",
          "flex-direction": "column",
          "justify-content": "center"
          // padding: "8px"
        },
        children: [],
        id: uuidv4(),
      };
    }

    case "mj-spacer": {
      return {
        tagName: "mj-spacer",
        attributes: {
          height: "50px",
          "line-height": "50px",
        },
        children: [],
      };
    }

    case "mj-text": {
      return {
        tagName,
        attributes: {
          // "padding-top": "20px",
          // "padding-right": "20px",
          // "padding-bottom": "20px",
          // "padding-left": "20px",
          // height: "50px",
          color: "#000",
          // "font-family": "Helvetica",
          position: "relative",
          // align: "center",
          // "font-size": "16px",
          // "line-height": "16px",
          "font-style": "normal",
          // "container-background-color": "white",
          padding: 0
        },
        content: `Text`,
        id: uuidv4(),
      };
    }

    case "mj-column": {
      return {
        tagName,
        attributes: {
          padding: "8px",
          width: "100%",
        },
        children: [],
        id: uuidv4(),
      };
    }

    case "mj-button": {
      return {
        tagName,
        attributes: {
          href: "https://mjml.io/",
          align: "center",
          "vertical-align": "middle",
          "background-color": "#008000",
          color: "#ffffff",
          "border-radius": "20px",
          "max-width": "100%",
          "min-width": "50px",
          "padding-top": "8px",
          "padding-right": "16px",
          "padding-bottom": "8px",
          "padding-left": "16px",
          width: "auto",
          height: "auto"
        },
        content: "Button text",
        id: uuidv4(),
      };
    }
    case "mj-carousel": {
      return {
        tagName,
        attributes: {},
        children: [
          {
            tagName: "mj-carousel-image",
            id: uuidv4(),
            attributes: {
              src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2783&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
          },
          {
            tagName: "mj-carousel-image",
            id: uuidv4(),
            attributes: {
              src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
          },
        ],
        id: uuidv4(),
      };
    }

    default:
      break;
  }
};
