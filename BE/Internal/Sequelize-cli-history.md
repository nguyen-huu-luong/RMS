#### Command example
https://codebysamgan.com/sequelize-cli-commands

# Client
npx sequelize-cli model:generate --name Client --attributes email:string,phone:string,firstname:string,lastname:string,gender:boolean,birthday:date,avatar:blob,score:integer,address:string,source:string,type:string

# ClientAccout
npx sequelize-cli model:generate --name ClientAccount --attributes username:string,role:string, hashedPassword:string,isRegisterd:boolean,isActive:boolean,language:string

# Employee 
npx sequelize-cli model:generate --name Employee --attributes email:string,phone:string,firstname:string,lastname:string,gender:boolean,birthday:date,avatar:blob,role:string, hashedPassword:string,isActive:boolean,language:string
 
# Order
npx sequelize-cli model:generate --name Order --attributes status:string,descriptions:string,discountAmount:float,amount:float,num_items:integer,shippingAddress:string,paymentMethod:string

# Product
npx sequelize-cli model:generate --name Product --attributes name:string,description:string,price:float,thumbnails:blob

# Cart
npx sequelize-cli model:generate --name Cart --attributes total:float,amount:float

# MessageTemplate
npx sequelize-cli model:generate --name MessageTemplate --attributes name:string,content:string,type:string,created_user_id:integer,created_at:date,updated_at:date

# Campaign
npx sequelize-cli model:generate --name Table --attributes name:string,status:string,capacity:integer,floor:integer,num_reserved:integer,created_at:date,updated_at:date

# Table
npx sequelize-cli model:generate --name Table --attributes name:string,status:string,capacity:integer,floor:integer,num_reserved:integer,created_at:date,updated_at:date

# Reservation
npx sequelize-cli model:generate --name Reservation --attributes num_of_customer:integer,status:string,date_to:date,description:string,table_id:integer,user_id:integer,created_at:date,updated_at:date


# TargetList
npx sequelize-cli model:generate --name TargetList --attributes name:string,description:string,create_user_id:integer,created_at:date,updated_at:date

# ChatSession
npx sequelize-cli model:generate --name ChatMessage --attributes // Thêm thuộc tính cho ChatMessage tại đây

# ChatMessage
npx sequelize-cli model:generate --name ChatMessage --attributes 

# EmailCampaign
npx sequelize-cli model:generate --name EmailCampaign --attributes name:string,status:string,startDate:date,subject:string,sendFrom:string,sendTo:string

# Category
npx sequelize-cli model:generate --name Category --attributes name:string,description:string,thumnails:blob

###### Association

# Client has many order
npx sequelize-cli migration:generate --name add-client-id-to-orders

# Client has one cart
npx sequelize-cli migration:generate --name add-client-id-to-carts


# Employee create many Client
npx sequelize-cli migration:generate --name add-creator-id-to-clients

# Target list vs Client (M:N)
npx sequelize-cli migration:generate --name add-client-targetList-association


# Target list vs Campaign (M:N)
npx sequelize-cli migration:generate --name add-campaign-targetList-association

# Campaign has many EmailCampaign (1:N)
npx sequelize-cli migration:generate --name add-campaignId-to-email-campaign

# Cart vs Product (M:N) --> CartItems
npx sequelize-cli migration:generate --name add-cart-product-association


# Order vs Product (M:N) --> OrderItem
npx sequelize-cli migration:generate --name add-order-product-association

# A client has many reservations
npx sequelize-cli migration:generate --name add-clientId-to-reservation

# An employee creates many reservations
npx sequelize-cli migration:generate --name add-employeeID-to-reservation

# Reservation vs Table (M:N)
npx sequelize-cli migration:generate --name add-reservation-table-association

# Table vs Order (M:N)
npx sequelize-cli migration:generate --name add-table-order-association

# Client has many ChatSession (1:N)
npx sequelize-cli migration:generate --name add-client-id-to-chat-session

# Employee has many ChatSession (1:N)
npx sequelize-cli migration:generate --name add-employee-id-to-chat-session

# Chatsession has many ChatMessage (1:N)
npx sequelize-cli migration:generate --name add-session-id-to-chat-message

# Category has many Product (1:N)
npx sequelize-cli migration:generate --name add-category-id-to-product
### Update:
# 12/11/2023
- Delete ClientAccout
- Not using AdminAccount
- Merge Account attributes to Client, Employee
