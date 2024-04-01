import { Button, Checkbox, Col, Flex, Image, Popover, Radio, Row, Space } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { createApi } from "unsplash-js";
import { search } from "unsplash-js/dist/internals";


export interface IUnsplashModel {
    onSelectImage: (url: string) => void
}
export const UnsplashModel: React.FC<IUnsplashModel> = ({ onSelectImage }) => {
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKey, setSearchKey] = useState("")
    const [selectedImageKey, setSelectedImageKey] = useState(-1)

    useEffect(() => {
        async function fetchImages() {
            await findImages(searchKey);
        }

        fetchImages();
    }, [searchKey]);

    const unsplash = createApi({
        accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API || ""
    });

    const findImages = async (value = "food") => {
        setLoading(true);
        console.log("Finding images")
        const images: any = await unsplash.search.getPhotos({
            query: value || "food",
            page: currentPage,
            perPage: 10,
            orientation: "landscape"
        });

        console.log(images)

        setImages(images.response.results);
        setLoading(false);
    };


    const loadMoreImages = async () => {
        setLoading(true);
        const imagesSet: any = await unsplash.search.getPhotos({
            query: searchKey || "food",
            page: currentPage + 1,
            perPage: 10,
            orientation: "landscape"
        });

        setCurrentPage(currentPage + 1);

        const response = imagesSet.response.results;

        const sumAllImages = images.concat(response);
        setImages(sumAllImages);

        setLoading(false);
    };

    const handleClickImage = async (imageUrl: any, key: number) => {
        console.log(imageUrl)
        setSelectedImageKey(key === selectedImageKey ? -1 : key)
        onSelectImage(imageUrl.regular)
    }

    const onSearchImage = (value: string) => {
        console.log(value)
        setSearchKey(value)
    }

    return (
        <Space direction="vertical">
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearchImage}
            />
            <Space wrap>
                {images.map((item: any, index: number) => (
                    <Popover
                        key={index}
                        content={<Image width={300} src={item.urls.regular} />}
                        title="Image Preview"
                        trigger="hover"
                    >
                        <Space className="relative">
                            <Image
                                width={100}
                                src={item.urls.small} alt="Preview"
                                preview={false}
                                onClick={() => handleClickImage(item.urls, index)}
                            />
                            <Checkbox 
                                onChange={() => handleClickImage(item.urls, index)} 
                                name={`image-selected-${index}`} 
                                checked={selectedImageKey === index} 
                                className="absolute top-0 left-0 m-1"
                                style={{opacity: selectedImageKey === index ? 1 : 0.4}}
                                
                            />
                        </Space>
                    </Popover>
                ))}
            </Space>

            <div>
                <Button onClick={loadMoreImages}>Load more...</Button>
            </div>
        </Space>
    )
}