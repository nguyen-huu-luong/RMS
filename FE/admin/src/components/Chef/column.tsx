import Item from "@/components/Chef/item";
const colors: string[] = [
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "teal",
    "indigo",
    "purple",
    "cyan",
];

const bgClasses: string[] = colors.map((color) => `bg-${color}-500`);

function Column({
    name,
    items,
    token,
    refetch,
    orders,
    doneItems,
    preparingItems,
    cookingItems,
}: {
    name: string;
    items: any;
    token: any;
    refetch: any;
    orders: any;
    doneItems: any;
    preparingItems: any;
    cookingItems: any;
}) {
    return (
        <div className='flex flex-col gap-2 justify-start w-full'>
            <div className='p-7 pt-3 font-bold text-xl text-black flex flex-row justify-between items-center w-full h-auto bg-white rounded-xl -mb-5'>
                <span>{name}</span>
                <span className='bg-slate-200 text-black w-8 h-8 rounded-full p-1 text-sm items-center flex flex-row justify-center'>
                    {items.length}
                </span>
            </div>
            <div className='flex flex-col justify-start gap-2 p-7 pt-3 bg-white rounded-xl w-full overflow-y-auto h-full'>
                {items.map((item: any) => (
                    <Item
                        key={item.id + " " + item.OrderItem.orderId}
                        item={item}
                        color={
                            bgClasses[item.OrderItem.orderId % bgClasses.length]
                        }
                        token={token}
                        refetch={refetch}
                        orders={orders}
                        doneItems={doneItems}
                        cookingItems={cookingItems}
                        preparingItems={preparingItems}
                    />
                ))}
            </div>
        </div>
    );
}
export default Column;
