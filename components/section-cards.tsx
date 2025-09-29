import { TrendingUp } from 'lucide-react-native';
import { ScrollView, View, useColorScheme } from 'react-native';
import { Text } from '@/components/ui/text';
import { Separator } from 'components/ui/separator';
import { THEME } from '@/lib/theme';



import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
export function SectionCards() {
    const colorScheme = useColorScheme();
    const theme = THEME[colorScheme ?? 'light'];
  return (
    <ScrollView
      horizontal
      className="flex flex-row flex-wrap"
      showsHorizontalScrollIndicator={false}>
      <Card style={{ backgroundColor: theme.primaryForeground }} className="@container/card mx-1 w-[270px] px-1">
        <CardHeader>
          <View className="mb-2 flex flex-row items-center justify-between">
            <CardDescription className="mb-0 text-sm text-muted-foreground">
              Carteira Total
            </CardDescription>
            <Badge variant="outline" className="px-2 py-1">
              <Text className="text-xs font-semibold text-green-600">+2,1% mês</Text>
            </Badge>
          </View>
          <CardTitle className="text-base font-bold tabular-nums">R$ 85.320,00</CardTitle>
          <Separator className="my-1" />
          <View className="flex flex-col items-start gap-0.5">
            <Text className="text-xs text-muted-foreground">Crescimento mensal</Text>
          </View>
        </CardHeader>
      </Card>
      <Card style={{ backgroundColor: theme.primaryForeground }} className="@container/card mx-1 w-[270px] px-1">
        <CardHeader>
          <View className="mb-2 flex flex-row items-center justify-between">
            <CardDescription className="mb-0 text-sm text-muted-foreground">
              Carteira Total
            </CardDescription>
            <Badge variant="outline" className="px-2 py-1">
              <Text className="text-xs font-semibold text-green-600">+2,1% mês</Text>
            </Badge>
          </View>
          <CardTitle className="text-base font-bold tabular-nums">R$ 85.320,00</CardTitle>
          <Separator className="my-1" />
          <View className="flex flex-col items-start gap-0.5">
            <Text className="text-xs text-muted-foreground">Crescimento mensal</Text>
          </View>
        </CardHeader>
      </Card>
    </ScrollView>
  );
}
