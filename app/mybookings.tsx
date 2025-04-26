import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Image, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';
import { api_url } from "@/assets/lib";
import { useGlobalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [userdata, setUserdata] = useState<any>({});
    const [myBookings, setMyBookings] = useState<any[]>([]);
    const router = useRouter();
     const isfocued=useIsFocused()

    const getLoginData = async () => {
        const data: any = await AsyncStorage.getItem('login');
        if (!data) {
            router.push("/");
            return;
        }
        setUserdata(JSON.parse(data));
    };

    const getMyBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch(api_url + '/get-item', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: { user_id: `${userdata?._id}` },
                    table: "bookings"
                })
            });

            const data = await response.json();
            setMyBookings(data?.result || []);
            setLoading(false);
        } catch (error) {
            console.log("Booking fetch error:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getLoginData();
    }, [isfocued]);

    useEffect(() => {
        if (userdata?._id) {
            getMyBookings();
        }
    }, [userdata?._id]);

    return (
        <View className="flex-1 w-full bg-white">
            
            <View className='bg-yellow-700 relative h-[100px] flex-row justify-between items-center p-5' style={{ height: 200, borderBottomEndRadius: 20, borderBottomStartRadius: 20, elevation: 3 }}>
                            <View className='mt-4 w-2/3'>
                                <Text className='font-bold text-2xl text-white'>My Bookings</Text>
                                <Text className='text-lg text-gray-200'>All bookings list that i have been created.</Text>
                            </View>
                            
                        </View>

            {loading ? (
                <ActivityIndicator size="large" color="#00aaff" />
            ) : (
                <ScrollView className='p-4'>
                    {myBookings.length === 0 ? (
                        <Text className="text-center text-gray-500m- mt-10 ">No bookings found</Text>
                    ) : (
                        myBookings.map((booking, index) => (
                            <View key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
                                <Text className="font-bold text-lg">{booking.service??"Service Name"}</Text>
                                <Text className="text-gray-700 mt-1">Date: {booking.date}</Text>
                                <Text className="text-gray-500 mt-1">Hospital: {booking.hospital}</Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({});

export default Home;
