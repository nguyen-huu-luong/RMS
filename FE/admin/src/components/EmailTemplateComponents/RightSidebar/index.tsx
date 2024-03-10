import useEmailDataStore from "@/store/email";
import TextAttributes from "./TextAttributes";
import { CSSProperties } from "styled-components";
import ButtonAttributes from "./ButtonAttributes";

const RightSisebar = () => {
  const {activeNode} = useEmailDataStore() 
  
  const defaultStyle = {
    display: "none"
  }
  
  const styleOnActiveNode : CSSProperties = {
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
        <TextAttributes />
        <ButtonAttributes />
    </div>
  );
};

export default RightSisebar;
