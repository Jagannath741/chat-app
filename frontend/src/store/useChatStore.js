import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.messages || "Failed to fetch users");
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async () => {
        set({ isMessagesLoading: true });
        try {
            const { selectedUser } = get();
            if (!selectedUser) {
                toast.error("No user selected");
                return;
            }

            const res = await axiosInstance.get(`/messages/${selectedUser._id}`);
            if (res?.data) {
                set({ messages: res.data });
            } else {
                toast.error("No messages found");
            }
        } catch (error) {
            toast.error(error.response?.data?.messages || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) {
            toast.error("No user selected");
            return;
        }

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            if (res?.data) {
                set({ messages: [...messages, res.data] });
            } else {
                toast.error("Invalid message data received");
            }
        } catch (error) {
            toast.error(error.response?.data?.messages || "Failed to send message");
        }
    },
    subscribeToMessage:()=>{
        const {selectedUser}=get()
        if(!selectedUser)return;

        const socket=useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            set({
                messages:[...get().messages,newMessage]
            })
        })

    },
    unsubscribeFromMessage:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
