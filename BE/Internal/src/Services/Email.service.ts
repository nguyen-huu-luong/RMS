import { ErrorName, HttpStatusCode } from "../Constants";
import { container, mailler } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IClientRepository } from "../Repositories/IClientRepository";
import { IOrderRepository } from "../Repositories/IOrderRepository";
import { CustomError, RecordNotFoundError } from "../Errors";
import mjml2html from "mjml";
import mustache from "mustache";

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
        )
    ) { }

    public async sendEmail(message: IEmailMessage, campaignId?: number) {
        const { html, type } = message;

        if (type === "mjml") {
            const emailData = JSON.parse(html);
            

            console.log(emailData)
            const withHtml = {
                tagName: "mjml",
                attributes: {},
                children: [emailData],
            };
            const xmlEmail = jsonToXML(withHtml)
            // console.log(xmlEmail)
            const client = await this.clientRepository.findByEmail(message.to)
            if (!client) {
                throw new RecordNotFoundError("Customer not found!")
            } 

            // const pattern = /\{\{(.+?)\}\}/g

            // const mergeFields = ["ffafds"];
            // let match;

            // while ((match = pattern.exec(xmlEmail)) !== null) {
            //     mergeFields.push(match[1]);
            // }

            // console.log("params", mergeFields)

            const renderedMJML = mustache.render(xmlEmail, client);

            const imgSrc = `http://localhost:3003/api/track/email?email=${encodeURIComponent(message.to)}&campaign=${campaignId}`;
            const script = `<script>function onLoad() { var xhr = new XMLHttpRequest(); xhr.open("GET", "${imgSrc}", true); xhr.onload = function () { if (xhr.status >= 200 && xhr.status < 300) { console.log("API call successful"); } else { console.error("API call failed with status code: " + xhr.status); } }; xhr.onerror = function () { console.error("API call failed"); }; xhr.send(); }</script>`;
            const imgTag = `<img src="${imgSrc}" style="display:none;" onload="onLoad()">`;
            const finalHtml = `${renderedMJML}\n${imgTag}`;

            return await mailler.sendEmail({
                ...message,
                html: `${mjml2html(renderedMJML).html}\n${imgTag}`,
            });
        }
        const result = await mailler.sendEmail({ ...message, html });

        return result;
    }
}
