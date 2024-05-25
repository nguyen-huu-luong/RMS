import { ErrorName, HttpStatusCode } from "../Constants";
import { container, mailler } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IClientRepository } from "../Repositories/IClientRepository";
import { IOrderRepository } from "../Repositories/IOrderRepository";
import { CustomError, RecordNotFoundError } from "../Errors";
import mjml2html from "mjml";
import mustache from "mustache";
import { ITrackUrlRepository } from "../Repositories/IITrackUrlRepository";
import { IProductRepository, IVoucherRepository } from "../Repositories";

const backend_api = `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/api`;

export interface IEmailMessage {
    from: string;
    to: string;
    subject: string;
    html: string;
    type?: string;
}

const jsonToXML = ({ tagName, attributes, children, content }: any) => {
    const subNode =
        children && children.length > 0
            ? children.map(jsonToXML).join("\n")
            : content || "";

    const stringAttrs = Object.keys(attributes)
        .map((attr) => `${attr}="${attributes[attr]}"`)
        .join(" ");

    return `<${tagName}${stringAttrs === "" ? ">" : ` ${stringAttrs}>`
        }${subNode}</${tagName}>`;
};

const restaurentInfo: {
    [key: string]: string;
} = {
    restaurentInfo_name: "BkFood",
    restaurentInfo_address: "Thu Duc, Ho Chi Minh",
    restaurentInfo_phone: "09423484423",
    restaurentInfo_email: "homecruise.rms@gmail.com",
};

export class EmailService {
    constructor(
        private clientRepository = container.get<IClientRepository>(
            TYPES.IClientRepository
        ),
        private orderRepository = container.get<IOrderRepository>(
            TYPES.IOrderRepository
        ),
        private trackUrlRepository = container.get<ITrackUrlRepository>(
            TYPES.ITrackUrlRepository
        ),
        private productRepository = container.get<IProductRepository>(
            TYPES.IProductRepository
        ),
        private voucherRepository = container.get<IVoucherRepository>(
            TYPES.IVoucherRepository
        )
    ) { }

    private getMergeField = (xmlEmail: string, type?: string) => {
        let regex = /\{\{([^{}]+)\}\}/g;
        let match;

        // Mảng để lưu trữ các nội dung trong các ký hiệu `{{ }}`
        const matches = [];

        // Handle `{{ }}`
        while ((match = regex.exec(xmlEmail)) !== null) {
            // match[1] chứa nội dung nằm giữa cặp ký hiệu `{{` và `}}`
            let text = match[1];
            matches.push(text.split(".")); // Lưu  dưới dang  array  với  arr[0] là tên record
            // arr[1] là id cần tìm hoặc  trường cần tìm
            // arr[2] nếu  có là tên trường  cần  tim
            // merge  field   giả sử  chỉ có 3 pt là tối đa
        }

        return matches;
    };

    private getTrackUrls = (xmlEmail: string) => {
        let regex = /\[\[([^{}]+)\]\]/g;
        let match;

        const matches = [];
        while ((match = regex.exec(xmlEmail)) !== null) {
            matches.push(match[1]);
        }

        return matches;
    };

