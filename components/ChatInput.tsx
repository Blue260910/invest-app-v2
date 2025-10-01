import React, { useState } from 'react';
import { View, TextInput, useColorScheme } from 'react-native';
import { Button } from '@/components/ui/button';
import { THEME } from '@/lib/theme';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brain } from 'lucide-react-native';


interface ChatInputProps {
  loading?: boolean;
  onSend: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ loading, onSend }) => {
  const [input, setInput] = useState('');
  const insets = useSafeAreaInsets();
const colorScheme = useColorScheme();
const theme = THEME[colorScheme ?? 'light'];

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <View className='flex-row items-center p-4 bg-background w-full'>
      <Input
        placeholder="Digite sua mensagem..."
        value={input}
        onChangeText={setInput}
        editable={!loading}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        className='flex-1'
      />
        <Button
          className="ml-2 p-2 rounded-full"
          style={{ backgroundColor: theme.primary }}
            onPress={handleSend}
        >
          <Brain color={theme.primaryForeground} size={22} style={{ transform: [{ rotate: '360deg' }] }} />
        </Button>
    </View>
  );
};
