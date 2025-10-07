
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { Separator } from '@/components/ui/separator';

const data = {
    total: 94475,
    categories: [
        { name: 'Renda Fixa', value: 56685, percent: 60, color: 'bg-green-400' },
        { name: 'Ações', value: 19839, percent: 21, color: 'bg-pink-300' },
        { name: 'Fundos', value: 17950, percent: 19, color: 'bg-yellow-300' },
    ],
    recent: [
        { name: 'Tesouro Selic', type: 'Renda Fixa', value: 5400 },
        { name: 'ITUB4', type: 'Ações', value: 3200 },
        { name: 'Fundo XP Macro', type: 'Fundos', value: 2500 },
    ],
};

export default function DiversificadorScreen() {
    return (
        <ScrollView className="flex-1 bg-background px-4 py-6">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Carteira Diversificada</CardTitle>
                    <CardDescription>Total investido</CardDescription>
                </CardHeader>
                <CardContent className="items-center">
                    <Text variant="h1" className="mb-2">R$ {data.total.toLocaleString('pt-BR')}</Text>
                    <View className="flex-row justify-center items-center gap-4 mb-4">
                        {data.categories.map((cat, idx) => (
                            <View key={cat.name} className="items-center">
                                <Badge variant="secondary" className={cat.color + ' mb-1'}>
                                    <Text className="font-bold text-xs">{cat.name}</Text>
                                </Badge>
                                <Text variant="large">{cat.percent}%</Text>
                            </View>
                        ))}
                    </View>
                    <View className="w-full gap-3">
                        {data.categories.map((cat) => (
                            <View key={cat.name} className="mb-2">
                                <View className="flex-row justify-between mb-1">
                                    <Text className="font-medium">{cat.name}</Text>
                                    <Text className="font-medium">R$ {cat.value.toLocaleString('pt-BR')}</Text>
                                </View>
                                <Progress value={cat.percent} />
                            </View>
                        ))}
                    </View>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Investimentos Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    {data.recent.map((item, idx) => (
                        <View key={idx} className="flex-row items-center justify-between py-2">
                            <View className="flex-row items-center gap-3">
                                                <Avatar alt={item.name}>
                                                    <AvatarFallback>{item.name[0]}</AvatarFallback>
                                                </Avatar>
                                <View>
                                    <Text className="font-semibold">{item.name}</Text>
                                    <Text variant="muted" className="text-xs">{item.type}</Text>
                                </View>
                            </View>
                            <Text className="font-bold text-green-500">+R$ {item.value.toLocaleString('pt-BR')}</Text>
                        </View>
                    ))}
                </CardContent>
            </Card>
        </ScrollView>
    );
}
