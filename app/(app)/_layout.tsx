import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import {
  Bell,
  BotMessageSquare,
  Calendar,
  CheckCheck,
  TrendingUp,
  Home as HomeIcon,
  Settings as SettingsIcon,
  User,
} from 'lucide-react-native';
import { FormProvider } from '@/contexts/FormContext';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { UserMenu } from '@/components/user-menu';
import { View } from 'react-native';

// Importando suas telas
import HomeScreen from '@/app/(app)/index';
import OnboardingHero from '@/app/(auth)/onboarding';
import { Button } from 'components/ui/button';
import { Icon } from '@/components/ui/icon';
import { SunIcon, MoonStarIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
// import NotificationsScreen from '@/app/(app)/notifications';
// import SettingsScreen from '@/app/(app)/settings';
import ProfileScreen from '@/app/(app)/profile';
// import SummaryScreen from '@/app/(app)/summary';
// import FormPersonal from '@/app/(app)/form/personal';
// import FormFinancial from '@/app/(app)/form/financial';
// import Forminvestor from '@/app/(app)/form/investor';
// import FormPreferences from '@/app/(app)/form/preferences';
// import FormTerms from '@/app/(app)/form/terms';
// import FormSuccess from '@/app/(app)/form/success';
// import ChatScreen from '@/app/(app)/chat';
// import Diverificador from './diverificador';

const Drawer = createDrawerNavigator();

function ThemeToggleDrawer() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon,
  };
  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="rounded-full m-4 self-center"
      accessibilityLabel="Alternar tema"
    >
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-6" />
    </Button>
  );
}

const AppLayout = () => {
  return (
    <FormProvider>
      <Drawer.Navigator initialRouteName="Home"
        screenOptions={{
          drawerType: 'front',
        }}
        drawerContent={props => (
          <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <DrawerItemList {...props} />
            <View style={{ flex: 1 }} />
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <ThemeToggleDrawer />
            </View>
          </DrawerContentScrollView>
        )}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerLabel: 'Início',
            drawerIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="Perfil"
          component={ProfileScreen}
          options={{
            drawerLabel: 'Início',
            drawerIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
          }}
        />
      </Drawer.Navigator>
    </FormProvider>
  );
};

export default AppLayout;
