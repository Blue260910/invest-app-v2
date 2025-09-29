import React from 'react';
import { Stack } from 'expo-router';


export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 200,
        
      }}
    >
      <Stack.Screen name="onboarding" />
      {/* <Stack.Screen name="login" /> */}
      {/* <Stack.Screen name="register" /> */}
    </Stack>
  );
}