import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import LeftSidebar from "./LeftSidebar"
import DropContainer from "./DropContainer"
import RightSisebar from "./RightSidebar"

export interface IEmailTemplateEditorProps {
    mode: "preview" | "edit" 
}
const EmailTemplateEditor: React.FC<IEmailTemplateEditorProps> = ({mode}) => {
    
    return (
    <DndProvider backend={HTML5Backend}>
        <div className="flex justify-end relative" style={{maxHeight: "calc(100vh - 100px)"}}>
            <LeftSidebar />
            <DropContainer view={mode}/>
            <RightSisebar />
        </div>
    </DndProvider>)
}

export default EmailTemplateEditor