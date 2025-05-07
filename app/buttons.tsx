import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, ScrollView, TextInput, ToastAndroid, TouchableOpacity } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import { api_url, socket_url } from "@/assets/lib"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { io } from "socket.io-client";
import * as Clipboard from 'expo-clipboard';


// client-side


const ButtonsScreen = () => {
    const router = useRouter();
    const [datalist, setDatalist] = useState<any[]>([]);
    const [userdata, setuserdata] = useState<any>({});
    const isfocued = useIsFocused()
    const [isConnected, setisConnected] = useState(false);
    const [allbuttons, setallbuttons] = useState<any>(null);
    const [buttonsname, setbuttonsname] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [isFatcing, setisFatcing] = useState(false);
    const [isUpdaing, setisUpdaing] = useState(false);
    const [whichbtnupdating, setwhichbtnupdating] = useState('');

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
        console.log(userdata);
        if (!userdata?._id) return 0;
        try {
            // console.log("Fetching Data...");
            setisFatcing(true)
            const response = await fetch(api_url + '/get-item', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: { id: userdata?._id }, table: "users" })
            });

            const data = await response.json();
            // console.log(data, "Fetched users",);
            setisFatcing(false)
            if (data?.status === 200) {
                // console.log(data, "Fetched users");
                setisConnected(true)

                setuserdata(data?.result[0]);  // 🔥 Save hospital list to state
                setallbuttons({ ...data?.result[0].buttons })
                await AsyncStorage.setItem('login', JSON.stringify(data?.result[0]));
                // ToastAndroid.show("Data Updated", ToastAndroid.SHORT);
            }

        } catch (error) {
            console.log("Fetch error:", error);
            ToastAndroid.show("Error: Data Not Updated", ToastAndroid.SHORT);
            setisFatcing(false)
        }
    }

    useEffect(() => {

        const socket = io("https://arduino.iotaquaculture.com", {
            transports: ['websocket'], // Force WebSocket
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on(userdata?.secret_code, (data: any) => {
            const newData = JSON.parse(data);
            setuserdata((prev: any) => ({ ...prev, data: { ...newData } }))
            setallbuttons({ ...newData.buttons })
            console.log('Message from server:', newData);
        });

        return () => {
            socket.disconnect();
        };

    }, []);

    useEffect(() => {
        getData()
    }, [userdata?._id]);

    const createBtns = async () => {
        console.log('hello');

        if (!buttonsname) return ToastAndroid.show("Enter Button Name", ToastAndroid.BOTTOM)
        const noSpaces = buttonsname.replace(/\s+/g, '');
        setisLoading(true)
        let mybuttons = { ...allbuttons, [noSpaces]: 1 }
        const response = await fetch(api_url + `/create-buttons?secret=${userdata?.secret_code}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mybuttons)
        })
        const data = await response.json();
        if (data?.status === 200) {
            setallbuttons((prev: any) => ({ ...prev, [buttonsname]: 0 }))
            setbuttonsname("")
            setisLoading(false)
            return ToastAndroid.show("Buttons Added", ToastAndroid.BOTTOM)
        }
        ToastAndroid.show("Failed to Add", ToastAndroid.BOTTOM);
        setisLoading(false)
        console.log(data);
    }
    const updateBtnsValue = async (mybuttons: any) => {

        setisUpdaing(true)

        const response = await fetch(api_url + `/create-buttons?secret=${userdata?.secret_code}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mybuttons)
        })
        const data = await response.json();
        if (data?.status === 200) {
            setallbuttons(mybuttons)
            setbuttonsname("")
            setisUpdaing(false)
            return ToastAndroid.show("Buttons Updated", ToastAndroid.BOTTOM)
        }
        ToastAndroid.show("Failed to update", ToastAndroid.BOTTOM);
        setisUpdaing(false)
        console.log(data);
    }

    const updateSpecificButtonData = async (buttonname: string, value: number) => {
        const socket = io("https://arduino.iotaquaculture.com", {
            transports: ['websocket'], // Force WebSocket
        });
        setwhichbtnupdating(buttonname)
        setallbuttons((prev: any) => {
            updateBtnsValue({ ...prev, [buttonname]: value })
            socket.emit('buttons', JSON.stringify({
                buttons: { ...prev, [buttonname]: value },
                secret_code: userdata?.secret_code
            }));
            return { ...prev, [buttonname]: value }
        })
    }




    return (
        <>
            <View className='flex-1 w-full bg-white'>


                {/* Hospital List */}
                <ScrollView className='p-4'>
                    <View className='flex-row justify-center flex-wrap'>
                        {allbuttons && Object.keys(allbuttons).length > 0 ? (
                            Object.keys(allbuttons) &&
                            Object.keys(allbuttons).map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className='border p-5 m-1 
                                rounded-lg flex-row justify-between items-center w-[45%] overflow-hidden'
                                >
                                    <View className='w-full'>
                                        <Text className=' font-bold text-gray-500 text-center'>
                                            {item}</Text>
                                        <Text className='text-4xl font-bold text-black text-center'>
                                            {allbuttons[item]}</Text>
                                        <View className='flex-row justify-between'>
                                            <TouchableOpacity
                                                onPress={() => updateSpecificButtonData(item, 1)}
                                                className='w-[45%] bg-green-500 p-2 rounded'>
                                                <Text className='text-center text-black'>
                                                    {isUpdaing && whichbtnupdating === item ? <ActivityIndicator color='#fff' size='small' /> : "ON"}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => updateSpecificButtonData(item, 0)}
                                                className='w-[45%] bg-red-500 p-2 rounded'>
                                                <Text className='text-center text-black'>
                                                    {isUpdaing && whichbtnupdating === item ? <ActivityIndicator color='#fff' size='small' /> : "OFF"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            ))
                        ) : (<View className='justify-center items-center '>
                            <FontAwesome name="thermometer-empty" size={100} color="#00000027" />
                            <Text className='text-center text-gray-400 mt-5'>No Data Found</Text>
                            {isFatcing && <ActivityIndicator color='#000' size='small' />}

                        </View>
                        )}
                    </View>
                    <View className='h-20'></View>
                </ScrollView>

                <View className='p-2'>
                    <TextInput
                        value={buttonsname}
                        placeholder='Button Name'
                        onChangeText={(text) => setbuttonsname(text)}
                        className='w-full border mb-2 border-gray-400 rounded-lg p-3'></TextInput>
                    <TouchableOpacity onPress={() => createBtns()} className='bg-blue-400 p-5 rounded-lg'>
                        {!isLoading && <Text className='text-center text-white font-semibold '>Create Button</Text>}
                        {isLoading && <ActivityIndicator color='white' size='small' />}
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => router.push("/configurationbtn")} className='shadow-lg '>
                <Text className='text-black bg-white text-center py-3'>How to Configure button?</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({})

export default ButtonsScreen;
