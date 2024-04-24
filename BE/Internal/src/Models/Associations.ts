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
	Category,
	Voucher,
	Channel,
	Message,
	Notification,
	Pos_notification
} from ".";
import ClickEvent from "./ClickEvent";
import EmailCampaignTargetList from "./EmailCampaignTargetlist";
import OpenEvent from "./OpenEvent";
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
			Voucher.associate();
			Channel.associate();
			Message.associate();
			OpenEvent.associate();
			ClickEvent.associate();
			Notification.associate();

			EmailCampaign.create({
				name: "stewkrfawk",
				campaignId: 1
			})

		} catch (err) {
			console.log("Initialize association failed!");
			console.log(`Err: ${err}`);
		} 
		
	}
}




export default Association;
