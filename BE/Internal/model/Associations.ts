import {
	Campaign,
	CampaignTargetList,
	Cart,
	Client,
	ClientTargetList,
	EmailCampaign,
	Order,
	OrderItem,
	Product,
	Targetlist,
} from "./";

class Association {
	public static initialize() {
		try {
			Client.associate();
			Order.associate();
			Cart.associate();
			Targetlist.associate();
			Campaign.associate();
			EmailCampaign.associate();
			Product.associate();

		} catch (err) {
			console.log("Initialize association failed!");
			console.log(`Err: ${err}`);
		}
	}
}

export default Association;
