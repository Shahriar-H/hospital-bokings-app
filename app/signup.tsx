import GoogleLogin from '@/components/login/GoogleLogin';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid, ActivityIndicator } from 'react-native';
import { api_url } from '@/assets/lib';

const Index = () => {
    const router = useRouter();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showpassword, setshowpassword] = useState(false);

    const handleSignup = async () => {
        if (!fullName || !email || !phone || !password || !confirmPassword) {
            ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
            return;
        }

        if (password !== confirmPassword) {
            ToastAndroid.show("Passwords do not match", ToastAndroid.SHORT);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(api_url + '/insert-item', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: {
                        fullName,
                        email,
                        mobile:phone,
                        password
                    },
                    table: "users"
                })
            });

            const data = await response.json();
            setLoading(false);
console.log(data);

            if (data?.status === 200) {
                ToastAndroid.show("Signup Successful", ToastAndroid.SHORT);
                router.push('/'); // Redirect to Login Page
            } else {
                ToastAndroid.show("Signup Failed", ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log("Signup error:", error);
            ToastAndroid.show("Signup Failed", ToastAndroid.SHORT);
            setLoading(false);
        }
    }

    return (
        <View className='flex-1 justify-center items-center'>
            <Image className='w-full h-full absolute top-0 left-0' source={require('@/assets/images/bg.jpg')} />
            <View className='p-4 w-full'>
                <View className="w-full p-4 rounded-xl bg-[#01409977]">
                    <Image className='h-24 w-24 mx-auto' resizeMode='cover' source={require('@/assets/images/hospital.png')} />
                    <Text className='text-2xl mt-2 font-bold text-white text-center'>
                        <Text className='text-2xl font-normal text-white text-center'>Welcome to </Text>Hospital Booking
                    </Text>

                    <View className='mt-[10px]'>
                        <TextInput
                            className='mt-6 py-4 px-4 rounded-full bg-[#ffffff]'
                            placeholder='Full name'
                            value={fullName}
                            onChangeText={setFullName}
                        />
                        <TextInput
                            className='mt-4 py-4 px-4 rounded-full bg-[#ffffff]'
                            placeholder='Email'
                            keyboardType='email-address'
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            className='mt-4 py-4 px-4 rounded-full bg-[#ffffff]'
                            placeholder='Phone'
                            keyboardType='phone-pad'
                            value={phone}
                            onChangeText={setPhone}
                        />
                        <View className='relative'>
                        <TextInput
                            className='mt-4 py-4 px-4 rounded-full bg-[#ffffff]'
                            placeholder='Password'
                            secureTextEntry={!showpassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity className='absolute right-4 top-7' onPress={() => setshowpassword(!showpassword)}>
                            {showpassword ? (
                                <FontAwesome name="eye-slash" size={24} color="gray" />
                            ) : (
                                <FontAwesome name="eye" size={24} color="gray" />
                            )}
                        </TouchableOpacity>
                      
                        </View>
                        <TextInput
                            className='mt-4 py-4 px-4 rounded-full bg-[#ffffff]'
                            placeholder='Confirm Password'
                            secureTextEntry={!showpassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <TouchableOpacity
                            onPress={handleSignup}
                            disabled={loading}
                            className='flex flex-row justify-center items-center gap-2 mt-10 py-3 px-4 rounded-full bg-[#ffffff]'>
                            {loading ? (
                                <ActivityIndicator color="#014099" />
                            ) : (
                                <Text className='text-lg text-black text-center font-bold'>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        <View className='mt-5 flex-row justify-center'>
                            <Text className='text-white text-center'>Already have an account? </Text>
                            <Link href={'/'}>
                                <Text className=' text-center font-bold text-yellow-500'>Login Here</Text>
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
