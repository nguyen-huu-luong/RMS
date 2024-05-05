import useEmailDataStore from "@/store/email";
import TextAttributes from "./TextAttributes";
import { CSSProperties } from "styled-components";
import ButtonAttributes from "./ButtonAttributes";
import ImageAttributes from "./ImageAttributes";
import { getTagName } from "@/lib/utils/get-mjml-tagname";
import ColumnAttributes from "./ColumnAttributes";
import SectionAttributes from "./SectionAttributes";

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

  const tagName = activeNode && activeNode.section.tagName ;

  console.log("re-render")
  return (
    <div style={getStyle()} className="mx-2 max-h-screen overflow-scroll bg-white">
      {activeNode && <p className="my-3"><b>{getTagName(activeNode.section.tagName)} element</b></p>}
      {tagName === "mj-text" && <TextAttributes />}
      {tagName === "mj-button" && <ButtonAttributes />}
      {tagName === "mj-image" &&  <ImageAttributes /> }
      {tagName === "mj-column" &&  <ColumnAttributes /> }
      {tagName === "mj-section" &&  <SectionAttributes /> }
      {/* {tagName === "mj-section" &&  <ImageAttributes /> }
      {tagName === "mj-column" &&  <ImageAttributes /> }
      {tagName === "mj-carosel" &&  <ImageAttributes /> }
      {tagName === "mj-spacer" &&  <ImageAttributes /> } */}
    </div>
  );
};

export default RightSisebar;
