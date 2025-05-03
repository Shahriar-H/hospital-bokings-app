import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, TextInput, ToastAndroid, TouchableOpacity } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import { api_url } from "@/assets/lib"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { io } from "socket.io-client";
import * as Clipboard from 'expo-clipboard';

// client-side


const Home = () => {
    const router = useRouter();
    const [datalist, setDatalist] = useState<any[]>([]);
    const [userdata, setuserdata] = useState<any>({});
    const isfocued = useIsFocused()
    const [isConnected, setisConnected] = useState(false);

    const getLoginData = async () => {
        const data: any = await AsyncStorage.getItem('login');
        if (!data) {
            router.push("/")
        }
        setuserdata(data ? JSON.parse(data) : null)
        // console.log(data, 11);

    }

    useEffect(() => {
        getLoginData()

    }, [userdata?._id, isfocued]);

    const getData = async () => {
        try {
            // console.log("Fetching Data...");
            const response = await fetch(api_url + '/get-item', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: { id: userdata?._id }, table: "users" })
            });

            const data = await response.json();
            // console.log(data, "Fetched users",);
            if (data?.status === 200) {
                // console.log(data, "Fetched users");
                setisConnected(true)
                setuserdata(data?.result[0]);  // 🔥 Save hospital list to state
                await AsyncStorage.setItem('login', JSON.stringify(data?.result[0]));
                ToastAndroid.show("Data Updated", ToastAndroid.SHORT);
            }

        } catch (error) {
            console.log("Fetch error:", error);
            ToastAndroid.show("Error: Data Not Updated", ToastAndroid.SHORT);
        }
    }

    useEffect(() => {
        
        const socket = io('https://arduino.iotaquaculture.com', {
            transports: ['websocket'], // Force WebSocket
          });
      
          socket.on('connect', () => {
            console.log('Connected to socket server');
          });
      
          socket.on('data', (data) => {
            const newData = JSON.parse(data);
            setuserdata((prev:any)=>({...prev,data:{...newData}}))
            
            console.log('Message from server:', newData);
          });
      
          return () => {
            socket.disconnect();
          };
        
    }, []);

    useEffect(() => {
        getData()
    }, []);

    const copyToClipboard = async () => {
        if(userdata?.secret_code){
            await Clipboard.setStringAsync(userdata?.secret_code);
            ToastAndroid.show("Code copied to clipboard", ToastAndroid.SHORT);
        }
            
        };



    return (
        <>
            <View className='flex-1 w-full bg-white'>
                {/* Header */}
                <View className='bg-blue-500 flex-row justify-between items-center p-5' style={{ height: 200, borderBottomEndRadius: 20, borderBottomStartRadius: 20, elevation: 3 }}>
                    <View className='mt-4'>
                        <Text className='text-lg text-gray-200'>Welcome,</Text>
                        <Text className='font-bold text-2xl text-white'>{userdata?.fullName}</Text>

                        <Text className='text-xs mt-2 text-gray-200  '>
                        secret_code</Text>
                        <TouchableOpacity 
                        className=' bg-blue-600 p-1 rounded-lg ' 
                        onPress={copyToClipboard}>
                            <Text className='text-sm text-gray-200 text-center '>
                            {userdata?.secret_code?
                            "1743121234*****"+" ":"No Code"} 
                            <FontAwesome name={'copy'} /></Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity className='flex justify-center items-center'>
                        <Image className='h-20 mb-3 w-20' resizeMode='cover' 
                        source={{ uri: "https://robotechvalley.com/wp-content/uploads/2024/11/cropped-logo-main.png" }} />
                        <TouchableOpacity onPress={() => {
                            AsyncStorage.removeItem('login')
                            router.push("/")
                        }}>
                            <Text className='text-sm text-gray-200'>Logout</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>

                <View className='m-4'>
                    {/* <Text className='text-xl font-bold'>Setup your API Connect </Text>
                    <TextInput className='mt-2 py-4 px-4 border rounded-lg bg-[#ffffff]' 
                    placeholder='Enter your API Key' /> */}
                    {!isConnected && 
                    <TouchableOpacity onPress={getData} className='bg-blue-400 p-5 mt-3 rounded-lg'>
                        <Text className='text-center text-white font-semibold '>Connect/Fetch</Text>
                    </TouchableOpacity>}
                    {isConnected && 
                    <TouchableOpacity onPress={getData} className='bg-green-400 p-5 mt-3 rounded-lg'>
                        <Text className='text-center text-white font-semibold '>Connected</Text>
                    </TouchableOpacity>}
                </View>

                {/* Hospital List */}
                <ScrollView className='p-4'>
                    <View className='flex-row justify-center flex-wrap'>
                        {userdata?.data && Object.keys(userdata?.data).length > 0 ? (
                            Object.keys(userdata?.data) &&
                            Object.keys(userdata?.data).map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() =>
                                        router.push({ pathname: '/services', params: { hospital: item } })}
                                    // 🔥 Redirect to services page if you want
                                    className='bg-blue-500 p-5 m-1 
                                rounded-lg flex-row justify-between items-center w-[30%] overflow-hidden'
                                >
                                    <View className='w-full'>
                                        <Text className='text-4xl font-bold text-white text-center'>
                                            {typeof userdata?.data[item] === "object" ? 
                                            "--" : userdata?.data[item] || "0"}</Text>
                                        <Text className='text-lg text-[#ffffff89] text-center'>
                                            {item || "Unknown Location"}
                                        </Text>
                                    </View>
                                    <View className='absolute top-0 right-0'>
                                        <FontAwesome size={50} color={'#001eff17'} name="line-chart" />
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (<View className='justify-center items-center '>
                            <FontAwesome name="thermometer-empty" size={100} color="#00000027" />
                            <Text className='text-center text-gray-400 mt-5'>No Data Found</Text>

                            </View>
                        )}
                    </View>
                    <View className='h-20'></View>
                </ScrollView>
            </View>
            <View>
                <TouchableOpacity onPress={() => router.push("/configuration")} className='shadow-lg '>
                    <Text className='text-black bg-white text-center py-3'>How to Configure ?</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({})

export default Home;
