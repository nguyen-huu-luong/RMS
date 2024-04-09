import React from "react";

const useOutsideClick = (callback: any) => {
    const ref = React.useRef();
  
    React.useEffect(() => {
      const handleClick = (event: any) => {
        callback();
      };
  
      document.addEventListener('click', handleClick);
  
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, []);
  
    return ref;
  };

  export default useOutsideClick