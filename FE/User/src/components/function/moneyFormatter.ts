const moneyFormatter = (amount: number) : string => {     
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + "VNĐ";
}      
export default moneyFormatter;