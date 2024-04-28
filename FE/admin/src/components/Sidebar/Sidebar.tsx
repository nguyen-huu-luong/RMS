"use client"
import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import {
	UserAddOutlined,
	AccountBookOutlined,
	LeftOutlined,
	SnippetsOutlined
	
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { Button } from "antd";
import { getSession, useSession } from "next-auth/react";
import { INavItemProps } from "./NavItem";



export default function Sidebar() {
	const [role, setRole] = useState("")
	const t = useTranslations("Sidebar");
	
	useEffect(() => {
		const setSessionRole = async () => {
			const session = await getSession();
			if (session) {
				console.log(session)
				setRole(session.user.role)
			}
		}
		setSessionRole()
	}, [])


	const allItems = [
		{
			title: t("overview"),
			itemId: "/overview",
			navigateTo: "/overview",
			icon: <UserAddOutlined />,
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
			icon: <UserAddOutlined />,
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
			icon: <UserAddOutlined />,
			subNavs: [
				{
					title: t("campaign"),
					itemId: "/marketing/campaigns",
					navigateTo: "/marketing/campaigns",
				},
				{
					title: t("automated-message"),
					itemId: "/marketing/automations",
					navigateTo: "/marketing/automations",
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
			icon: <UserAddOutlined />,
			subNavs: [
				{
					title: t("product"),
					itemId: "/bussiness/products",
					navigateTo: "/bussiness/products",
				},
				{
					title: t("news"),
					itemId: "/bussiness/news",
					navigateTo: "/bussiness/news",
				},
				{
					title: t("voucher"),
					itemId: "/bussiness/vouchers",
					navigateTo: "/bussiness/vouchers",
				},
				{
					title: t("information"),
					itemId: "/bussiness/infomation",
					navigateTo: "/bussiness/information",
				},
			],
		},

		{
			title: t("report"),
			itemId: "/report",
			navigateTo: "#",
			icon: <UserAddOutlined />,
			subNavs: [
				{
					title: t("crm-report"),
					itemId: "/report/crm",
					navigateTo: "/report/crm",
				},
				{
					title: t("bussiness-report"),
					itemId: "/report/rbussiness",
					navigateTo: "/report/rbussiness",
				},
			],
		},

		{
			title: t("chat-center"),
			itemId: "/chat",
			navigateTo: "/chat",
			icon: <UserAddOutlined />,
		},
	]

	const employeeTabs = ["/overview", "/customers", "/leads", "/sale", "/chat" ]
	const chefTab = []

	let items:INavItemProps[] = []
	console.log(role)
	if (role === "manager") {
		items = allItems
	} else if (role === "employee") {
		items = allItems.filter(item => employeeTabs.includes(item.itemId))
	}
	
	
	return (
		<main className="flex-col h-screen border-r  bg-white fixed left-0 top-0 w-sidebar" >
			<h2 className="text-center font-bold my-4 text-2xl"> Admin dashboard</h2>
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
