import React from "react";
function Status({ read }: { read: boolean }) {
    return (
        <div className='flex flex-row justify-end -mt-2'>
            <span className='text-xs font-light text-right w-fit'>
             {read?"Seen": "Not seen"}
            </span> 
        </div>
    )
}

export default Status;
