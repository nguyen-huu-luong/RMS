

const SegmentationChart = ({ option }: { option: any }) => {

    return (
        <div className='flex flex-col gap-2 justify-start w-full shadow-md h-auto rounded-xl bg-white'>
            <div className='p-7 font-bold text-xl text-black flex flex-row justify-between items-center w-full h-auto bg-white rounded-xl -mb-5'>
                <span>Segmentation Chart</span>
            </div>
            <div>
                Nhập content của segmentation chart ở đây
            </div>
        </div>
    );
};

export default SegmentationChart;
