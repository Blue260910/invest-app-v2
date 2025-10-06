import { useNavigation } from '@react-navigation/native';
import { Button } from 'components/ui/button';
import { View, useColorScheme, Image, ScrollView, StyleSheet } from 'react-native';
import { Brain, EyeIcon, EyeClosedIcon } from 'lucide-react-native';
import { SectionCards } from '@/components/section-cards';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Separator } from 'components/ui/separator';
import { THEME } from '@/lib/theme';
import { useFormContext } from '../../contexts/FormContext';
import { useEffect, useState } from 'react';
import { useMensagemInicial } from '../../contexts/MensagemInicialContext';
import { useAuth } from '@/contexts/AuthContext';


export default function Dashboard() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const { recuperarDados } = useFormContext();
  const { setMensagemInicial } = useMensagemInicial();
  const [input, setInput] = useState('');

  const { user } = useAuth();
  const avatar = user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  const username = user?.user_metadata?.first_name || 'Usuário';
  

  // Mock data
  const cards = [
    {
      type: 'Conta',
      label: 'Conta Investimento',
      balance: 12500.45,
      color: '#E9E6FB',
      textColor: '#3B2E7E',
      brand: 'XP Investimentos',
      date: '06/10',
      icon: require('@/assets/icons/SalveIcon.json'),
      bgImage: require('@/assets/images/FundoCardRoxo.png'),
    },
    {
      type: 'Poupança',
      label: 'Conta Poupança',
      balance: 18500.00,
      color: '#FFE6D1',
      textColor: '#B96A1B',
      brand: 'Banco Inter',
      date: '06/10',
      icon: require('@/assets/icons/SalveIcon.json'),
      bgImage: require('@/assets/images/FundoCardLaranja.png'),
    },
  ];

  const transactions = [
    {
      title: 'Compra de Ações PETR4',
      date: 'Hoje, 10:15',
      amount: -1500,
      icon: 'stock',
    },
    {
      title: 'Dividendos ITUB4',
      date: 'Ontem, 18:00',
      amount: 320,
      icon: 'dividend',
    },
    {
      title: 'Venda de FII HGLG11',
      date: '03/10, 16:40',
      amount: 2500,
      icon: 'stock',
    },
  ];

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
    <View className="p-4 flex-1 justify-between">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <View className="flex-row items-center">
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.card, marginRight: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
              {/* Avatar mock */}
              <Image source={{ uri: avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            </View>
            <View>
              <Text style={{ color: theme.cardForeground, fontSize: 12 }}>Bem-vindo de volta</Text>
              <Text style={{ color: theme.cardForeground, fontWeight: 'bold', fontSize: 16 }}>{username}</Text>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: theme.card, borderRadius: 20, padding: 8 }}>
          <Brain color={theme.primary} size={22} />
        </View>
      </View>

      {/* Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        style={{ marginBottom: 16 }}
      >
        {cards.map((card, idx) => (
          <View
            key={idx}
            style={{
              backgroundColor: card.color,
              borderRadius: 24,
              marginRight: 20,
              padding: 24,
              position: 'relative',
              overflow: 'hidden',
              width: 230,
            }}
            className='flex-1 flex-collumn justify-between'
          >
            {/* Imagem de fundo local diferente para cada card */}
            <Image
              source={card.bgImage}
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
            {/* Conteúdo do card */}
            <View style={{ zIndex: 1 }} className='flex-1 justify-between'>
              <View>
                <Text style={{ color: card.textColor, fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>{card.label}</Text>
                <View className='flex-column align-items-center mt-6'>
                  <View className='flex-row items-center mb-1 justify-between w-full'>
                    <Text style={{ color: card.textColor, fontSize: 12, marginRight: 6 }}>Saldo Total</Text>
                    <EyeIcon strokeWidth={2} color={card.textColor} style={{ width: 16, height: 16}} />
                  </View>
                  <Text style={{ color: card.textColor, fontWeight: 'bold', fontSize: 24, marginBottom: 8 }}>
                    {`R$ ${card.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  </Text> 
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                <Text style={{ color: card.textColor, fontSize: 12, fontWeight: 'bold' }}>{card.brand}</Text>
                <Text style={{ color: card.textColor, fontSize: 12 }}>{card.date}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Chat input (mantido) */}
      <View
        className="flex-row items-center rounded-xl px-2 py-2 shadow-sm border mb-4"
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

      {/* Sugestão de ativos */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text style={{ color: theme.cardForeground, fontWeight: 'bold', fontSize: 16 }}>Sugestões de Ativos</Text>
          <Text style={{ color: theme.primary, fontSize: 12 }}>Ver Todos</Text>
        </View>
        <View className="flex-row items-center">
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
            <Text style={{ color: theme.card, fontSize: 28, fontWeight: 'bold' }}>+</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row' }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.card, justifyContent: 'center', alignItems: 'center', marginRight: 8, overflow: 'hidden' }}>
              <Image source={{ uri: 'https://companieslogo.com/img/orig/PBR-435ea1d8.png?t=1647968022' }} style={{ width: 48, height: 48, borderRadius: 24 }} />
            </View>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.card, justifyContent: 'center', alignItems: 'center', marginRight: 8, overflow: 'hidden' }}>
              <Image source={{ uri: 'https://th.bing.com/th/id/OIP.d6PMGhCxBzkfNEBiwpXuswHaHa?w=167&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3' }} style={{ width: 48, height: 48, borderRadius: 24 }} />
            </View>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.card, justifyContent: 'center', alignItems: 'center', marginRight: 8, overflow: 'hidden' }}>
              <Image source={{ uri: 'https://tse3.mm.bing.net/th/id/OIP.lI72pwpoK_gzwo6S_PUQYgHaEc?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3' }} style={{ width: 48, height: 48, borderRadius: 24 }} />
            </View>
            {/* Adicione mais ativos aqui se quiser */}
          </ScrollView>
        </View>
      </View>

      {/* Operações recentes */}
      <View style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between mb-2">
          <Text style={{ color: theme.cardForeground, fontWeight: 'bold', fontSize: 16 }}>Operações Recentes</Text>
          <Text style={{ color: theme.primary, fontSize: 12 }}>Ver Todas</Text>
        </View>
        <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
          {transactions.map((tx, idx) => (
            <View key={idx} className="flex-row items-center justify-between mb-1" style={{ backgroundColor: theme.card, borderRadius: 12, padding: 12 }}>
              <View className="flex-row items-center">
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ color: theme.card, fontSize: 18 }}>
                    {tx.icon === 'stock' ? '📈' : tx.icon === 'dividend' ? '💰' : '⇄'}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: theme.cardForeground, fontWeight: 'bold', fontSize: 14 }}>{tx.title}</Text>
                  <Text style={{ color: theme.mutedForeground, fontSize: 12 }}>{tx.date}</Text>
                </View>
              </View>
              <Text style={{ color: tx.amount < 0 ? '#E24C4B' : theme.primary, fontWeight: 'bold', fontSize: 16 }}>
                {tx.amount < 0 ? '-' : '+'}R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
