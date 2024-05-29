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
import { Button, Dropdown, MenuProps, Space, Tooltip } from "antd";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "../LocaleSwitcher/";
import { DynamicBreadcrumb } from "..";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import Image from "next/image";


interface IHeaderContainerProps {
	user: User
}
export default function HeaderContainer(props: IHeaderContainerProps) {
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
		<>
			<DynamicBreadcrumb />
			<div className="flex items-center">
				<Space>
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
				</Space>

				<Dropdown menu={menuProps}>
					<div className="flex items-center border border-white text-black hover:text-primary hover:bg-slate-100 hover:border-primary px-2 py-1 cursor-pointer rounded ms-3">
						<Image
							src={props.user.image || "https://cdn-icons-png.flaticon.com/256/163/163801.png"}
							alt="avatar"
							width={30}
							height={30}
							style={{
								width: 30,
								height: 30
							}}
							className="rounded-full me-2"
						/>
						<p>{props.user.name}</p>
						<DownOutlined className="ms-2 text-xs" />
					</div>
				</Dropdown>
			</div>
		</>

	);
}
