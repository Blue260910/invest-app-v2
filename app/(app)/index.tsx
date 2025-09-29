import { useRouter } from 'expo-router';
import { Button } from 'components/ui/button';
import { View, useColorScheme } from 'react-native';
import { Brain } from 'lucide-react-native';
import { SectionCards } from '@/components/section-cards';
import { Input } from '@/components/ui/input';
import { Separator } from 'components/ui/separator';
import { THEME } from '@/lib/theme';


export default function Dashboard() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  // Mock de dados
  const saldo = 12500.75;
  const desempenho = 8.2; // %
  return (
    <View className="p-4">
      <SectionCards />
      <Separator className="my-4" />
      <View
        className="flex-row items-center rounded-xl px-2 py-2 shadow-sm border"
        style={{
          backgroundColor: theme.card,
          borderColor: theme.border,
        }}
      >
        <Input
          placeholder="Em que posso ajudar?"
          className="flex-1 px-2 border-none"
          style={{ color: theme.cardForeground }}
        />
        <Button
          className="ml-2 p-2 rounded-full"
          style={{ backgroundColor: theme.primary }}
        >
          <Brain color={theme.primaryForeground} size={22} style={{ transform: [{ rotate: '360deg' }] }} />
        </Button>
      </View>
    </View>
  );
}
