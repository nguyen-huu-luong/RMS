import { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import useEmailDataStore from "@/store/email";
import { Button } from "antd";


const TextAttributes = () => {
  const { activeNode } = useEmailDataStore()
  const [content, setContent] = useState("")
  console.log(content)
  useEffect(() => {
    setContent((activeNode && activeNode.section.content) || "")
  }, [])




  if (!activeNode || (activeNode && activeNode.section.tagName !== "mj-text"))
    return <></>;
    
  return <TextEditor />
}

export default TextAttributes;