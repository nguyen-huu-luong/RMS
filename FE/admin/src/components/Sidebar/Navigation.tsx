import React from "react";

import styles from "./styles.module.scss";
import NavItem, { INavItemProps } from "./NavItem";

export type ISideNavProps = {
	items: INavItemProps[];
	activeItemId: string;
};

const Navigation: React.FC<ISideNavProps> = ({ activeItemId, items }) => {
	return (
		<>
			{items.length > 0 && (
				<div
					className={styles["sidebar-navigation"] + " overflow-hidden"}
					role="navigation"
					aria-label="side-navigation"
				>
					{items.map((item: INavItemProps) => (
						<NavItem {...item} key={item.itemId} />
					))}
				</div>
			)}
		</>
	);
};

export default Navigation;
