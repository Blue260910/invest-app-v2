

import { useRouter } from 'expo-router';
import { Card } from 'components/ui/card';
import { Text } from 'components/ui/text';
import { Button } from 'components/ui/button';
import { View } from 'react-native';
import { Icon } from 'components/ui/icon';
import { MessageCircle, PlusCircle, TrendingUp } from 'lucide-react-native';

export default function Dashboard() {
    const router = useRouter();
    // Mock de dados
    const saldo = 12500.75;
    const desempenho = 8.2; // %
    return (
        <View className="flex-1 bg-zinc-50 p-4">
            <Text className="text-2xl font-bold text-zinc-900 mb-4">Dashboard</Text>
            <Card className="flex-col items-center p-6 mb-4">
                <Text className="text-lg text-muted-foreground mb-1">Saldo total</Text>
                <Text className="text-4xl font-extrabold text-green-600 mb-2">R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
                <View className="flex-row items-center gap-2 mb-2">
                    <Icon as={TrendingUp} size={20} color="#16a34a" />
                    <Text className="text-base text-green-600 font-semibold">+{desempenho}% este mês</Text>
                </View>
            </Card>
            <View className="flex-row gap-4 mb-4">
                <Button className="flex-1 flex-row items-center gap-2 bg-blue-600 active:bg-blue-700 py-3 rounded-xl shadow-md" onPress={() => router.push('/')}>
                    <Icon as={MessageCircle} size={20} color="#fff" />
                    <Text className="text-base font-bold text-white">Chatbot</Text>
                </Button>
                <Button className="flex-1 flex-row items-center gap-2 bg-green-600 active:bg-green-700 py-3 rounded-xl shadow-md" onPress={() => router.push('/')}>
                    <Icon as={PlusCircle} size={20} color="#fff" />
                    <Text className="text-base font-bold text-white">Adicionar investimento</Text>
                </Button>
            </View>
            <Card className="p-6">
                <Text className="text-lg font-semibold mb-2">Resumo</Text>
                <Text className="text-base text-muted-foreground mb-2">Você está indo muito bem! Continue investindo para aumentar seus resultados.</Text>
                {/* Espaço para gráfico ou lista de investimentos futuros */}
                <View className="h-32 bg-zinc-200 rounded-xl items-center justify-center">
                    <Text className="text-muted-foreground">(Gráfico de desempenho em breve)</Text>
                </View>
            </Card>
        </View>
    );
}