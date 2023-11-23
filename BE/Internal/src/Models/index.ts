import Association from "./Associations";
import Loader from "../Loaders";
import Cart from "./Cart";

class Tables {
    public async createTables() {
        try {
            await Association.initialize();
            // await Loader.sequelize.sync({alter: true});
        }
        catch (err) {
            console.log("Create all tables failed!");
            console.log(`Err: ${err}`);
        }
    }
}

export default Tables;

export {default as Cart} from './Cart'
export {default as CartItem} from './CartItem'
export {default as Campaign} from './Campaign'
export {default as CampaignTargetList} from './CampaignTargetList'
export {default as Client} from './Client'
export {default as ChatSession} from './ChatSession'
export {default as ChatMessage} from './ChatMessage'
export {default as Employee} from './Employee'
export {default as ClientTargetList} from './ClientTargetList'
export {default as EmailCampaign} from './EmailCampaign'
export {default as Messagetemplate} from './Messagetemplate'
export {default as Order} from './Order'
export {default as OrderItem} from './OrderItem'
export {default as Product} from './Product'
export {default as Reservation} from './Reservation'
export {default as Table} from './Table'
export {default as Targetlist} from './Targetlist'
export {default as TableOrder} from './TableOrder'
export {default as TableReservation} from './TableReservation'
export {default as Permission} from './Permission'
export {default as Category} from './Category'