# Restaurant Management System (RMS)
This is project which we work in our Capstone Project 2024.

## Description
- <p align="justify"> One of the main motivations for us to pursue this topic is the recognition that the restaurant industry depends heavily on customer satisfaction and loyalty levels. In a competitive market, building strong relationships with customers and providing a personalized experience is very important. Besides, model Customer Relationship Management (CRM) provides processes for engagement and satisfaction customers effectively. By implementing the system with the CRM model designed specifically for the restaurant industry, we aim for a system that enable restaurant managers to collect, analyze customer data, build campaigns to attract customers and tailor their services to meet individual needs. Thanks for this approach, we can improve customer satisfaction, increase customer loyalty and ultimately better business results </p>
- <p align="justify"> Moreover, most CRM systems today do not take advantage of customer data in customer segmentation. In particular, manual classification is also very time consuming and does not guarantee accuracy. Therefore, applying data mining techniques will make this job easier and more effective. Thereby, restaurants can personalize the user experience. </p>
- <p align="justify"> In addition, we also recognize the importance of effective communication and coordination between restaurant staff. From customer services to operations behind the counter, effective coordination is key to delivering a seamless dining experience. As a result, this reduces restaurant operations errors and improves customer satisfaction. </p>

## Tech stack
- Front-end: NextJS, Ant Design, TailwindCSS
- Back-end: NodeJS, Flask, Scikit-learn
- Database management system: PostgreSQL

## Final result <br />
This is a comprehensive view about our system ![loading](https://github.com/nguyen-huu-luong/RMS/assets/80337518/3a7c643d-791d-4cf9-890e-d8bab0aafd13)
<br /> 
We implement three websites. The first one is a sale website for customers, the second one is a management website for restaurant staff and the other is a cooking website for chefs. 

- In the sale website, customers can login, register, view dishes, view product recommendation, interact with restaurant staff, manage personal information, order and manage orders.
- In the management website, restaurant employees can view statistical report, manage customer, manage lead, manage employees, manage and perform marketing campaign, manage reservation with POS feature, support customers via chat chanels and manage restaurant resources such as: vouchers, products.
- In the cooking website, chefs can view orders and update status for dishes.

## Source code guideline 
### Installation <br />
You can download the source code at [here](https://github.com/nguyen-huu-luong/RMS.git)
### Starting application <br />
This project includes four servers: front-end server on customer side, front-end server on staff side, back-end server for restaurant features, AI server for customer segmentation feature.
#### Front-end server on customer side
1. Go to source code by this command:
```
cd \RMS\FE\User\
```
2. Start this server by using one of two commands
- Run with npm 
```
npm run dev
```
- Run with docker
```
docker build -t fe_customer .
docker run -p 3001:3001 fe_customer
```

#### Front-end server on staff side
1. Go to source code by this command:
```
cd \RMS\FE\Admin\
```
2. Start this server by using one of two commands
- Run with npm 
```
npm run dev
```
- Run with docker
```
docker build -t fe_staff .
docker run -p 3000:3000 fe_staff
```
#### Back-end server
1. Go to source code by this command:
```
cd \RMS\BE\Internal\
```
2. Start this server by using one of two commands
- Run with npm 
```
npm start
```
- Run with docker
```
docker build -t be_internal .
docker run -p 3003:3003 be_internal
```

#### AI server
1. Go to source code by this command:
```
cd \RMS\BE\External\ 
```
2. Start this server by using one of two commands
- Run with python
```
python app.py
```
- Run with docker
```
docker build -t be_external .
docker run -p 8080:8080 be_external
```

## Authors
1. Nguyen Huu Hung
2. Nguyen Huu Luong
3. Lieu Minh Vuong

## Version History

* 0.2
    * Various bug fixes and optimizations
    * See [commit change](https://github.com/nguyen-huu-luong/RMS/commits/master) or See [release history](https://github.com/nguyen-huu-luong/RMS/commits/master)
* 0.1
    * Initial Release