import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import io from "socket.io-client";
const BASE_URL=import.meta.env.MODE==="development"? "http://localhost:5050":"/";
export const useAuthStore= create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,
    checkAuth:async()=>{
      try {
        const res=await axiosInstance.get("/auth/check");
        set({authUser:res.data});
        get().connectSocket();
      } catch (error) {
        console.log("Error in checkAuth:",error);
        set({authUser:null});
      }  
      finally{
        set({isCheckingAuth:false});
      }
    },

    signup:async(data)=>{
      set({isSigningUp:true});
      try {
        const res=await axiosInstance.post("/auth/signup",data);
        set({authUser:res.data});
        toast.success("Account created succesfully");
        get().connectSocket();
      } catch (error) {
        toast.error(error.response.data.message);       
        
      }
      finally{
        set({isSigningUp:false});
      }
      
    },
    logout:async()=>{
      try {
        await axiosInstance.post("/auth/logout");
        set({authUser:null});
        toast.success("Logout Successfully");
        get().disconnectSocket();
      } catch (error) {
        toast.error(error.reponse.data.message);
      }
    },
    login:async(data)=>{
      set({isLoggingIn:true});
      try {
        const res=await axiosInstance.post("/auth/login",data);
        set({authUser:res.data});
        toast.success("Logged in successfully");
        get().connectSocket();

      } catch (error) {
        const errorMessage=error.reponse?.data?.message||"Unabale to login.Please try again.";
        toast.error(errorMessage);
        console.log("Error during login:",error);
      }
      finally{
        set({isLoggingIn:false});
      }
    },
    updateProfile:async(data)=>{
      set({isUpdatingProfile:true});
      try {
        const res=await axiosInstance.put("/auth/update-profile",data);
        set({authUser:res.data});
      toast.success("Profile updated successfully");
      } catch (error) {
        console.log("error in update profile: ", error);
      }
      finally{
        set({isUpdatingProfile:false});
      }
    },

connectSocket:()=>{
  const {authUser}=get();
  if(!authUser||get().socket?.connected) 
    return;
  
  
  const socket=io(BASE_URL,{
    query:{
      userId:authUser._id,
    },
  });
  socket.connect();
  set({socket:socket});

  socket.on("getOnlineUsers",(userIds)=>{
    set({onlineUsers:userIds});
  });
  
  
    
},
disconnectSocket:()=>{
if (get().socket?.connected) get().socket.disconnect();
}

})

)