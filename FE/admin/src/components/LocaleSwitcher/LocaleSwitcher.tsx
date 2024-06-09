"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { Locale, localeNames, locales } from "@/i18nConfig";
import { Button, Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import Image from "next/image";

export default function LocaleSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathName = usePathname();

	const switchLocale = (key: Locale) => {
		locale !== key && router.push(pathName, { locale: key });
	};

	const items = locales.map((item) => ({
		label: (
			<div className="flex items-center space-x-2">
				<Image
					src={
						item === "vi"
							? require("@/images/vietnam.png")
							: require("@/images/english.png")
					}
					width={30}
					height={30}
					alt="flag"
				/>
				<span>{localeNames[item]}</span>
			</div>
		),
		key: item,
		onClick: () => switchLocale(item),
	}));

	const menuProps = {
		items,
	};

	return (
		<div>
			<Dropdown menu={menuProps}>
					
				<Button className="border-white items-center flex hover:border" icon={<GlobalOutlined />}>
					<span>{localeNames[locale as Locale]}</span>
				</Button>
			</Dropdown>
		</div>
	);
}
