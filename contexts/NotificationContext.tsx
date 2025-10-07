import { supabase } from '../lib/supabase';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go'
]);

// Configura o handler para mostrar notificação em foreground
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

type NotificationContextType = {
	notify: (title: string, body?: string) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
	useEffect(() => {
		(async () => {
			const { status } = await Notifications.requestPermissionsAsync();
			if (status !== 'granted') {
				alert('Permissão para notificações negada');
			}
		})();

		// Listener para abrir URL ao clicar na notificação
		const subscription = Notifications.addNotificationResponseReceivedListener(response => {
			const url = response.notification.request.content.data?.url;
			if (typeof url === 'string' && url.length > 0) {
				Linking.openURL(url);
			}
		});
		return () => subscription.remove();
	}, []);

	const notify = async (title: string, body?: string) => {
		await Notifications.scheduleNotificationAsync({
			content: {
				title,
				body: body || '',
				sound: true,
			},
			trigger: null,
		});
	};

	return (
		<NotificationContext.Provider value={{ notify }}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) throw new Error('useNotification deve ser usado dentro de NotificationProvider');
	return context;
};

export function useAlertPollingRealtime() {
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão para notificações negada');
      }
    }

    requestPermissions();

    const subscription = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        async (payload) => {
          const alertData = payload.new;
          console.log('Nova notificação recebida:', alertData);
          // Notificação local (funciona em ambos)
          await Notifications.scheduleNotificationAsync({
            content: {
              title: alertData.title || 'Alerta',
              body: alertData.message || '',
              data: { url: alertData.data?.url || 'https://www.globo.com/' },
            },
            trigger: null,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
}

