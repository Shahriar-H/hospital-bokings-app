import GoogleLogin from '@/components/login/GoogleLogin';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api_url } from '@/assets/lib';

const Index = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setloading] = useState(false);
     const [showpassword, setshowpassword] = useState(false);

    const router = useRouter()
    const getData = async () => {
        try {
            setloading(true)
            const response = await fetch(api_url + '/get-item', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: { email: email, password: password }, table: "users" })
            });

            const data = await response.json();
            console.log(data, "Fetched hospitals");
            setloading(false)
            if (data.result?.length > 0) {
                await AsyncStorage.setItem('login', JSON.stringify(data.result[0]));
                router.push("/home")
            } else {
                ToastAndroid.show("Invalid Credentials", ToastAndroid.SHORT);
            }

        } catch (error) {
            console.log("Fetch error:", error);
            setloading(false)
        }
    }
    return (
        <View className='flex-1 justify-center items-center'>
            <Image className='w-full h-full absolute top-0 left-0' source={require('@/assets/images/bg.jpg')} />
            <View className='p-4 w-full'>
                <View className="w-full p-4 rounded-xl bg-[#01409977]">
                    <Image className='h-24 w-24 mx-auto' resizeMode='cover' source={require('@/assets/images/hospital.png')} />
                    <Text className='text-2xl mt-2 font-bold text-white text-center'>
                        <Text className='text-2xl font-normal text-white text-center'>Welcome to</Text> Hospital Booking</Text>

                    <View className='mt-[10px]'>
                        <TextInput onChangeText={(v) => setemail(v)} className='mt-10 py-4 px-4 rounded-full bg-[#ffffff]' placeholder='Email' />
                        <View className='relative'>
                            <TextInput
                                className='mt-4 py-4 px-4 rounded-full bg-[#ffffff]'
                                placeholder='Password'
                                secureTextEntry={!showpassword}
                                value={password}
                                onChangeText={setpassword}
                            />
                            <TouchableOpacity className='absolute right-4 top-7' onPress={() => setshowpassword(!showpassword)}>
                                {showpassword ? (
                                    <FontAwesome name="eye-slash" size={24} color="gray" />
                                ) : (
                                    <FontAwesome name="eye" size={24} color="gray" />
                                )}
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity onPress={() => getData()}
                            className='flex flex-row justify-center items-center gap-2 mt-10 py-3 px-4 rounded-full bg-[#ffffff]'>
                            {/* <FontAwesome name='google' size={20}/> */}
                            <Text className='text-lg text-black text-center font-bold'>{loading ? 'Loading...' : 'Login Now'}</Text>
                        </TouchableOpacity>

                        <View className='mt-5 flex-row justify-center'>
                            <Text className='text-white text-center'>Do you want to sign up? </Text>
                            <Link href={'/signup'}>
                                <Text className=' text-center font-bold text-yellow-500'>Click Here</Text>
                            </Link>
                        </View>
                    </View>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Index;
