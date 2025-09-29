import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import { Pressable, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { UserRound, Contact, Lock, Mail, Pencil, Camera } from 'lucide-react-native';
import { signUpWithEmail } from '@/lib/auth';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';



export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = React.useState(1);
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      completeName: '',
      telephone: '',
      address: '',
      profileImage: '', 
    },
    mode: 'onTouched',
  });

  // Simulação de função de seleção de imagem
  const [profileImage, setProfileImage] = useState(''); 
  
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setValue('profileImage', result.assets[0].uri); 
    }

  };

  async function onSubmit(data: any) {
    setIsLoading(true);
    setError(null);

    // Aqui você pode enviar a imagem para o backend junto com os dados do formulário
    const result = await signUpWithEmail(data.email, data.password, data.nickname, data.completeName, data.telephone, data.address, data.profileImage ? data.profileImage : "");

    if (result) {
      setError(result.message);
    }

    setIsLoading(false);
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Crie sua conta</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Bem-vindo! Preencha os dados para começar.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          {step === 1 && (
            <View className="gap-6">
              <Controller
                control={control}
                name="completeName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Label htmlFor="completeName">Nome completo</Label>
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Seu nome completo"
                      returnKeyType="done"
                    />
                    {errors.completeName && (
                      <Text className="text-xs text-red-500 mt-1">{errors.completeName.message?.toString()}</Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={control}
                name="telephone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Label htmlFor="telephone">Telefone</Label>
                    <Input
                      value={value}
                      onChangeText={text => {
                        let cleaned = text.replace(/\D/g, '');
                        if (cleaned.length > 2) {
                          cleaned = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
                        }
                        if (cleaned.length > 10) {
                          cleaned = `${cleaned.slice(0, 10)}-${cleaned.slice(10, 14)}`;
                        }
                        cleaned = cleaned.slice(0, 15);
                        onChange(cleaned);
                      }}
                      onBlur={onBlur}
                      placeholder="(99) 99999-9999"
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                    {errors.telephone && (
                      <Text className="text-xs text-red-500 mt-1">{errors.telephone.message?.toString()}</Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Label htmlFor="address">CEP</Label>
                    <Input
                      value={value}
                      onChangeText={text => {
                        let cleaned = text.replace(/\D/g, '');
                        if (cleaned.length > 5) {
                          cleaned = cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
                        }
                        onChange(cleaned);
                      }}
                      onBlur={onBlur}
                      placeholder="12345-678"
                      keyboardType="phone-pad"
                      returnKeyType="done"
                    />
                    {errors.address && (
                      <Text className="text-xs text-red-500 mt-1">{errors.address.message?.toString()}</Text>
                    )}
                  </View>
                )}
              />
              <Button className="w-full" onPress={() => setStep(2)}>
                <Text>Próximo</Text>
              </Button>
            </View>
          )}
          {step === 2 && (
            <View className="gap-6">
              <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} className="items-center">
                {profileImage ? (
                  <View className="relative">
                    <Image source={{ uri: profileImage }} className="w-24 h-24 rounded-full" />
                    <TouchableOpacity className="absolute bottom-2 right-2 bg-black/60 rounded-full p-1" onPress={handlePickImage}>
                      <Pencil color="#fff" size={18} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                    <Camera color="#aaa" size={32} />
                    <TouchableOpacity className="absolute bottom-2 right-2 bg-black/60 rounded-full p-1" onPress={handlePickImage}>
                      <Pencil color="#fff" size={18} />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
              <Controller
                control={control}
                name="nickname"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Label htmlFor="nickname">Apelido</Label>
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Seu apelido"
                      returnKeyType="done"
                    />
                    {errors.nickname && (
                      <Text className="text-xs text-red-500 mt-1">{errors.nickname.message?.toString()}</Text>
                    )}
                  </View>
                )}
              />
              <Button className="w-full" onPress={() => setStep(3)}>
                <Text>Próximo</Text>
              </Button>
            </View>
          )}
          {step === 3 && (
            <View className="gap-6">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="exemplo@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                    {errors.email && (
                      <Text className="text-xs text-red-500 mt-1">{errors.email.message?.toString()}</Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Sua senha"
                      secureTextEntry
                      returnKeyType="done"
                    />
                    {errors.password && (
                      <Text className="text-xs text-red-500 mt-1">{errors.password.message?.toString()}</Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Confirme sua senha"
                      secureTextEntry
                      returnKeyType="done"
                    />
                    {errors.confirmPassword && (
                      <Text className="text-xs text-red-500 mt-1">{errors.confirmPassword.message?.toString()}</Text>
                    )}
                  </View>
                )}
              />
              <Button className="w-full" onPress={handleSubmit(onSubmit)}>
                <Text>Cadastrar</Text>
              </Button>
            </View>
          )}
          <Text className="text-center text-sm mt-4">
            Já tem uma conta?{' '}
            <Pressable
              onPress={() => {
                // TODO: Navegar para tela de login
              }}>
              <Text className="text-sm underline underline-offset-4">Entrar</Text>
            </Pressable>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
