/**
 * Rich Text Editor - MultiRow Toolbar Sample
 */
'use client'
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar, ToolbarSettingsModel } from '@syncfusion/ej2-react-richtexteditor';
import "./style.scss"
import { registerLicense } from '@syncfusion/ej2-base';
import useEmailDataStore from '@/store/email';
import React, { useRef, useState } from 'react';
import MergeFieldText from '../EmailTemplateComponents/RightSidebar/TextAttributes/MergeFieldText';

registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENCSE || "");

interface ITextEditorProps {
    content?: string,
    onContentChange?: (newContent: string) => void
}
const EmailTextEditor: React.FC<ITextEditorProps> = (props) => {
    // const { activeNode, updateContent, } = useEmailDataStore()
    const richTextEditorRef = useRef<RichTextEditorComponent>(null);
    const [content, setContent] = useState(props.content || "")

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
        props.onContentChange && props.onContentChange(newContent.value)
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
      }
    return (
        <div className='lg:flex space-x-3 w-full'>
            <RichTextEditorComponent
                ref={richTextEditorRef} created={created}
                // height={300}
                style={{minHeight: 200, maxHeight: 450, overflow: "scroll"}}
                toolbarSettings={toolbarSettings}
                // onChange={handleEditorChange}
                change={handleEditorChange}
                iframeSettings={{
                    enable: false
                }}
                value={content || ""}
            >
                {/* {content} */}
                <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
            </RichTextEditorComponent>
            <MergeFieldText onSelectField={(text:string) => addTextToCursor(text)}/>
            {/* <Button type="primary" className="bg-primary" onClick={handleApplyChange}>Apply Change</Button> */}
        </div>
    );
}
export default EmailTextEditor;