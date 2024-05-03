/**
 * Rich Text Editor - MultiRow Toolbar Sample
 */
'use client'
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar, ToolbarSettingsModel } from '@syncfusion/ej2-react-richtexteditor';
import "./style.scss"
import { registerLicense } from '@syncfusion/ej2-base';
import useEmailDataStore from '@/store/email';
import React, { useRef, useState } from 'react';
import MergeFieldText from './MergeFieldText';
import { Button } from 'antd';

registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENCSE || "");

interface ITextEditorProps {
    content?: string
}
const TestTextEditor: React.FC<ITextEditorProps> = (props) => {
    const { activeNode, updateContent, } = useEmailDataStore()
    const [content, setContent] = useState((activeNode && activeNode.section.content) || "")
    const richTextEditorRef = useRef<RichTextEditorComponent>(null);

    let toolbarSettings: ToolbarSettingsModel = {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
            'LowerCase', 'UpperCase', '|',
            'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
            'Outdent', 'Indent', '|',
            'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
            'SourceCode', 'FullScreen', '|', 'Undo', 'Redo'
        ],
        // type: ""
    };

    const handleEditorChange = (newContent: any) => {
        console.log("Update nooij dung", newContent)
        console.log(activeNode)
        setContent(newContent.value);
        updateContent(newContent.value, activeNode.path)
    };
    let rteObj: RichTextEditorComponent;
    function created(): void {
        const instance = rteObj;

        console.log(instance && instance.value)
        // (rteObj as any).contentModule.getDocument().addEventListener("keydown",(e: any)=>{
        //     if(e.key === 's' && e.ctrlKey===true){
        //         e.preventDefault(); // to prevent default ctrl+s action
        //         instance.updateValue(); // to update the value after editing
        //         // const value: any= instance.value; // you can get the RTE content to save in the desired database

        //         updateContent(instance.value, activeNode.path)
        //     }
        // });
    }

    // const addTextToCursor = (text:any) => {
    //     if (typeof window !== 'undefined' && quillRef.current) { 
    //         quillRef.current.focus()
    //         const quill = quillRef.current.getEditor();
    //         const selection = quill.getSelection();
            
    //         console.log(selection)
    //         if (selection) {
    //             quill.insertText(selection.index, text);
    //         } else {
    //             quill.insertText(0, text);
    //         }
    //     }
    // };

    const addTextToCursor = (text :string) => {
        const rteObj = richTextEditorRef && richTextEditorRef.current
        if (rteObj) {
          const range = rteObj.getRange();
          const currentPosition = range ? range.startOffset : -1;
        //   const textToInsert = 'Your text here';
    
          if (currentPosition !== -1) {
            rteObj.executeCommand("insertText", text);
          }
        }
      };

    // const addTextToCursor = (text, position) => {
    //     const rteObj = richTextEditorRef.current.getInstance();
    //     if (rteObj) {
    //       rteObj.executeCommand('insertText', text);
    //     }
    //   };
    return (
        <>
            <RichTextEditorComponent
                ref={richTextEditorRef} created={created}
                // height={300}
                style={{minHeight: 200, maxHeight: 450, overflow: "scroll"}}
                toolbarSettings={toolbarSettings}
                // onChange={handleEditorChange}
                change={handleEditorChange}
                iframeSettings={{
                    enable: true
                }}
                value={content}
            >
                {/* {content} */}
                <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
            </RichTextEditorComponent>
            <MergeFieldText onSelectField={(text:string) => addTextToCursor(text)}/>
            {/* <Button type="primary" className="bg-primary" onClick={handleApplyChange}>Apply Change</Button> */}
        </>
    );
}
export default TestTextEditor;