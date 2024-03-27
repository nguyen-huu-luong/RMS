import useEmailStore from "@/store/email";
import { Button, Tooltip } from "antd";
import { CgSmartphone } from "react-icons/cg";
import { HiComputerDesktop } from "react-icons/hi2";
import { MdPreview } from "react-icons/md";

interface IResponsiveControl {
	setCurrentView: (view: currentView) => void;
	setIsMobile: (val: boolean) => void;
	currentView: currentView;
}

type currentView = "edit" | "preview" | "desktop-preview";

const ResponsiveControl = ({
	setCurrentView,
	setIsMobile,
	currentView
}: IResponsiveControl) => {
	const { emailData, resetEmailData } = useEmailStore();

	const getTooltipTitle = (type: string) => {
		switch (type) {
			case "mobile": {
				if (!emailData["children"].length) {
					return "Please add any data";
				} else {
					return "Mobile view";
				}
			}
			case "desktop": {
				if (!emailData["children"].length) {
					return "Please add any data";
				} else {
					return "Desktop view";
				}
			}

			case "reset":
				{
					if (!emailData["children"].length) {
						return "Please add any data";
					} else {
						return "Reset";
					}
				}

				break;

			default:
				break;
		}
	};

	return (
		<div className="w-full flex items-center justify-center space-x-2 bg-white text-center h-14 border-b-zinc-600">
			<Tooltip title="Edit view" placement="top" arrow>
				<span>
					<Button
						aria-label="edit view"
						color={currentView == "edit" ? "primary" : "default"}
						onClick={() => {
							setCurrentView("edit");
							setIsMobile(false);
						}}
					>
						<HiComputerDesktop />
					</Button>
				</span>
			</Tooltip>
			<Tooltip title={getTooltipTitle("mobile")} placement="top" arrow>
				<span>
					<Button
						aria-label="mobile view"
						disabled={!emailData["children"].length}
						color={currentView == "preview" ? "primary" : "default"}
						onClick={() => {
							setCurrentView("preview");
							setIsMobile(true);
						}}
					>
						<CgSmartphone />
					</Button>
				</span>
			</Tooltip>
			<Tooltip title={getTooltipTitle("desktop")} placement="top" arrow>
				<span>
					<Button
						aria-label="Desktop view"
						disabled={!emailData["children"].length}
						color={currentView == "desktop-preview" ? "primary" : "default"}
						onClick={() => {
							setCurrentView("desktop-preview");
							setIsMobile(false);
						}}
					>
						<MdPreview />
					</Button>
				</span>
			</Tooltip>
		</div>
	);
};

export default ResponsiveControl;
