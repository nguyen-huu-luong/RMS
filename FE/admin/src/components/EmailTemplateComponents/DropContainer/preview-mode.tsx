import useEmailStore from "@/store/email";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const PreviewMode = ({ isMobile }: { isMobile: boolean }) => {
  const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`
  const [loadingPreview, setPreviewStatus] = useState(false);
  const { emailData, setActiveNode } = useEmailStore();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const loadMjMl = async () => {
      setPreviewStatus(true);
      setActiveNode(null)

      const url = `${backend_api}/email-editor/generate-mjml`;

      const withHtml = {
        tagName: "mjml",
        attributes: {},
        children: [emailData]
      };

      console.log("preview mode", withHtml, JSON.stringify(withHtml))
      const respone = await axios(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify(withHtml) // Convert the data to JSON format
      });
      setPreviewStatus(false);

      if (iframeRef.current) {
        const iframeDocument =
          iframeRef.current.contentDocument ||
          (iframeRef.current.contentWindow
            ? iframeRef.current.contentWindow.document
            : null);

        if (iframeDocument) {
          iframeDocument.open();
          iframeDocument.write(respone.data.html || "");
          iframeDocument.close();
        }
      }
    };

    loadMjMl();
  }, []);

  const getStyle = () => {
    const defaultStyle = {
      display: loadingPreview ? "none" : "block",
      mt: "2rem"
    };

    const mobile = {
      ...defaultStyle,
      width: "360px",
      height: "600px",
      bgcolor: "white",
      margin: "1rem",
      backgroundColor: "#f0f0f0",
      border: "1px solid #ccc",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
      position: "relative",
      overflow: "scroll"
    };

    if (isMobile) return mobile;

    const desktop = {
      ...defaultStyle,
      width: "600px",
      height: "600px",
      bgcolor: "white",
      border: "none"
    };

    return desktop;
  };

  return (
    <div className="border">
      {loadingPreview && "Loading..."}
      <iframe
        ref={iframeRef}
        title="Email preview"
        style={getStyle()}
      ></iframe>
    </div>
  );
};

export default PreviewMode;
