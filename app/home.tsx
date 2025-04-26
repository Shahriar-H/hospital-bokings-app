import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import { api_url } from "@/assets/lib"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const Home = () => {
    const router = useRouter();
    const [datalist, setDatalist] = useState<any[]>([]);
    const [userdata, setuserdata] = useState<any>({});
    const isfocued=useIsFocused()

    const getLoginData = async () => {
        const data: any = await AsyncStorage.getItem('login');
        if(!data){
            router.push("/")
        }
        setuserdata(data ? JSON.parse(data) : null)
        console.log(data, 11);

    }

    useEffect(() => {
        getLoginData()
    }, [userdata?._id,isfocued]);

    const getData = async () => {
        try {
            console.log("Fetching hospitals...");
            const response = await fetch(api_url + '/get-item', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: {}, table: "hospitals" })
            });

            const data = await response.json();
            console.log(data, "Fetched hospitals");
            setDatalist(data?.result);  // 🔥 Save hospital list to state

        } catch (error) {
            console.log("Fetch error:", error);
        }
    }

    useEffect(() => {
        getData();
    }, []);



    return (
        <>
            <View className='flex-1 w-full bg-white'>
                {/* Header */}
                <View className='bg-blue-500 flex-row justify-between items-center p-5' style={{ height: 200, borderBottomEndRadius: 20, borderBottomStartRadius: 20, elevation: 3 }}>
                    <View className='mt-4'>
                        <Text className='text-lg text-gray-200'>Welcome,</Text>
                        <Text className='font-bold text-2xl text-white'>{userdata?.fullName}</Text>
                        <TouchableOpacity className='mt-5' onPress={()=>{
                            router.push("/mybookings")
                        }}>
                            <Text className='text-sm text-gray-200'>My Bookings <FontAwesome name={'link'}  /></Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity className='flex justify-center items-center'>
                        <Image className='h-20 mb-3 w-20' resizeMode='cover' source={require('@/assets/images/hospital.png')} />
                        <TouchableOpacity onPress={()=>{
                            AsyncStorage.removeItem('login')
                            router.push("/")
                        }}>
                            <Text className='text-sm text-gray-200'>Logout</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>

                {/* Hospital List */}
                <ScrollView className='p-4'>
                    {datalist.length > 0 ? (
                        datalist.map((hospital, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => router.push({ pathname: '/services', params: { hospital: hospital.name } })}
                                // 🔥 Redirect to services page if you want
                                className='bg-blue-500 p-5 my-2 rounded-lg flex-row justify-between items-center'
                            >
                                <View>
                                    <Text className='text-2xl font-bold text-white'>{hospital.name || "Unnamed Hospital"}</Text>
                                    <Text className='text-sm mt-1 text-gray-100'>
                                        <FontAwesome name="map-marker" /> {hospital.location || "Unknown Location"}
                                    </Text>
                                </View>
                                <View>
                                    <FontAwesome size={50} color={'#033c7c9a'} name="hospital-o" />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text className='text-center text-gray-400 mt-5'>Loading hospitals...</Text>
                    )}
                    <View className='h-20'></View>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({})

export default Home;
