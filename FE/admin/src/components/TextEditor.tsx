import React, { useEffect, useRef, useState } from 'react';
const ReactQuill = typeof window === 'object' ? 
    require('react-quill') 


: () => false
import 'node_modules/react-quill/dist/quill.snow.css'

interface ITextEditorProps {
    content?: string
}

const TextEditor: React.FC<ITextEditorProps> = (props) => {
    const [content, setContent] = useState(props.content || "")
    const quillRef = useRef<typeof ReactQuill>(null);
    
    const Quill = ReactQuill.Quill;
    var Font = Quill.import("formats/font");
    Font.whitelist = ["Roboto", "Raleway", "Montserrat", "Lato", "Rubik"];
    Quill.register(Font, true);

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


    const handleEditorChange = (newContent: any) => {
        setContent(newContent);
    };

    
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
        </main>
    );
}

export default TextEditor;