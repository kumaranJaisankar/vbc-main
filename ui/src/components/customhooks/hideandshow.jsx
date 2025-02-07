import React,{useEffect,useRef} from 'react';

const HideandShow = (props) =>{
   
  //onside click hide sidebar
  const box = useRef(null);
  useOutsideAlerter(box);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Function for click event
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (
            props.ightSidebar &&
            !event.target.className.includes("openmodal") &&
            !event.target.className.includes("ant-select-tree")
          ) {
            props.closeCustomizer();
          }
        }
      }

      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }

}
export default HideandShow;