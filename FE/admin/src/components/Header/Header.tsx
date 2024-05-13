'use client'
import React from "react";
import {
	BellOutlined,
	DownOutlined,
	LogoutOutlined,
	MessageOutlined,
	SettingOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Tooltip } from "antd";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "../LocaleSwitcher/";
import variables from "@/app/variables.module.scss";
import { DynamicBreadcrumb } from "..";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
	const t = useTranslations("Header");
	const router = useRouter()
	const items: MenuProps["items"] = [
		{
			label: <Link href="/profile">{t("profile")}</Link>,
			key: "1",
			icon: <UserOutlined />,
		},
		{
			label: <Link href="/settings">{t("setting")}</Link>,
			key: "3",
			icon: <SettingOutlined />,
		},
		{
			label: t("logout"),
			key: "2",
			icon: <LogoutOutlined />,
			danger: true,
			onClick: () => {
				signOut();
			},
		},
	];

	const menuProps = {
		items,
	};
	return (
		<div
			className="flex items-center justify-between bg-white py-2 px-10 space-x-2 border-b-2 fixed z-50 top-0 right-0 h-header"
			style={{ width: `calc(100% - ${variables.sidebarWidth}` }}
		>
            <DynamicBreadcrumb />
			<div className="flex items-center">
				<Tooltip title={t("chat-center")} >
					<Button
						className="border-0 ms-auto hover:border"
						onClick={() => router.push("/chat")}
						icon={<MessageOutlined className="align-middle" />}
					/>
				</Tooltip>
	
				<Tooltip title={t("notification")}>
					<Button
						className="border-0 ms-auto hover:border"
						icon={<BellOutlined className="align-middle" />}
					/>
				</Tooltip>
	
				<LocaleSwitcher />
	
				<Dropdown menu={menuProps}>
					<Button className="flex items-center py-3 ms-4 border-white hover:border hover:bg-secondary">
						<img
							src="https://cdn-icons-png.flaticon.com/256/163/163801.png"
							alt="avatar"
							width={30}
							height={30}
							className="rounded-full me-2"
						/>
						<span>Admin</span>
						<DownOutlined className="ms-2 text-xs" />
					</Button>
				</Dropdown>
			</div>
		</div>
	);
}
