export interface IMergeFieldData {
    [category: string]: {
      key: number;
      fields: {
        key: number;
        value: string;
        label: string;
      }[];
    };
  }
export const mergeFieldData: IMergeFieldData = {
    "customer": {
      key: 1,
      fields: [
        { key: 8, value: "id", label: "Id" },
        { key: 1, value: "firstname", label: "Firstname" },
        { key: 2, value: "lastname", label: "Lastname" },
        { key: 3, value: "customer", label: "Fullname" },
        { key: 4, value: "email", label: "Email" },
        { key: 5, value: "phone", label: "Phone" },
        { key: 6, value: "address", label: "Address" },
        { key: 7, value: "birthday", label: "Birthday" },
      ],
    },
  
    "order": {
      key: 2,
      fields: [
        { key: 1, value: "order.id", label: "Id" },
        { key: 2, value: "order.orderedDate", label: "Ordered Date" },
        { key: 3, value: "order.email", label: "Email" },
        { key: 4, value: "order.phone", label: "Phone" },
        { key: 5, value: "order.address", label: "Address" },
        { key: 6, value: "order.birthday", label: "Birthday" },
      ],
    },
  
    "dish": {
      key: 3,
      fields: [
        { key: 1, value: "dish.name", label: "Name" },
        { key: 2, value: "dish.description", label: "Description" },
        { key: 3, value: "dish.price", label: "Price" },
      ],
    },
  
    "voucher": {
      key: 4,
      fields: [
        { key: 1, value: "voucher.code", label: "Code" },
        { key: 2, value: "voucher.discount", label: "Discount" },
        { key: 3, value: "voucher.expirationDate", label: "Expiration Date" },
      ],
    },
  
    "campaign": {
      key: 5,
      fields: [
        { key: 1, value: "campaign.name", label: "Name" },
        { key: 2, value: "campaign.description", label: "Description" },
        { key: 3, value: "campaign.startDate", label: "Start Date" },
        { key: 4, value: "campaign.endDate", label: "End Date" },
      ],
    },
  };