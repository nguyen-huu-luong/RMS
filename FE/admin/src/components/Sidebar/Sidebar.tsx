import React from "react";
import Navigation from "./Navigation";
import {
	UserAddOutlined,
	AccountBookOutlined,
	LeftCircleFilled,
	LeftCircleOutlined,
	LeftOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { Button } from "antd";

export default function Sidebar() {
	const t = useTranslations("Sidebar");
	return (
		<main className="flex-col h-screen shadow-[0px_2px_10px_1px_rgba(0,0,0,0.2)] bg-white fixed left-0 top-0 w-sidebar">
			<h2 className="text-center font-bold my-4 text-2xl"> Admin dashboard</h2>
			<div className="flex-1 h-full">
				<Navigation
                    type="expand"
					activeItemId="/"
					items={[
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
							icon: <UserAddOutlined />,
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
					]}
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
