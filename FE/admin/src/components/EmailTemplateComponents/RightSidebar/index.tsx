import useEmailDataStore from "@/store/email";
import TextAttributes from "./TextAttributes";
import { CSSProperties } from "styled-components";
import ButtonAttributes from "./ButtonAttributes";
import ImageAttributes from "./ImageAttributes";
import { getTagName } from "@/lib/utils/get-mjml-tagname";

const RightSisebar = () => {
  const { activeNode } = useEmailDataStore()

  const defaultStyle = {
    display: "none"
  }

  const styleOnActiveNode: CSSProperties = {
    display: "block",
    width: "30%"
  }

  const getStyle = () => {
    if (activeNode) {
      return {
        ...defaultStyle,
        ...styleOnActiveNode
      }
    }

    return defaultStyle
  }
  return (
    <div style={getStyle()} className="mx-2">
      {activeNode && <p className="my-3"><b>{getTagName(activeNode.section.tagName)} element</b></p>}
      <TextAttributes />
      <ButtonAttributes />
      <ImageAttributes />
    </div>
  );
};

export default RightSisebar;
