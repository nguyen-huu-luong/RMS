import React from "react";

import styles from "./styles.module.scss";
import NavItem, { INavItemProps } from "./NavItem";

export type ISideNavProps = {
	items: INavItemProps[];
	activeItemId: string;
    type: string;
};

const Navigation: React.FC<ISideNavProps> = ({ activeItemId, items, type }) => {
	return (
		<div className="overflow-y-scroll no-scrollbar" style={{
            maxHeight: "calc(100vh - 80px)"
        }}>
			{items.length > 0 && (
				<div
					className={styles["sidebar-navigation"]}
					role="navigation"
					aria-label="side-navigation"
				>
					{items.map((item: INavItemProps) => (
						<NavItem {...item} key={item.itemId} />
					))}
				</div>
			)}
		</div>
	);
};

export default Navigation;
