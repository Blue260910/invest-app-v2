import React from 'react';
// ...existing code...
import { View, ScrollView, TouchableOpacity, Pressable, useColorScheme } from 'react-native';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { THEME } from '@/lib/theme';
import { Pie, PolarChart } from 'victory-native';
import { Car } from 'lucide-react-native';


const data = {
  total: 18000,
  categories: [
    { name: 'Renda Fixa', value: 9000, percent: 50, color: 'bg-green-400' },
    { name: 'Renda Variavel', value: 5400, percent: 30, color: 'bg-pink-300' },
    { name: 'Fundos', value: 3600, percent: 20, color: 'bg-yellow-300' },
  ],
  recent: [
    { name: 'Tesouro Selic', type: 'Renda Fixa', value: 5400 },
    { name: 'ITUB4', type: 'Renda Variavel', value: 3200 },
    { name: 'Fundo XP Macro', type: 'Fundos', value: 2500 },
  ],
};

export default function DiversificadorScreen() {
  const [acoesSelecionadas, setAcoesSelecionadas] = React.useState<string[]>([]);
  const [analise, setAnalise] = React.useState<any | null>(null);
  const colorScheme = useColorScheme() as 'light' | 'dark' | null;
  const theme = THEME[(colorScheme ?? 'light') as 'light' | 'dark'];
  

  const dadosGrafico = [
    { value: 75, color: '#000', label: 'PETR4' },
    { value: 25, color: '#aaaaaa', label: 'VALE3' },
  ];

  const [loading, setLoading] = React.useState(false);
  async function enviarSelecao() {
    if (acoesSelecionadas.length === 2) {
      setLoading(true);
      // Simula uma chamada de API
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      console.log('Enviando seleção:', acoesSelecionadas);
    }
  }
  // Removido duplicidade
  const opcoesAcoes = [
    { nome: 'ITUB4' },
    { nome: 'PETR4' },
    { nome: 'VALE3' },
    { nome: 'BBDC4' },
    { nome: 'WEGE3' },
    { nome: 'ITSA4' },
  ];

  function toggleAcao(nome: string) {
    setAcoesSelecionadas((prev) => {
      let novo;
      if (prev.includes(nome)) {
        novo = prev.filter((a) => a !== nome);
      } else if (prev.length < 3) {
        novo = [...prev, nome];
      } else {
        novo = prev;
      }
      console.log('Ações selecionadas:', novo);
      return novo;
    });
  }

  // Simulação fictícia de distribuição
  const distribuicaoSimulada = [
    { nome: 'ITUB4', valor: 2200, percent: 41 },
    { nome: 'PETR4', valor: 1800, percent: 33 },
    { nome: 'VALE3', valor: 1400, percent: 26 },
  ].filter((acao) => acoesSelecionadas.length === 0 || acoesSelecionadas.includes(acao.nome));

  function calcularDiversificacaoAnalise(analise: any) {
    if (!analise) return null;
    // Cores para os gráficos
    const cores = ['#4ade80', '#f472b6', '#fde047', '#60a5fa', '#a78bfa', '#f87171'];
    return (
      <ScrollView horizontal className="w-full" showsHorizontalScrollIndicator={false} snapToInterval={316} snapToAlignment="center" decelerationRate="fast">
        {Object.entries(analise).map(([perfil, dados]: any, idxPerfil) => {
          // Monta dados para o gráfico
            const azulTons = [
            '#60a5fa', // azul claro
            '#2563eb', // azul médio
            '#1e40af', // azul escuro
            '#3b82f6', // azul padrão
            '#0ea5e9', // azul ciano
            '#38bdf8', // azul celeste
            ];
            const pieData = Object.entries(dados.Pesos).map(([ticker, peso], idx) => ({
            label: ticker,
            value: Number(peso) * 100,
            color: azulTons[idx % azulTons.length],
            }));
          return (
            <Card style={{ width: 300}} key={perfil} className="mb-4 mx-2">
              <View className='w-full'>
                <CardHeader>
                  <CardTitle className='mb-1'>
                    <Text>{perfil}</Text>
                  </CardTitle>
                  <View className="w-300 flex-row justify-between">
                    <Badge variant="outline" className="px-2 py-1">
                      <Text className="text-xs font-semibold">Retorno: {(dados.Retorno * 100).toFixed(2)}%</Text>
                    </Badge>
                    <Badge variant="outline" className="px-2 py-1">
                      <Text className="text-xs font-semibold">Risco: {(dados.Risco * 100).toFixed(2)}%</Text>
                    </Badge>
                  </View>
                  <Separator className="my-2 w-full" />
                  <View className="mt-2 flex-col gap-2">
                    {pieData.map((dado) => (
                      <View
                        key={dado.label}
                        style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <View
                          style={{
                            width: 16,
                            height: 16,
                            backgroundColor: dado.color,
                            borderRadius: 3,
                            marginRight: 8,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            
                          }}
                        />
                        <Text>{dado.label}</Text>
                        <Badge variant="outline" className="ml-auto px-2 py-1">
                          <Text className="text-xs font-semibold">
                            {dado.value.toFixed(2)}%
                          </Text>
                        </Badge>
                      </View>
                    ))}
                  </View>
                </CardHeader>
                <View style={{ height: 220, alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ width: 180, height: 180 }}>
                    <PolarChart
                      data={pieData}
                      labelKey="label"
                      valueKey="value"
                      colorKey="color"
                    >
                      <Pie.Chart innerRadius={'60%'} />
                    </PolarChart>
                  </View>
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    );
  }

  React.useEffect(() => {
    async function fetchAnalise() {
      if (acoesSelecionadas.length === 3) {
        setLoading(true);
        setAnalise(null);
        const tickers = acoesSelecionadas.map(t => t + '.SA').join('%2C');
        try {
          const res = await fetch(`https://api-diversificacao.onrender.com/analise?tickers=${tickers}`);
            // MOCK: simula resposta da API
            // const res = {
            // json: async () => ({
            //   "Conservador": {
            //   "Retorno": 0.123,
            //   "Risco": 0.2566,
            //   "Pesos": {
            //     "ITSA4.SA": 0.6924,
            //     "PETR4.SA": 0.043,
            //     "VALE3.SA": 0.2645
            //   }
            //   },
            //   "Moderado": {
            //   "Retorno": 0.1961,
            //   "Risco": 0.288,
            //   "Pesos": {
            //     "ITSA4.SA": 0.3665,
            //     "PETR4.SA": 0.3709,
            //     "VALE3.SA": 0.2626
            //   }
            //   },
            //   "Arriscado": {
            //   "Retorno": 0.3116,
            //   "Risco": 0.4151,
            //   "Pesos": {
            //     "ITSA4.SA": 0.0266,
            //     "PETR4.SA": 0.9501,
            //     "VALE3.SA": 0.0232
            //   }
            //   }
            // })
            // };
          const json = await res.json();
          setAnalise(json);
        } catch (e) {
          setAnalise(null);
        }
        setLoading(false);
      } else {
        setAnalise(null);
      }
    }
    fetchAnalise();
  }, [acoesSelecionadas]);

  return (
    <ScrollView className="flex-1 bg-background px-4 py-6">
      {/* ...existing code... */}
      <Card className="mb-6" style={{ backgroundColor: theme.primaryForeground }}>
        <CardHeader>
          <CardTitle>
            <Text>Carteira Diversificada</Text>
          </CardTitle>
          <CardDescription>
            <Text>Total investido</Text>
          </CardDescription>
        </CardHeader>
        <CardContent className="items-center">
          <Text variant="h1" className="mb-2">
            R$ {data.total.toLocaleString('pt-BR')}
          </Text>
          <View className="mb-4 flex-row items-center justify-center gap-4">
            {data.categories.map((cat, idx) => (
              <View key={cat.name} className="items-center">
                <Badge variant="secondary" className={cat.color + ' mb-1'}>
                  <Text className="text-xs font-bold">{cat.name}</Text>
                </Badge>
                <Text variant="large">{cat.percent}%</Text>
              </View>
            ))}
          </View>
          <View className="w-full gap-3">
            {data.categories.map((cat) => (
              <View key={cat.name} className="mb-2">
                <View className="mb-1 flex-row justify-between">
                  <Text className="font-medium">{cat.name}</Text>
                  <Text className="font-medium">R$ {cat.value.toLocaleString('pt-BR')}</Text>
                </View>
                <Progress value={cat.percent} />
              </View>
            ))}
          </View>
        </CardContent>
      </Card>

      <Card className="mb-6" style={{ backgroundColor: theme.primaryForeground }}>
        <CardHeader>
          <CardTitle>
            <Text>Distribuição das Ações de Renda Variável</Text>
          </CardTitle>
          <CardDescription>
            <Text>Escolha até 3 ações para simular a distribuição</Text>
          </CardDescription>
        </CardHeader>
        <CardContent className="items-center">
          <View className="mb-4 flex-row flex-wrap justify-center gap-2">
            {opcoesAcoes.map((acao) => (
              <View key={acao.nome}>
                <Button
                  onPress={() => {
                    toggleAcao(acao.nome);
                  }}
                  style={{
                    backgroundColor: acoesSelecionadas.includes(acao.nome)
                      ? theme.primary
                      : theme.mutedForeground,
                  }}>
                  <Text>{acao.nome}</Text>
                </Button>
              </View>
            ))}
          </View>
          <Separator className="my-4 w-full" />
          {acoesSelecionadas.length === 3 ? (
            loading ? (
              <Button
                className="mb-4 flex-row items-center justify-center gap-2"
                disabled
                style={{ opacity: 0.7 }}>
                <Text>Simulando...</Text>
              </Button>
            ) : (
              analise ? calcularDiversificacaoAnalise(analise) : (
                <Text className="text-center text-muted">Selecione até 3 ações para simular</Text>
              )
            )
          ) : (
            distribuicaoSimulada.length === 0 ? (
              <Text className="text-center text-muted">
                Selecione uma ou mais ações acima para simular
              </Text>
            ) : (
              distribuicaoSimulada.map((acao) => (
                <View key={acao.nome} className="mb-3 w-full">
                  <View className="mb-1 flex-row justify-between">
                    <Text className="font-medium">{acao.nome}</Text>
                    <Text className="font-medium">R$ {acao.valor.toLocaleString('pt-BR')}</Text>
                  </View>
                  <Progress value={acao.percent} />
                  <Text className="mt-1 text-right text-xs">{acao.percent}%</Text>
                </View>
              ))
            )
          )}
        </CardContent>
      </Card>

      <Card className="mb-10" style={{ backgroundColor: theme.primaryForeground }}>
        <CardHeader>
          <CardTitle>
            <Text>Investimentos Recentes</Text>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.recent.map((item, idx) => (
            <View key={idx} className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center gap-3">
                <Avatar alt={item.name}>
                  <Text>{item.name[0]}</Text>
                </Avatar>
                <View>
                  <Text className="font-semibold">{item.name}</Text>
                  <Text variant="muted" className="text-xs">
                    {item.type}
                  </Text>
                </View>
              </View>
              <Text className="font-bold text-green-500">
                +R$ {item.value.toLocaleString('pt-BR')}
              </Text>
            </View>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
