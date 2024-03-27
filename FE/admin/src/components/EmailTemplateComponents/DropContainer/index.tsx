
import { useDrop } from "react-dnd";
import { CSSProperties, useState } from "react";
import useEmailDataStore from "@/store/email";
import useEmailHistoryStore from "@/store/email-history";
import ResponsiveControl from "./editor-controls";
import EditMode from "./edit-mode";
import PreviewMode from "./preview-mode";

const DropContainer = () => {
    const { emailData, setEmailData, pushTagElement, activeNode } = useEmailDataStore();
    const { pushToUndoStack } = useEmailHistoryStore();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentView, setCurrentView] = useState<
        "edit" | "preview" | "desktop-preview"
    >("edit");
    const [isMobile, setIsMobile] = useState(false);

    const [collectedProps, drop] = useDrop(() => ({
        accept: ["mj-section"],
        drop: (item: any, monitor) => {
            console.log("droped")
            if (!monitor.didDrop()) {
                pushToUndoStack(emailData);
                pushTagElement(item["type"], item["keys"]);
            }
        }
    }));

    // const handleSequence = (direction: "up" | "down") => {
    //     const emailDataClone = { ...emailData };

    //     const sections = emailDataClone.children;
    //     if (direction === "up" && currentIndex > 0) {
    //         // Move the element up by swapping it with the previous element
    //         const temp = sections[currentIndex];
    //         sections[currentIndex] = sections[currentIndex - 1];
    //         sections[currentIndex - 1] = temp;
    //     } else if (direction === "down" && currentIndex < sections.length - 1) {
    //         // Move the element down by swapping it with the next element
    //         const temp = sections[currentIndex];
    //         sections[currentIndex] = sections[currentIndex + 1];
    //         sections[currentIndex + 1] = temp;
    //     }

    //     emailDataClone.children = sections;
    //     setEmailData(emailDataClone);
    // };

    return (
        <div className="flex flex-col border items-center px-2 h-screen overflow-auto" style={{width: activeNode ? "50%" : "80%"}}>
            <ResponsiveControl
                setCurrentView={setCurrentView}
                setIsMobile={setIsMobile}
                currentView={currentView}
            />
            <div className="m-2 p-2 border flex justify-center w-full">
                <div ref={drop} className="flex flex-col items-center w-full">
                    {currentView == "edit" && <EditMode />}
                    {["preview", "desktop-preview"].includes(currentView) && (
                        <PreviewMode isMobile={isMobile} />
                    )}
                    {currentView == "edit" && (
                        <div
                            style={{
                                minHeight: 200,
                                width: "60%",
                                border: "2px dashed grey",
                                boxSizing: "border-box",
                            }}
                            className="flex items-center p-2 justify-between w-full text-center"
                        >
                            Drop Hero or Section or Wrapper here
                        </div>
                    )}
                </div >
            </div>
        </div>
        )
};

export default DropContainer;
