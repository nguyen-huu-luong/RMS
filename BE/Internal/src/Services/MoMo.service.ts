import { Request, Response, NextFunction } from "express";
import * as dotenv from 'dotenv';
import { ICartRepository, IClientRepository } from "../Repositories";
import { container } from "../Configs";
import { TYPES } from "../Types/type";

dotenv.config();

export class MoMoService {
    constructor(
        private cartRepository = container.get<ICartRepository>(
            TYPES.ICartRepository
        ),
        private clientRepository = container.get<IClientRepository>(
            TYPES.IClientRepository
        )
    ) {}

    public async payWithMethod(req: Request, res: Response, next: NextFunction) {
        const cart = await this.cartRepository.getCart(req.userId);
        const user = await this.clientRepository.findById(req.userId);
        const uid = {"userId": req.userId}
        const data = JSON.stringify({...req.body, ...uid})
        const fullname = user.firstname + " " + user.lastname
        var accessKey = 'F8BBA842ECF85';
        var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        var orderInfo = `MOMO thanh toan ho cho khach hang ${fullname}`;
        var partnerCode = 'MOMO';
        var partnerName = "Home Cuisine"
        var redirectUrl = `http://${process.env.USER_HOST}:${process.env.USER_PORT}/en/payment?method=MOMO`;
        var ipnUrl = `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/api/order/momo`;
        var requestType = "payWithMethod";
        var amount = req.body["discountAmount"];
        
        if (req.body["voucherId"] === 0) {
            amount = cart.amount + req.body["shippingCost"]
        }

        var orderId = partnerCode + req.userId  + new Date().getTime();
        var requestId = orderId;
        var extraData = Buffer.from(data).toString('base64');
        var orderGroupId = '';
        var autoCapture = true;
        var lang = 'vi';
        var userInfo = {"name": fullname}
    
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode +  "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        const crypto = require('crypto');
        var signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
    
        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: partnerName,
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature,
            userInfo: userInfo
        });
        //Create the HTTPS objects
        const https = require('https');
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: `/v2/gateway/api/create?ipnUrl=${ipnUrl}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }

        if (amount <= 0) {
            res.send({
                "payUrl": `http://${process.env.USER_HOST}:${process.env.USER_PORT}/en/payment?method=MOMO&resultCode=0&extraData=${extraData}`
            })
            return 
        }

        //Send the request and get the response
        const req_payment = https.request(options, (res_payment:any) => {
            res_payment.setEncoding('utf8');
            res_payment.on('data', (body:any) => {
                res.send(body)
            });
            res_payment.on('end', () => {
                console.log('No more data in response.');
            });
        })
    
        req_payment.on('error', (e:any) => {
            console.log(`problem with request: ${e.message}`);
        });
        // write data to request body
        req_payment.write(requestBody);
        req_payment.end();
    }

    public async captureWallet(req: Request, res: Response, next: NextFunction) {
        const table_id = Number(req.params.id);
        const fullname = req.body.firstname + " " + req.body.lastname
        const data = JSON.stringify(req.body)
        let table_cart = await this.cartRepository.getCartTable(Number(table_id))
        var partnerCode = "MOMO";
        var accessKey = "F8BBA842ECF85";
        var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        var requestId = partnerCode + new Date().getTime();
        var orderId = requestId;
        var orderInfo = `MOMO thanh toan ho cho khach hang ${fullname}`;
        var redirectUrl = `http://${process.env.ADMIN_HOST}:${process.env.ADMIN_PORT}/en/sale/reservations/payment?method=MOMO&tid=${table_id}`;
        var ipnUrl =  `http://${process.env.ADMIN_HOST}:${process.env.ADMIN_PORT}/en/sale/reservations/payment?method=MOMO&tid=${table_id}`;
        var extraData = Buffer.from(data).toString('base64');
        var amount = table_cart.amount;
        var requestType = "captureWallet"
        
        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
        //signature
        const crypto = require('crypto');
        var signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');
        
        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode : partnerCode,
            accessKey : accessKey,
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            extraData : extraData,
            requestType : requestType,
            signature : signature,
            lang: 'en'
        });
        //Create the HTTPS objects
        const https = require('https');
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }
        //Send the request and get the response
        const req_payment = https.request(options, (res_payment: any) => {
            res_payment.setEncoding('utf8');
            res_payment.on('data', (body: any) => {
                res.send(body)
            });
            res_payment.on('end', () => {
                console.log('No more data in response.');
            });
        })
        
        req_payment.on('error', (e: any) => {
            console.log(`problem with request: ${e.message}`);
        });

        req_payment.write(requestBody);
        req_payment.end();
    } 
}

export default MoMoService