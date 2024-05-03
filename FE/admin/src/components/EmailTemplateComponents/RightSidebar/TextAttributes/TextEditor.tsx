import React, { useEffect, useRef, useState } from 'react';
import useEmailDataStore from '@/store/email';
import { Button } from 'antd';
import MergeFieldText from './MergeFieldText';
const ReactQuill = typeof window === 'object' ? 
    require('react-quill') 


: () => false
import 'node_modules/react-quill/dist/quill.snow.css'
import './style.scss'
import { Content } from 'next/font/google';


const TextEditor = () => {
    const { activeNode, updateContent,  } = useEmailDataStore()
    const [content, setContent] = useState((activeNode && activeNode.section.content) || "")
    const [tempContent, setTempContent] = useState((activeNode && activeNode.section.content) || "")
    const quillRef = useRef<typeof ReactQuill>(null);
    
    const Quill = ReactQuill.Quill;
    var Font = Quill.import("formats/font");
    Font.whitelist = ["Roboto", "Raleway", "Montserrat", "Lato", "Rubik"];
    Quill.register(Font, true);

    const addTextToCursor = (text:any) => {
        if (typeof window !== 'undefined' && quillRef.current) { 
            quillRef.current.focus()
            const quill = quillRef.current.getEditor();
            const selection = quill.getSelection();
            
            console.log(selection)
            if (selection) {
                quill.insertText(selection.index, text);
            } else {
                quill.insertText(0, text);
            }
        }
    };


    const quillModules = {
        toolbar: [
            [{ font: Font.whitelist }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ align: [] }],
            [{ color: [] }, { 'background': [] }],
            ['clean']  
        ],
    };


    const quillFormats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'link',
        'image',
        'align',
        'color',
        'code-block',
    ];

    useEffect(() => {
        console.log("Change actiove node", activeNode)
        handleBlurEditor()
    }, [activeNode])


    const handleEditorChange = (newContent: any) => {
        console.log(activeNode)
        setContent(newContent);
        updateContent(newContent, activeNode.path)
    };

    const handleApplyChange = () => {
       setTempContent(content)
    }

    const handleBlurEditor = () => {
        console.log("Blur without save")
        updateContent(tempContent, activeNode.path)
    }

    
    return (
        <main>
            <div className="w-full flex items-center">
                <ReactQuill
                    ref={(el:any) => { quillRef.current = el }}
                    value={content}
                    onChange={handleEditorChange}            
                    modules={quillModules}
                    formats={quillFormats}
                    className="w-full h-full mt-10 bg-white"
                />
            </div>
            <MergeFieldText onSelectField={(text:string) => addTextToCursor(text)}/>
            <Button type="primary" className="bg-primary" onClick={handleApplyChange}>Apply Change</Button>
        </main>
    );
}

export default TextEditor;