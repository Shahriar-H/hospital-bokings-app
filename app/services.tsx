import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Image, ScrollView, TouchableOpacity, Text, ToastAndroid } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { api_url } from "@/assets/lib";
import { useGlobalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const Service = () => {
    const [selectedService, setSelectedService] = useState('');
    const [services, setServices] = useState<any[]>([]); // 🔥 Service list
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const query = useGlobalSearchParams()
    const router = useRouter();
    const [loading, setloading] = useState(false);
    const [userdata, setuserdata] = useState<any>({});
    const isfocued=useIsFocused()
   

    const getLoginData = async () => {
        const data: any = await AsyncStorage.getItem('login');
        if (!data) {
            router.push("/")
        }
        setuserdata(data ? JSON.parse(data) : null)
        console.log(data, 11);

    }

    useEffect(() => {
        getLoginData()
    }, [userdata?._id,isfocued]);

    useEffect(() => {
 
        getServices();
    }, [query?.hospital]);

    const getServices = async () => {
        try {
            const response = await fetch(api_url + '/get-item', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: { hospital: `${query?.hospital}` }, table: "services" }) // ✅ Fetch services table
            });

            const data = await response.json();
            setServices(data?.result);  // ✅ Save services
            console.log(data?.result);

        } catch (error) {
            console.log("Service fetch error:", error);
        }
    };

    useEffect(() => {
        console.log(selectedService);
        
    }, [selectedService]);


    const createBookings = async () => {
        try {
            setloading(true)
            const response = await fetch(api_url + '/insert-item', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: {
                        hospital: `${query?.hospital}`,
                        service: `${selectedService}`,
                        date: `${selectedDate}`,
                        user_id: `${userdata?._id}`,
                        user_name: `${userdata?.fullName}`,
                        user: `${userdata}`
                    }, table: "bookings"
                }) // ✅ Fetch services table
            });

            const data = await response.json();
            setloading(false)
            if (data?.status === 200) {
                ToastAndroid.show("Booked Successfully", ToastAndroid.SHORT);
                router.push("/mybookings")
            }



        } catch (error) {
            console.log("Service fetch error:", error);
            ToastAndroid.show("Booking Failed", ToastAndroid.SHORT);
            setloading(false)
        }
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: any) => {
        hideDatePicker();
        setSelectedDate(moment(date).format('LL'));
    };

    return (
        <View className='flex-1 w-full bg-white'>
            {/* Header */}
            <View className='bg-green-700 relative h-[100px] flex-row justify-between items-center p-5' style={{ height: 200, borderBottomEndRadius: 20, borderBottomStartRadius: 20, elevation: 3 }}>
                <View className='mt-4 w-2/3'>
                    <Text className='font-bold text-2xl text-white'>Square Hospital</Text>
                    <Text className='text-lg text-gray-200'>Select the available service and book it now.</Text>
                </View>
                <TouchableOpacity>
                    <Image className='h-24 w-24 mx-auto' resizeMode='cover' source={require('@/assets/images/hospital.png')} />
                </TouchableOpacity>
            </View>

            {/* Main Body */}
            <ScrollView className='p-4'>

                {/* Picker */}
                <View className='bg-gray-50 p-1 border border-gray-400 my-2 rounded-lg'>
                    <Picker
                        selectedValue={selectedService}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedService(itemValue)
                        }>
                        <Picker.Item label="Select A Service" value="" />
                        {services?.length > 0 && services.map((service, index) => (
                            <Picker.Item
                                key={index}
                                label={service.service || "Unnamed Service"}
                                value={service.service}
                            />
                        ))}
                    </Picker>
                </View>

                {/* Date Picker */}
                <View>
                    <TouchableOpacity
                        onPress={showDatePicker}
                        className='bg-gray-50 p-3 py-5 border border-gray-400 my-2 rounded-lg'>
                        <Text>
                            <FontAwesome name="calendar" size={20} />{" "}
                            {selectedDate ? selectedDate : 'Select Date'}
                        </Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                </View>

                {/* Booking Button */}
                <TouchableOpacity
                    onPress={() => {

                        createBookings()
                        // you can POST this booking here!
                    }}
                    className='bg-green-700 p-3 py-5 border border-gray-400 my-2 rounded-lg'>
                    <Text className='font-bold text-center text-white'>{loading ? "Booking..." : "Booking Now"}</Text>
                </TouchableOpacity>

                <View className='h-20'></View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Service;
