"use client"
import DropContainer from "@/components/EmailTemplateComponents/DropContainer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import RightSisebar from "@/components/EmailTemplateComponents/RightSidebar";
import LeftSidebar from "@/components/EmailTemplateComponents/LeftSidebar";

const EmailTemplateEditor: React.FC = () => {
  
  return (
    <div className="w-full bg-white" >
      <DndProvider backend={HTML5Backend}>
        <div className="flex justify-end max-h-screen h-screen overflow-auto relative">
          <LeftSidebar />
          <DropContainer />
          <RightSisebar />
        </div>
      </DndProvider>
      {/* <ConfigElement /> */}
    </div>
  );
};

export default EmailTemplateEditor;
