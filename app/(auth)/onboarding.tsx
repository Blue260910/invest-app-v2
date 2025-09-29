import { Card } from 'components/ui/card';
import { useRouter } from 'expo-router';
import { Button } from 'components/ui/button';
import { Text } from 'components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from 'components/ui/separator';
import { THEME } from '@/lib/theme';
import { MoonStarIcon, StarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Icon } from '@/components/ui/icon';

const SCREEN_OPTIONS = {
  light: {
    title: 'React Native Reusables',
    headerTransparent: true,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.light.background },
    headerRight: () => <ThemeToggle />,
  },
  dark: {
    title: 'React Native Reusables',
    headerTransparent: true,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.dark.background },
    headerRight: () => <ThemeToggle />,
  },
};


export default function OnboardingHero() {
  const router = useRouter();
  return (
    <Card className="items-center p-8 mt-10 mx-4 bg-gradient-to-br from-zinc-50 to-zinc-200 shadow-xl rounded-2xl border border-zinc-300">
      <Avatar className="w-24 h-24 mb-4 border-4 border-zinc-800 shadow-md bg-zinc-100" alt="Avatar do usuário">
        <AvatarImage src={require('@/assets/images/react-native-reusables-light.png')} style={{ tintColor: '#222' }} />
        <AvatarFallback>
          <Text className="text-xl font-bold text-zinc-800">IA</Text>
        </AvatarFallback>
      </Avatar>
      <Icon as={StarIcon} className="size-8 text-zinc-900 mb-2 opacity-60" />
      <Text className="text-3xl font-extrabold text-center mb-2 text-zinc-900 tracking-tight">Bem-vindo ao Invest App</Text>
      <Text className="text-base text-center text-zinc-700 mb-4">
        <Text className="font-bold text-zinc-900">Minimalismo, tecnologia e segurança.</Text>{"\n"}
        Invista com praticidade e estilo. Seu futuro financeiro, agora com design moderno e sofisticado.
      </Text>
      <Separator className="my-6 bg-zinc-300" />
      <Button className="w-full bg-zinc-900 active:bg-zinc-800 py-3 rounded-xl shadow-md" onPress={() => {
        router.push('/login');
      }}>
        <Text className="text-lg font-bold text-white">Começar</Text>
      </Button>
      <Text className="text-xs text-zinc-500 mt-4 text-center">O novo preto é investir com inteligência.</Text>
    </Card>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
