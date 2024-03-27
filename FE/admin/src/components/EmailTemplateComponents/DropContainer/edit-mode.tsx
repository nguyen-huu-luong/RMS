import useEmailStore from "@/store/email";
import ButtonPreview from "../PreviewItem/button.preview";
import TextPreview from "../PreviewItem/text.preview";
import SectionPreview from "../PreviewItem/section.preview";

const EditMode = () => {
  const { emailData } = useEmailStore();

  return (
    <div className="bg-white w-full">
      {emailData["children"].map((section: any, index: number) => {
        return (
          <div key={index}>
            <div aria-haspopup="true" style={{ cursor: "pointer" }}>
              {section.tagName === "mj-section" && (
                <SectionPreview
                  section={section}
                  path={`children.${index}`}
                  index={index}
                  key={index}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EditMode;
