#### Command example
https://codebysamgan.com/sequelize-cli-commands

# Client
npx sequelize-cli model:generate --name Client --attributes email:string,phone:string,firstname:string,lastname:string,gender:boolean,birthday:date,avatar:blob,score:integer,address:string,source:string,type:string

# ClientAccout
npx sequelize-cli model:generate --name ClientAccount --attributes username:string, role:string, hashedPassword:string, isRegisterd: boolean, isActive:boolean, language:string

# Employee 
npx sequelize-cli model:generate --name Employee --attributes email:string,phone:string,firstname:string,lastname:string,gender:boolean,birthday:date,avatar:blob, role:string, hashedPassword:string, isActive: boolean, language:string
 
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
npx sequelize-cli model:generate --name ChatMessage --attributes // Thêm thuộc tính cho ChatMessage tại đây




npx sequelize-cli model:generate --name Employee --attributes email:string,phone:string,firstname:string,lastname:string,gender:boolean,birthday:date,avatar:string,language:string,is_active:boolean,username:string,role:string,created_at:date,updated_at:date


npx sequelize-cli model:generate --name Order --attributes status:string,descriptions:string,pre_discount_amount:float,amount:float,num_items:integer,num_completed:integer,shipping_address:string,payment_time:timestamp,payment_method:string,customer_id:integer,voucher_id:integer,table_id:integer,created_at:date,updated_at:date



