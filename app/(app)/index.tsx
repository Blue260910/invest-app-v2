import React from "react";
import { Card } from 'components/ui/card';
import { Text } from 'components/ui/text';
import { Button } from 'components/ui/button';
import { View } from 'react-native';

export default function Home() {
    return (
        <View className="flex-1 items-center justify-center bg-zinc-50">
            <Card className="items-center p-8 mx-4 bg-gradient-to-br from-zinc-50 to-zinc-200 shadow-xl rounded-2xl border border-zinc-300 w-full max-w-md">
                <Text className="text-3xl font-extrabold text-center mb-2 text-zinc-900 tracking-tight">Bem-vindo ao Invest App</Text>
                <Text className="text-base text-center text-zinc-700 mb-6">
                    Gerencie seus investimentos de forma simples, segura e moderna.
                </Text>
                <Button className="w-full bg-zinc-900 active:bg-zinc-800 py-3 rounded-xl shadow-md" onPress={() => {}}>
                    <Text className="text-lg font-bold text-white">Explorar</Text>
                </Button>
            </Card>
        </View>
    );
}