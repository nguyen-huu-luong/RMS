import {
    ExclamationCircleOutlined,
    FileImageOutlined,
    SendOutlined,
} from "@ant-design/icons";
import TimeStamp from "./Timestamp";
import Message from "./Message";
import Status from "./Status";
import { useState, useEffect, useCallback, useRef } from "react";
import moment from "moment";
import fetchClient from "@/lib/fetch-client";
import {
    Button,
    Drawer,
    Space,
    Spin,
    Upload,
    UploadProps,
    message,
} from "antd";
import Loading from "../loading";
import { variables } from "@/app";
import { useRouter } from "next-intl/client";
import { useForm } from "antd/es/form/Form";
import { AxiosError } from "axios";
import { uploadImage } from "@/app/api/upload";
import { CreateNewLeadForm } from "../Lead/AddLeadForm";
import { useSession } from "next-auth/react";
import SendStatus from "./send_status";

const ChatBox = ({
    channel,
    setChannel,
    socket,
    setIndex,
    index,
}: {
    channel: any;
    setChannel: any;
    socket: any;
    setIndex: any;
    index: any;
}) => {
    const { data: session, status } = useSession();
    const [value, setValue] = useState("");
    const [sending, setSending] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const [inputFocused, setInputFocused] = useState(false);
    const [action, setAction] = useState<string>("Default");
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
    const [initial, setInitial] = useState<boolean>(false);
    const router = useRouter();
    const [form_create] = useForm();
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    //CREATE LEAD
    const handleCreateLead = async (values: any) => {
        try {
            const result = await fetchClient({
                method: "POST",
                url: "/customers",
                body: {
                    data: {
                        ...values,
                        convertDate: new Date(),
                        type: "lead",
                    },
                },
            });
            onClose();
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    const { code, name, message } = error?.response.data;
                    if (name === "Conflict") {
                        form_create.setFields([
                            { name: "email", errors: ["Email đã tồn tại"] },
                        ]);
                    }
                }
                throw error;
            } else {
                message.error("Đã xãy ra lỗi");
                throw error;
            }
        }
    };

    const handleSubmit = async () => {
        try {
            form_create.submit();
        } catch (error) {
            message.error("Đã xãy ra lỗi");
            throw error;
        }
    };

    // HANDLE SCROLL TO BOTTOM
    const scrollToBottom = () => {
        const container = messageContainerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const fetchedData = await fetchClient({
                url: `/channels/messages/admin?channelId=${channel}&index=${
                    !index ? 1 : index
                }`,
                data_return: true,
            });
            if (index == 1) {
                setData(fetchedData);
            } else {
                setData((prevData: any) => ({
                    ...prevData,
                    message: [...fetchedData.message, ...prevData.message],
                }));
            }
            setIsAllLoaded(fetchedData.isAll);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
            setInitial(true);
        }
    }, [channel, index]);

    useEffect(() => {
        fetchData();
    }, [index, channel]);

    useEffect(() => {
        form_create.resetFields();
        onClose();
    }, [channel]);

    useEffect(() => {
        setLoading(false);
        setIsAllLoaded(false);
        setInitial(false);
        setValue("");

        setTimeout(() => scrollToBottom(), 1000);
    }, [channel]);

    useEffect(() => {
        setTimeout(() => scrollToBottom(), 1000);
    }, [channel]);
    useEffect(() => {
        const handleNewMessage = (
            channelId: any,
            message: string,
            clientId: string
        ) => {
            if (channelId == channel) {
                setData((prevData: any) => ({
                    ...prevData,
                    message: [
                        ...prevData.message,
                        {
                            content: message,
                            createdAt: new Date(),
                            employeeId: null,
                            clientId: clientId,
                            status: "Not seen",
                        },
                    ],
                }));
                setAction("Scroll");
            }
        };
        const handleSeenMessage = (channelId: any) => {
            if (channelId == channel) {
                if (!data || !data.message || data.message.length === 0) {
                    return;
                }
                const newData = { ...data };
                const lastMessage = newData.message[newData.message.length - 1];
                if (lastMessage.status === "Not seen") {
                    lastMessage.status = "Seen";
                    setData(newData);
                }
            }
        };
        socket.on("message:send:fromClient", handleNewMessage);
        socket.on("message:read:fromClient", handleSeenMessage);
        return () => {
            socket.off("message:send:fromClient", handleNewMessage);
            socket.off("message:read:fromClient", handleSeenMessage);
        };
    }, [socket, channel, data]);

    const handleFocus = () => {
        viewMessage();
        setInputFocused(true);
    };

    const handleBlur = () => {
        setInputFocused(false);
    };

    const send = async (e: any) => {
        if (value == "") return;
        e.preventDefault();
        try {
            setSending(true);
            setValue("");
            setData((prevData: any) => ({
                ...prevData,
                message: [
                    ...prevData.message,
                    {
                        content: value,
                        createdAt: new Date(),
                        employeeId: "1",
                        status: "Not seen",
                    },
                ],
            }));
            const response = await socket.emitWithAck(
                "staff:message:send",
                data.channel,
                value,
                session?.user.id
            );
            if (!response.status) {
                message.error("Sending message failed!");
            }
            setSending(false);
            setAction("Scroll");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleUpload = async ({
        file,
        onSuccess,
    }: {
        file?: any;
        onSuccess?: any;
    }) => {
        const image = await uploadImage(file, "Chat");
        if (image.url) {
            setSending(true);
            setValue("");
            setData((prevData: any) => ({
                ...prevData,
                message: [
                    ...prevData.message,
                    {
                        content: image.url,
                        createdAt: new Date(),
                        employeeId: "1",
                        status: "Not seen",
                    },
                ],
            }));
            const response = await socket.emitWithAck(
                "staff:message:send",
                data.channel,
                image.url,
                session?.user.id
            );
            if (!response.status) {
                message.error("Sending message failed!");
            }
            setSending(false);
            setAction("Scroll");
        }
        onSuccess("ok");
    };

    const props: UploadProps = {
        name: "image",
        customRequest: handleUpload,
        onChange(info) {
            if (info.file.status === "done") {
                message.success(`Send image successfully`);
            } else if (info.file.status === "error") {
                message.error(`Send image failed.`);
            }
        },
    };

    const viewMessage = async () => {
        await fetchClient({
            url: `/channels`,
            method: "PUT",
            body: { id: channel },
        });
        await socket.emit("staff:message:read", data.channel);
        setValue("");
        scrollToBottom();
    };

    // HANDLE SCROLL WHEN RECEIVE MESSAGE
    useEffect(() => {
        if (action === "Scroll") {
            scrollToBottom();
            setAction("Default");
        }
    }, [data]);

    // HANDLE SCROLL FOR LOADING MORE
    const loadMore = () => {
        console.log("Load more1");
        if (loading || isAllLoaded) return;
        setLoading(true);
        setIndex((prevIndex: number) => prevIndex + 1);
    };

    const handleScroll = () => {
        console.log("Load more2");
        const container = messageContainerRef.current;
        if (container) {
            if (container.scrollTop === 0) {
                loadMore();
            }
        }
    };
    useEffect(() => {
        const container = messageContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            if (loading || isAllLoaded) {
                const addedContentHeight =
                    container.scrollHeight - container.clientHeight;
                container.scrollTo({
                    top: container.scrollTop + addedContentHeight / 2,
                    behavior: "smooth",
                });
            }
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [loading, isAllLoaded, initial]);

    if (channel === -1) return "Choose customer to chat";
    if (!data) return <Loading />;

    return (
        <div
            className={` bg-white relative border-primary rounded-md border-2 border-opacity-25 flex flex-col justify-between overflow-hidden shadow-lg w-full h-full z-50`}
        >
            <Drawer
                title='Create new lead'
                placement='top'
                closable={false}
                onClose={onClose}
                open={open}
                getContainer={false}
                mask={false}
                maskClosable={false}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            type='default'
                            style={{ backgroundColor: "white" }}
                            onClick={handleSubmit}
                        >
                            Create
                        </Button>
                    </Space>
                }
            >
                <CreateNewLeadForm
                    formControl={form_create}
                    onCreate={handleCreateLead}
                />
            </Drawer>
            <div
                style={{ backgroundColor: variables.backgroundSecondaryColor }}
                className='header h-12 w-full text-white items-center flex flex-row justify-between p-4 font-bold border-b-white border-b-2'
            >
                <span className='font-semibold text-black'>{data.client}</span>
                {data.type == "customer" || data.type == "lead" ? (
                    <span
                        className='font-semibold  text-black'
                        onClick={() =>
                            router.push(
                                `${
                                    data.type === "customer"
                                        ? "/customers/"
                                        : "/leads/"
                                }${data.id}`
                            )
                        }
                    >
                        <ExclamationCircleOutlined
                            style={{ fontSize: "1.4rem" }}
                            className='hover:cursor-pointer'
                        />
                    </span>
                ) : (
                    <Button
                        type='default'
                        style={{ backgroundColor: "white" }}
                        onClick={showDrawer}
                    >
                        Create Lead
                    </Button>
                )}
            </div>
            <div
                ref={messageContainerRef}
                className='body w-full grow font-normal text-sm overflow-auto max-h-full flex flex-col justify-start gap-2 px-2 py-2'
            >
                {loading && <Spin size='default'></Spin>}
                {data.message.map((item: any, index: number) => {
                    const hasPreviousMessage = index > 0;
                    const currentTime = moment(item.createdAt);
                    const previousTime = hasPreviousMessage
                        ? moment(data.message[index - 1].createdAt)
                        : null;
                    const display =
                        hasPreviousMessage &&
                        currentTime.diff(previousTime, "minutes") >= 10;
                    const lastMessage =
                        index === data.message.length - 1 &&
                        item.employeeId !== null;
                    return (
                        <>
                            {(display || index == 0) && (
                                <TimeStamp time={item.createdAt} />
                            )}
                            <Message
                                params={{
                                    content: item.content,
                                    employee:
                                        item.employeeId == null ? false : true,
                                    time: item.createdAt,
                                }}
                            />
                            {lastMessage && (
                                <Status read={item.status != "Not seen"} />
                            )}
                        </>
                    );
                })}
                {sending && <SendStatus />}
            </div>
            <div className='footer h-10 w-full bg-primary-100 items-center flex flex-row justify-between p-2 font-medium text-base'>
                <input
                    id='message'
                    value={value}
                    onChange={(e) => setValue(e.currentTarget.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={async (e) =>
                        e.key === "Enter" ? await send(e) : {}
                    }
                    className='chat bg-primary-100 w-full h-full border-0 focus:outline-none px-2 py-2'
                    placeholder='Enter text'
                />
                <span className='text-primary'>
                    <Upload
                        {...props}
                        maxCount={1}
                        showUploadList={false}
                        accept='image/*'
                        style={{ color: "aqua" }}
                    >
                        <FileImageOutlined
                            style={{ fontSize: "1.4rem", color: "#4A58EC" }}
                            className='hover:cursor-pointer'
                        />
                    </Upload>
                </span>
                <span className='text-primary' onClick={(e) => send(e)}>
                    <SendOutlined
                        style={{ fontSize: "1.4rem" }}
                        className='hover:cursor-pointer'
                    />
                </span>
            </div>
        </div>
    );
};

export default ChatBox;
