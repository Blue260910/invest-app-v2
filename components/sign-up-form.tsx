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
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    trigger,
    getValues,
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

    // Validação: senha igual à confirmação
    if (data.password !== data.confirmPassword) {
      setIsLoading(false);
      setError('As senhas não coincidem');
      try {
        const { toast } = await import('sonner-native');
        toast.error('As senhas não coincidem');
      } catch (e) {
        console.error('Erro ao exibir toast:', e);
      }
      return;
    }

    // Aqui você pode enviar a imagem para o backend junto com os dados do formulário
    const result = await signUpWithEmail(
      data.email,
      data.password,
      data.nickname,
      data.completeName,
      data.telephone,
      data.address,
      data.profileImage ? data.profileImage : ''
    );

    if (result) {
      setError(result.message);
      // Exibe erro no toaster
      try {
        const { toast } = await import('sonner-native');
        if (result.message === "User already registered") {
          toast.error("Este e-mail já está em uso.");
        } else if (result.message === "Password should be at least 6 characters") {
          toast.error("A senha deve ter pelo menos 6 caracteres.");
        }
      } catch (e) {
        // Falha ao importar ou exibir toast, apenas loga
        console.error('Erro ao exibir toast:', e);
      }
    }

    setIsLoading(false);
  }

  // Funções para validação dos steps
  const handleStep1 = async () => {
    const valid = await trigger(['completeName', 'telephone', 'address']);
    if (valid) {
      setStep(2);
    } else {
      // Erros já aparecem nos campos
      try {
        const { toast } = await import('sonner-native');
        toast.error('Preencha corretamente os campos obrigatórios.');
      } catch {}
    }
  };

  const handleStep2 = async () => {
    const valid = await trigger(['nickname']);
    if (valid) {
      // Obtém o valor atual do nickname e completeName
      const values = await getValues();
      let nick = values.nickname?.trim();
      if (!nick) {
        // Se nickname está vazio, pega o primeiro nome do completeName
        const firstName = values.completeName?.split(' ')[0] || '';
        setValue('nickname', firstName);
        setStep(3);
      } else {
        setStep(3);
      }
    } else {
      try {
        const { toast } = await import('sonner-native');
        toast.error('Preencha corretamente o apelido.');
      } catch {}
    }
  };

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
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
                rules={{
                  required: 'Nome completo é obrigatório',
                  minLength: { value: 5, message: 'Digite seu nome completo' },
                }}
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
                      <Text className="mt-1 text-xs text-red-500">
                        {errors.completeName.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={control}
                name="telephone"
                rules={{
                  required: 'Telefone é obrigatório',
                  minLength: { value: 11, message: 'Digite seu telefone completo' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Label htmlFor="telephone">Telefone</Label>
                    <Input
                      value={value}
                      onChangeText={(text) => {
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
                      <Text className="mt-1 text-xs text-red-500">
                        {errors.telephone.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={control}
                name="address"
                rules={{
                  required: 'CEP é obrigatório',
                  minLength: { value: 5, message: 'Digite seu CEP completo' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Label htmlFor="address">CEP</Label>
                    <Input
                      value={value}
                      onChangeText={(text) => {
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
                      <Text className="mt-1 text-xs text-red-500">
                        {errors.address.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Button className="w-full" onPress={handleStep1}>
                <Text>Próximo</Text>
              </Button>
            </View>
          )}
          {step === 2 && (
            <View className="gap-6">
              <TouchableOpacity
                onPress={handlePickImage}
                activeOpacity={0.8}
                className="items-center">
                {profileImage ? (
                  <View className="relative">
                    <Image source={{ uri: profileImage }} className="h-24 w-24 rounded-full" />
                    <TouchableOpacity
                      className="absolute bottom-2 right-2 rounded-full bg-black/60 p-1"
                      onPress={handlePickImage}>
                      <Pencil color="#fff" size={18} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                    <Camera color="#aaa" size={32} />
                    <TouchableOpacity
                      className="absolute bottom-2 right-2 rounded-full bg-black/60 p-1"
                      onPress={handlePickImage}>
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
                      <Text className="mt-1 text-xs text-red-500">
                        {errors.nickname.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Button className="w-full" onPress={handleStep2}>
                <Text>Próximo</Text>
              </Button>
            </View>
          )}
          {step === 3 && (
            <View className="gap-6">
              <Controller
              control={control}
              name="email"
              rules={{
                required: 'E-mail é obrigatório',
                pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Digite um e-mail válido',
                },
              }}
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
                  <Text className="mt-1 text-xs text-red-500">
                  {errors.email.message?.toString()}
                  </Text>
                )}
                </View>
              )}
              />
              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 8,
                    message: 'A senha deve ter pelo menos 8 caracteres',
                  },
                  pattern: {
                    value: /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                    message: 'A senha deve conter pelo menos um caractere especial',
                  },
                }}
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
                      <Text className="mt-1 text-xs text-red-500">
                        {errors.password.message?.toString()}
                      </Text>
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
                  <Text className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message?.toString()}
                  </Text>
                )}
                </View>
              )}
              />
              <Button className="w-full" onPress={handleSubmit(onSubmit)}>
              <Text>Cadastrar</Text>
              </Button>
            </View>
          )}
          <Text className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Pressable
              onPress={() => {
                router.push('/login');
              }}>
              <Text className="text-sm underline underline-offset-4">Entrar</Text>
            </Pressable>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
