import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import "../global.css"

import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [logindata, setlogindata] = useState<any>(null);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isloading, setisloading] = useState<any>(true);
  const router = useRouter()

  const getData = async ()=>{
    const data:any = await AsyncStorage.getItem('login');
    setlogindata(data?JSON.parse(data):null)
    setisloading(false)
  }

  useEffect(() => {
    getData()
    if (!isloading) {
      SplashScreen.hideAsync();
      console.log(logindata,1);
      
      if(logindata?._id){
        router.push("/home")
      }
    }
  }, [isloading]);

  if (isloading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index"options={{headerShown:false}} />
        <Stack.Screen name="mybookings"options={{headerShown:false}} />
        <Stack.Screen name="services"options={{headerShown:false}} />
        <Stack.Screen name="home"options={{headerShown:false}} />
        <Stack.Screen name="signup"options={{headerShown:false}} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
