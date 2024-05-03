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
    "Person": {
      key: 1,
      fields: [
        { key: 1, value: "id", label: "Id" },
        { key: 2, value: "Person.firstname", label: "Firstname" },
        { key: 3, value: "Person.lastname", label: "Lastname" },
        { key: 4, value: "Person.email", label: "Email" },
        { key: 5, value: "Person.phone", label: "Phone" },
        { key: 6, value: "Person.gender", label: "gender" },
        { key: 7, value: "Person.source", label: "Source" },
        { key: 8, value: "Person.birthday", label: "Birthday" },
        { key: 9, value: "Person.address", label: "Address" },
        { key: 10, value: "Person.convertDate", label: "convertDate" },
        { key: 11, value: "Person.profit", label: "Profit" },
        { key: 12, value: "Person.total_items", label: "Total items bought" },
        { key: 13, value: "Person.createdAt", label: "CreatedAt" },
        { key: 14, value: "Person.updatedAt", label: "UpdatedAt" },
      ],
    },
  
    "RestaurentInfo": {
      key: 2,
      fields: [
        { key: 1, value: "restaurentInfo.name", label: "Name" },
        { key: 2, value: "restaurentInfo.address", label: "Address" },
        { key: 3, value: "restaurentInfo.email", label: "Email" },
        { key: 4, value: "restaurentInfo.phone", label: "Phone" },
      ],
    },
  
    "Dish": {
      key: 3,
      fields: [
        { key: 1, value: "dish.<replace with dishId>.name", label: "Name" },
        { key: 2, value: "dish.[<replace with dishId>].description", label: "Description" },
        { key: 3, value: "dish.[<replace with dishId>].price", label: "Price" },
        { key: 4, value: "dish.[<replace with dishId>].categoryName", label: "Category name" },
        { key: 5, value: "dish.[<replace with dishId>].createdAt", label: "CreatedAt" },
        { key: 6, value: "dish.[<replace with dishId>].updatedAt", label: "UpdatedAt" },
      ],
    },
  
    "Voucher": {
      key: 4,
      fields: [
        { key: 1, value: "voucher.<replace with voucherID>.name", label: "Name" },
        { key: 2, value: "voucher.<replace with voucherID>.description", label: "Description" },
        { key: 3, value: "voucher.<replace with voucherID>.expirationDate", label: "Expiration Date" },
      ],
    },

    "Order": {
      key: 5,
      fields: [
        { key: 1, value: "Order.newestOrder.status", label: "NewestOrder.status" },
        { key: 2, value: "Order.newestOrder.description", label: "NewestOrder.description" },
        { key: 3, value: "Order.newestOrder.discountAmount", label: "NewestOrder.discountAmount" },
        { key: 4, value: "Order.newestOrder.amount", label: "NewestOrder.amount" },
        { key: 5, value: "Order.newestOrder.num_items", label: "NewestOrder.num_items" },
        { key: 6, value: "Order.newestOrder.shippingAddress", label: "NewestOrder.shippingAddress" },
        { key: 7, value: "Order.newestOrder.shippingCost", label: "NewestOrder.shippingCost" },
        { key: 8, value: "Order.newestOrder.paymentMethod", label: "NewestOrder.paymentMethod" },
        { key: 9, value: "Order.newestOrder.createdAt", label: "NewestOrder.createdAt" },
        { key: 10, value: "Order.newestOrder.updatedAt", label: "NewestOrder.updatedAt" },

        { key: 11, value: "Order.<replace with orderId>.status", label: "<OrderId>.status" },
        { key: 12, value: "Order.<replace with orderId>.description", label: "<OrderId>.description" },
        { key: 13, value: "Order.<replace with orderId>.discountAmount", label: "<OrderId>.discountAmount" },
        { key: 14, value: "Order.<replace with orderId>.amount", label: "<OrderId>.amount" },
        { key: 15, value: "Order.<replace with orderId>.num_items", label: "<OrderId>.num_items" },
        { key: 16, value: "Order.<replace with orderId>.shippingAddress", label: "<OrderId>.shippingAddress" },
        { key: 17, value: "Order.<replace with orderId>.shippingCost", label: "<OrderId>.shippingCost" },
        { key: 18, value: "Order.<replace with orderId>.paymentMethod", label: "<OrderId>.paymentMethod" },
        { key: 19, value: "Order.<replace with orderId>.createdAt", label: "<OrderId>.createdAt" },
        { key: 20, value: "Order.<replace with orderId>.updatedAt", label: "<OrderId>.updatedAt" },
      ],
    },

  };