"use client"
import React from "react";
import Navigation from "./Navigation";
import {
	UserAddOutlined,
	AccountBookOutlined,
	LeftOutlined,
	SnippetsOutlined,
	LineChartOutlined,
	PicRightOutlined,
	DeliveredProcedureOutlined,
	HomeOutlined, 
	FireOutlined
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { Button } from "antd";
import { getSession, useSession } from "next-auth/react";
import { INavItemProps } from "./NavItem";


interface ISideBarProps {
	role: string
}
export const SidebarContainer: React.FC<ISideBarProps>  = ({role}) => {
	const t = useTranslations("Sidebar");
	const t_general = useTranslations("General");

	const allItems = [
		{
			title: t("overview"),
			itemId: "/overview",
			navigateTo: "/overview",
			icon: <LineChartOutlined />,
		},
		{
			title: t("customer"),
			itemId: "/customers",
			navigateTo: "/customers",
			icon: <UserAddOutlined />,
		},
		{
			title: t("lead"),
			itemId: "/leads",
			icon: <AccountBookOutlined />,
			navigateTo: "/leads",
		},
		{
			title: t("organization"),
			itemId: "/organization",
			navigateTo: "#",
			icon: <PicRightOutlined />,
			subNavs: [
				{
					title: t("employee"),
					itemId: "/organization/employees",
					navigateTo: "/organization/employees",
				},
			],
		},
		{
			title: t("sale"),
			itemId: "/sale",
			navigateTo: "#",
			icon: <SnippetsOutlined />,
			subNavs: [
				{
					title: t("order"),
					itemId: "/sale/orders",
					navigateTo: "/sale/orders",
				},
				{
					title: t("reservation"),
					itemId: "/sale/reservations",
					navigateTo: "/sale/reservations",
				},
				{
					title: t("opportunity"),
					itemId: "/sale/opportunities",
					navigateTo: "/sale/opportunities",
				},
			],
		},
		{
			title: t("marketing"),
			itemId: "/marketing",
			navigateTo: "#",
			icon: <DeliveredProcedureOutlined />,
			subNavs: [
				{
					title: t("campaign"),
					itemId: "/marketing/campaigns",
					navigateTo: "/marketing/campaigns",
				},
				{
					title: t("message-template"),
					itemId: "/marketing/templates",
					navigateTo: "/marketing/templates",
				},
				{
					title: t("target-list"),
					itemId: "/marketing/targetlists",
					navigateTo: "/marketing/targetlists",
				},
			],
		},

		{
			title: t("bussiness"),
			itemId: "/bussiness",
			navigateTo: "#",
			icon: <HomeOutlined />,
			subNavs: [
				{
					title: t("product"),
					itemId: "/bussiness/products",
					navigateTo: "/bussiness/products",
				},
				{
					title: t("voucher"),
					itemId: "/bussiness/vouchers",
					navigateTo: "/bussiness/vouchers",
				}
			],
		},
		{
			title: t("chat-center"),
			itemId: "/chat",
			navigateTo: "/chat",
			icon: <UserAddOutlined />,
		},
		{
			title: t("chef"),
			itemId: "/chef",
			navigateTo: "/chef",
			icon: <FireOutlined />,
		},
	]

	const employeeTabs = ["/overview", "/customers", "/leads", "/sale", "/chat" ]
	const chefTab = ["/chef"]

	let items:INavItemProps[] = []
	if (role === "manager") {
		items = allItems.filter(item => item.itemId !== "/chef")
	} else if (role === "employee") {
		items = allItems.filter(item => employeeTabs.includes(item.itemId))
	} else if (role === "chef"){
		items = allItems.filter(item => chefTab.includes(item.itemId))
	}
	
	
	return (
		<main className="flex-col h-screen border-r  bg-white fixed left-0 top-0 w-sidebar" >
			<h2 className="text-center font-bold my-4 text-2xl">{t_general("admin_dashboard")}</h2>
			<div className="flex-1 h-full">
				<Navigation
                    type="expand"
					activeItemId="/"
					items={items || []}
				/>
			</div>
			<div className="absolute bottom-0 bg-white shadow-lg w-full z-20 flex items-center">
				<Button
                className="ms-4 mb-4"
					icon={<LeftOutlined className="text-3xl" />}
				/>
			</div>
		</main>
	);
}
