import { useNavigation } from '@react-navigation/native';
import { Button } from 'components/ui/button';
import { View, useColorScheme } from 'react-native';
import { Brain } from 'lucide-react-native';
import { SectionCards } from '@/components/section-cards';
import { Input } from '@/components/ui/input';
import { Separator } from 'components/ui/separator';
import { THEME } from '@/lib/theme';
import { useFormContext } from '../../contexts/FormContext';
import { useEffect, useState } from 'react';
import { useMensagemInicial } from '../../contexts/MensagemInicialContext';


export default function Dashboard() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const { recuperarDados } = useFormContext();
  const { setMensagemInicial } = useMensagemInicial();
  const [input, setInput] = useState('');

  useEffect(() => {
    if (recuperarDados) recuperarDados();
  }, []);

  function handleSend() {
    if (!input.trim()) return;
    setMensagemInicial(input);
    setInput('');
  navigation.navigate('Chat' as never);
  }

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
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Button
          className="ml-2 p-2 rounded-full"
          style={{ backgroundColor: theme.primary }}
          onPress={handleSend}
        >
          <Brain color={theme.primaryForeground} size={22} style={{ transform: [{ rotate: '360deg' }] }} />
        </Button>
      </View>
    </View>
  );
}
