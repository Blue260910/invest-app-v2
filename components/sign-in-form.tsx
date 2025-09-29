import React, { useState, useEffect } from 'react';
import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { Pressable, type TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginFormData, loginSchema } from '@/lib/validation';
import { signInWithEmail, biometricRelogin } from '@/lib/auth';
import { useRouter } from 'expo-router';

export function SignInForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  const handleEmailFocus = async () => {
    setIsLoading(true);
    setError(null);
    const email = await AsyncStorage.getItem('user_email');
    const password = await AsyncStorage.getItem('user_password');
    if (email && password) {
      const result = await biometricRelogin();
      if (result && result.message && result.message !== 'Biometria não disponível ou não cadastrada.' && result.message !== 'Credenciais não encontradas para relogin automático.') {
        setError(result.message);
      }
    }
    setIsLoading(false);
  };

  const handleLogin = async (data: LoginFormData): Promise<{ message?: string } | null> => {
    setIsLoading(true);
    setError(null);
    const result = await signInWithEmail(data.email, data.password);
    if (result == null) {
      // Login bem-sucedido: salva credenciais para biometria
      try {
        await import('@react-native-async-storage/async-storage').then(AsyncStorageModule => {
          const AsyncStorage = AsyncStorageModule.default;
          AsyncStorage.setItem('user_email', data.email);
          AsyncStorage.setItem('user_password', data.password);
        });
      } catch (e) {
        // Não impede login, apenas loga erro
        console.error('Erro ao salvar credenciais para biometria:', e);
      }
    } else {
      setError(result.message ?? 'Erro desconhecido');
    }
    setIsLoading(false);
    return result;
  };

    async function onSubmit() {
      setError(null);
      setIsLoading(true);
      const result = await handleLogin({ email, password });
      setIsLoading(false);
      if (result == null) {
        // Login bem-sucedido: navega para tela protegida
        router.replace('/'); // ajuste para rota protegida desejada
      } // erro já tratado em handleLogin
    }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Sign in to your app</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  onSubmitEditing={onEmailSubmitEditing}
                  onFocus={handleEmailFocus}
                  returnKeyType="next"
                  submitBehavior="submit"
                  value={email}
                  onChangeText={setEmail}
                />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                  onPress={() => {
                    router.push('/');
                  }}>
                  <Text className="font-normal leading-4">Esqueceu a senha?</Text>
                </Button>
              </View>
                <Input
                  ref={passwordInputRef}
                  id="password"
                  secureTextEntry
                  returnKeyType="send"
                  onSubmitEditing={onSubmit}
                  value={password}
                  onChangeText={setPassword}
                />
            </View>
              <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
                <Text>{isLoading ? 'Entrando...' : 'Continuar'}</Text>
              </Button>
              {error && (
                <Text className="text-center text-red-500 text-sm mt-2">{error}</Text>
              )}
          </View>
          <Text className="text-center text-sm">
              Não tem uma conta?{' '}
              <Pressable
                onPress={() => {
                  router.push('/register');
                }}>
                <Text className="text-sm underline underline-offset-4">Cadastre-se</Text>
              </Pressable>
            </Text>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="text-muted-foreground px-4 text-sm">or</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
