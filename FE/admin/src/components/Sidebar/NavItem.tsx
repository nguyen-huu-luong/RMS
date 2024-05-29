"use client";
import styles from "./styles.module.scss";
import { UpOutlined } from "@ant-design/icons";
import { useRouter } from "next-intl/client";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface INavItemProps {
	title: string;
	itemId: string;
	icon?: React.ReactNode;
	subNavs?: INavItemProps[];
	navigateTo: string;
}
const NavItem: React.FC<INavItemProps> = (item: INavItemProps) => {
	const router = useRouter();
	const [expandNav, setExpandNav] = useState(false);
	const handleClick = (item: INavItemProps) => {
		if (item.subNavs && item.subNavs.length > 0) {
			setExpandNav(!expandNav);
		} else {
            console.log(router)
			router.push(item.navigateTo);
		}
	};

	const IconComponent = item.icon;
	const pathname = usePathname();
	return (
		<ul className="ps-0 space-y-1 ">
			<li
				className={
					styles["sidebar-navigation-items"] +
					(pathname.includes(item.itemId) ? " " + styles.active : " ")
				}
				key={item.itemId}
				onClick={() => handleClick(item)}
			>
				<span className="w-6 h-3 flex items-center">{IconComponent}</span>
				<span className="ml-2">{item.title}</span>
				{item.subNavs && item.subNavs.length > 0 && (
					<UpOutlined
						style={{
							transform: `rotate3d(1,0,0,${expandNav ? 0 : 180}deg)`,
							transition: "transform 0.3s ease-in-out",
						}}
						className={`ms-auto text-sm`}
					/>
				)}
			</li>

			<ul
				className={`ps-0 space-y-1 transition-all delay-300 duration-300 overflow-hidden ${
					expandNav ? "max-h-screen" : "max-h-0"
				}`}
			>
				{item.subNavs &&
					item.subNavs.length > 0 &&
					item.subNavs.map((subItem: INavItemProps) => (
						<li
							className={
								styles["sidebar-navigation-sub-items"] +
								(pathname.includes(subItem.itemId) ? " " + styles.active : " ")
							}
							key={subItem.itemId}
							onClick={() => handleClick(subItem)}
						>
							<span className="ml-2">{subItem.title}</span>
						</li>
					))}
			</ul>
		</ul>
	);
};

export default NavItem;
