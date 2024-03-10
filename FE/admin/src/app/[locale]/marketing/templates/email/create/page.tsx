"use client"
import DropContainer from "@/components/EmailTemplateComponents/DropContainer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import RightSisebar from "@/components/EmailTemplateComponents/RightSidebar";
import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import useEmailDataStore from "@/store/email";
import LeftSidebar from "@/components/EmailTemplateComponents/LeftSidebar";

const EmailTemplateEditor: React.FC = () => {
  const [value, setValue] = useState("")
  const { emailData } = useEmailDataStore();
  
  
  const onChange = (e: any) => {
    setValue(e.target.value)
  }

  const handleSave = async (e: any) => {
    e.preventDefault()
    const data = {
      name: "test",
      description: "test",
      content: JSON.stringify(emailData),
      type: "email"
    }
    try {
        const response = await axios.post('http://localhost:3003/api/message-templates', { data }, {
            headers: {
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJmdWxsTmFtZSI6Ik1hbmFnZXIgTWFuYWdlciIsImVtYWlsIjoiTWFyaW9fS29zc0B5YWhvby5jb20iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTcwODM1NjUwNCwiZXhwIjoxNzE0MzU2NTA0fQ.naMCtTR_QKTwTMkqjIL6QaMNnbZdOk7wzuojI_H5RNc",
            }
        });
        console.log('New email template added:', response.data);
        message.success('Email template added successfully');
    } catch (error) {
        console.error('Error adding Email template:', error);
        message.error('Failed to add Email template');
    }
};

  return (
    <div className="w-full" >
      <DndProvider backend={HTML5Backend}>
        <div className="flex space-x-3">
          <LeftSidebar /> 
          <DropContainer />
          <RightSisebar />
        </div>
      </DndProvider>
      {/* <ConfigElement /> */}
      <form className="bg-white border p-4 m-5" onSubmit={handleSave} >
          <input name="email-name" value={value} onChange={onChange}  placeholder="Name" className="border"/>
          <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EmailTemplateEditor;
