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
	Reservation,
	Table,
	Employee,
	ChatMessage,
	ChatSession,
	Category
} from ".";
import Token from "./Token";

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
			Reservation.associate();
			Table.associate();
			Employee.associate();
			ChatSession.associate();
			ChatMessage.associate();
            Token.associate() ;
			Category.associate() ;
		} catch (err) {
			console.log("Initialize association failed!");
			console.log(`Err: ${err}`);
		} 

	}
}

export default Association;
