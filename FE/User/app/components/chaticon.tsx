import { MessageOutlined } from "@ant-design/icons";
const ChatIcon = () => {
    return (
        <button className='shadow-xl fixed bottom-5 right-5 inline-flex items-center w-12 h-12 justify-center overflow-hidden transition-all bg-white rounded-full hover:bg-white group'>
            <span className='w-0 h-0 rounded-full bg-orange-400 absolute top-0 left-0 ease-out duration-500 transition-all group-hover:w-full group-hover:h-full -z-1'></span>
            <span className='w-full text-slate-800 transition-colors duration-300 ease-in-out group-hover:text-white z-10'>
                <MessageOutlined style={{ fontSize: "1.4rem" }} />
            </span>
        </button>
    );
};

export default ChatIcon;
