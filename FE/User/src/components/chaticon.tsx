import { MessageOutlined } from "@ant-design/icons";
const ChatIcon = () => {
    return (
        <button className='shadow-xl z-50 fixed bottom-5 right-5 inline-flex items-center w-12 h-12 justify-center overflow-hidden transition-all bg-primary-white rounded-full hover:bg-primary-white group'>
            <span className='w-0 h-0 rounded-full bg-primary-400 absolute top-0 left-0 ease-out duration-500 transition-all group-hover:w-full group-hover:h-full -z-1'></span>
            <span className='w-full text-item-black transition-colors duration-300 ease-in-out group-hover:text-item-white z-10'>
                <MessageOutlined style={{ fontSize: "1.4rem" }} />
            </span>
        </button>
    );
};

export default ChatIcon;