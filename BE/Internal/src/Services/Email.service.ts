import { ErrorName, HttpStatusCode } from "../Constants";
import { container, mailler } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IClientRepository } from "../Repositories/IClientRepository";
import { IOrderRepository } from "../Repositories/IOrderRepository";
import { CustomError, RecordNotFoundError } from "../Errors";
import mjml2html from "mjml";
import mustache from "mustache";
import { ITrackUrlRepository } from "../Repositories/IITrackUrlRepository";

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

export class EmailService {
    constructor(
        private clientRepository = container.get<IClientRepository>(
            TYPES.IClientRepository
        ),
        private orderRepository = container.get<IOrderRepository>(
            TYPES.IOrderRepository
        ),
        private trackUrlRepository = container.get<ITrackUrlRepository>(TYPES.ITrackUrlRepository)
    ) { }

    private getMergeField = (xmlEmail: string) => {
        const regex = /\{\{([^{}]+)\}\}/g;
        let match;

        // Mảng để lưu trữ các nội dung trong các ký hiệu `{{ }}`
        const matches = [];

        // Lặp qua các kết quả khớp từ biểu thức chính quy
        while ((match = regex.exec(xmlEmail)) !== null) {
            // match[1] chứa nội dung nằm giữa cặp ký hiệu `{{` và `}}`
            matches.push(match[1]);
        }

        return matches;
    };

    public async sendEmail(message: IEmailMessage, campaignId?: number) {
        const { html, type } = message;

        if (type === "mjml") {
            const emailData = JSON.parse(html);

            // console.log(emailData)
            const withHtml = {
                tagName: "mjml",
                attributes: {},
                children: [emailData],
            };
            let xmlEmail = jsonToXML(withHtml);
            
            // console.log(xmlEmail)
            const client = await this.clientRepository.findByEmail(message.to);
            if (!client) {
                throw new RecordNotFoundError("Customer not found!");
            }
            
            const mergeFields: string[] = this.getMergeField(xmlEmail) 
            const dataReplace: {[key:string]: string} = {}
            for (let field of mergeFields) {
                const pareFields = field.split(":")
                if (pareFields[0] === "trackUrl") {
                    const trackUrl = await this.trackUrlRepository.findByCode(pareFields[1])
                    console.log(trackUrl)
                    if (trackUrl) {
                        xmlEmail = xmlEmail.replace(`{{${field}}}`,`{{${trackUrl.codeToInsert}}}`) ;
                        dataReplace[ trackUrl.codeToInsert] = 
                            `${process.env.BACK_END_URL}/api/track/url?email=${message.to}&campaignId=${trackUrl.campaignId}&redirectUrl=${trackUrl.redirectUrl}`
                    }
                }
            }

            console.log(dataReplace)


            const renderedMJML = mustache.render(xmlEmail, dataReplace);

            const imgSrc = `http://localhost:3003/api/track/email?email=${encodeURIComponent(
                message.to
            )}&campaign=${campaignId}`;
            const script = `<script>function onLoad() { var xhr = new XMLHttpRequest(); xhr.open("GET", "${imgSrc}", true); xhr.onload = function () { if (xhr.status >= 200 && xhr.status < 300) { console.log("API call successful"); } else { console.error("API call failed with status code: " + xhr.status); } }; xhr.onerror = function () { console.error("API call failed"); }; xhr.send(); }</script>`;
            const imgTag = `<img src="${imgSrc}" style="display:none;" onload="onLoad()">`;
            const finalHtml = `${renderedMJML}\n${imgTag}`;

            return await mailler.sendEmail({
                ...message,
                html: `${mjml2html(renderedMJML).html}\n${imgTag}`,
            });
        } else {
            const result = await mailler.sendEmail({ ...message, html });
    
            return result;
        }
    }
}