    private handleEmailContent = async (message: IEmailMessage) => {
        const { html, type } = message;
        let xmlEmail = message.html;
        if (type === "mjml") {
            const emailData = JSON.parse(html);
            // console.log(emailData)
            const withHtml = {
                tagName: "mjml",
                attributes: {},
                children: [emailData],
            };
            xmlEmail = jsonToXML(withHtml);
        }

        const trackUrls: string[] = this.getTrackUrls(xmlEmail);
        const mergeFields: string[][] = this.getMergeField(xmlEmail);
        const dataReplace: { [key: string]: string } = {};

        // handle trackurl
        for (let field of trackUrls) {
            const pareFields = field.split(":");
            if (pareFields[0] === "trackUrl") {
                const trackUrl = await this.trackUrlRepository.findByCode(
                    pareFields[1]
                );
                console.log(trackUrl);
                if (trackUrl) {
                    xmlEmail = xmlEmail.replace(
                        `{{${field}}}`,
                        `{{${trackUrl.codeToInsert}}}`
                    );
                    dataReplace[
                        trackUrl.codeToInsert
                    ] = `${backend_api}/track/url?email=${message.to}&campaignId=${trackUrl.campaignId}&redirectUrl=${trackUrl.redirectUrl}`;
                }
            }
        }

        // handle  merge fields
        let customerInstance = await this.clientRepository.findByEmail(message.to);
        if (!customerInstance) return false;

        let orderInstances: { [key: string]: any } = {};
        let voucherInstances: { [key: string]: any } = {};
        let dishInstances: { [key: string]: any } = {};
        for (let arrayData of mergeFields) {
            let oldField = arrayData.join(".");
            let newField = arrayData.join("_");
            if (arrayData.length === 2) {
                switch (arrayData[0]) {
                    case "restaurentInfo":
                        newField = arrayData.join("_");
                        xmlEmail = xmlEmail.replace(`{{${oldField}}}`, `{{${newField}}}`);
                        dataReplace[newField] = restaurentInfo[newField];
                        break;
                    case "Person":
                        let personField = arrayData[1];
                        xmlEmail = xmlEmail.replace(`{{${oldField}}}`, `{{${newField}}}`);
                        dataReplace[newField] =
                            customerInstance.getDataValue(personField) || "Không xác định";
                    default:
                        break;
                }
            } else if (arrayData.length === 3) {
                switch (arrayData[0].toLocaleLowerCase()) {
                    case "order":
                        let orderId = arrayData[1];
                        if (!orderInstances[orderId]) {
                            orderInstances[orderId] =
                                orderId !== "newestOrder"
                                    ? await this.orderRepository.getOne(
                                        customerInstance.id,
                                        Number(orderId)
                                    )
                                    : await this.orderRepository.getNewestOrder(
                                        customerInstance.id
                                    );
                            if (!orderInstances[orderId]) {
                                orderInstances[orderId] = "Unknown";
                            }
                        }
                        if (
                            orderInstances[orderId] &&
                            orderInstances[orderId] !== "Unknown"
                        ) {
                            xmlEmail = xmlEmail.replace(`{{${oldField}}}`, `{{${newField}}}`);
                            dataReplace[newField] =
                                orderInstances[orderId].getDataValue(arrayData[2]) ||
                                "_";
                        } else {
                            xmlEmail = xmlEmail.replace(`{{${oldField}}}`, `{{${newField}}}`);
                            dataReplace[newField] = "Không xác định";
                        }
                        break;
                    case "dish":
                        let dishId = arrayData[1];
                        if (!dishInstances[dishId]) {
                            dishInstances[dishId] = await this.productRepository.getOne(
                                dishId
                            );
                            if (!dishInstances[dishId]) {
                                dishInstances[dishId] = "Unknown";
                            }
                        }

                        if (dishInstances[dishId] && dishInstances[dishId] !== "Unknown") {
                            xmlEmail = xmlEmail.replace(`{{${oldField}}}`, `{{${newField}}}`);
                            dataReplace[newField] =
                                dishInstances[dishId].getDataValue(arrayData[2]) ||
                                "Không xác định";
                        } else {
                            xmlEmail = xmlEmail.replace(`{{${oldField}}}`, `{{${newField}}}`);
                            dataReplace[newField] = "Không xác định";
                        }
                        break;
                    case "voucher":
                        let voucherId = arrayData[1];
                        if (!voucherInstances[voucherId]) {
                            voucherInstances[voucherId] =
                                await this.voucherRepository.getById(Number(voucherId));
                            if (!voucherInstances[voucherId]) {
                                voucherInstances[voucherId] = "Unknown";
                            }
                        }

                        if (
                            voucherInstances[voucherId] &&
                            voucherInstances[voucherId] !== "Unknown"
                        ) {
                            xmlEmail = xmlEmail.replace(`{{${oldField}}}`, `{{${newField}}}`);
                            dataReplace[newField] =
                                voucherInstances[voucherId].getDataValue(arrayData[2]) ||
                                "Không xác định";
                        }

                        break;

                    default:
                        break;
                }
            }
        }

        console.log(dataReplace);

        return mustache.render(xmlEmail, dataReplace);
    };

    public async sendEmail(message: IEmailMessage, campaignId?: number) {
        const { html, type } = message;

        try {
            const newHtml = await this.handleEmailContent(message) 

            if (!newHtml) {
                return false
            }
    
            let imgTag = ""
            if (campaignId) {
                const imgSrc = `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT
                    }/api/track/email/image.png?email=${encodeURIComponent(
                        message.to
                    )}&campaign=${campaignId}`;
                imgTag = `<img src="${imgSrc}" style="display: none"/>`;
            }
    
    
            if (type === "mjml") {
                return await mailler.sendEmail({
                    ...message,
                    html: `${mjml2html(newHtml).html}\n${imgTag}`,
                });
            }
            const result = await mailler.sendEmail({ ...message, html: newHtml });
            return true;
            
        } catch (error) {
            console.log(error)
        }
    }
}
