import { Card } from 'components/ui/card';
import { useRouter } from 'expo-router';
import { Button } from 'components/ui/button';
import { Text } from 'components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from 'components/ui/separator';
import { StarIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ScrollView, View, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Announcement, AnnouncementTag, AnnouncementTitle } from '@/components/ui/announcement';
import { Marquee } from '@animatereactnative/marquee';
const logos = [
  {
    name: 'GitHub',
    icon: (props: Omit<React.ComponentProps<typeof AntDesign>, 'name'>) => (
      <AntDesign name="github" {...props} />
    ),
    url: 'https://github.com',
  },
  {
    name: 'Facebook',
    icon: (props: Omit<React.ComponentProps<typeof FontAwesome>, 'name'>) => (
      <FontAwesome name="facebook" {...props} />
    ),
    url: 'https://facebook.com',
  },
  {
    name: 'Google',
    icon: (props: Omit<React.ComponentProps<typeof FontAwesome>, 'name'>) => (
      <FontAwesome name="google" {...props} />
    ),
    url: 'https://google.com',
  },
  {
    name: 'X',
    icon: (props: Omit<React.ComponentProps<typeof MaterialCommunityIcons>, 'name'>) => (
      <MaterialCommunityIcons name="twitter" {...props} />
    ),
    url: 'https://x.com',
  },
  {
    name: 'Apple',
    icon: (props: Omit<React.ComponentProps<typeof FontAwesome>, 'name'>) => (
      <FontAwesome name="apple" {...props} />
    ),
    url: 'https://apple.com',
  },
  {
    name: 'Instagram',
    icon: (props: Omit<React.ComponentProps<typeof FontAwesome>, 'name'>) => (
      <FontAwesome name="instagram" {...props} />
    ),
    url: 'https://instagram.com',
  }
];

export default function OnboardingHero() {
  const router = useRouter();
  return (
    <View className="flex flex-col gap-16 px-8 py-24 text-center relative">
                  <Image
                    source={require('@/assets/images/OnboardingFundo.png')}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '130%',
                      height: '130%',
                      resizeMode: 'cover',
                      opacity: 0.6,
                      zIndex: 0,
                    }}
                  />
      <View className="flex flex-col items-center justify-center gap-8">
        <Text>
          <Announcement className="mb-0 px-5" themed>
            <AnnouncementTag>Novo!</AnnouncementTag>
            <AnnouncementTitle>Controle total das suas finanças</AnnouncementTitle>
          </Announcement>
        </Text>
        <Text className="mb-0 text-balance text-6xl font-medium md:text-7xl xl:text-[5.25rem]">
          O melhor modo de investir seu dinheiro 
        </Text>
        <Text className="mb-0 mt-0 text-balance text-lg text-muted-foreground">
          Bem-vindo ao Investae! Acompanhe suas informações financeiras, preencha formulários personalizados e tenha controle total das suas finanças em um só lugar.
        </Text>
        <View className="flex-row items-center gap-2">
          <Button onPress={() => router.push('/login')} size="lg">
            <Text>Entrar Agora</Text>
          </Button>
          <Button variant="outline" onPress={() => router.push('/register')}>
            <Text className="no-underline">Criar conta</Text>
          </Button>
        </View>
      </View>
      <View className="pb-18 flex flex-col items-center justify-center gap-8 rounded-xl bg-secondary py-8 w-full">
        <Marquee spacing={0} speed={0.4}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {logos.map((logo) => (
              <View key={logo.name} style={{ marginHorizontal: 20 }}>
                {logo.icon({ size: 32, color: '#333' })}
              </View>
            ))}
          </View>
        </Marquee>
      </View>
    </View>
  );
}
