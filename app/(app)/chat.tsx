import React, { useState, useRef, useEffect } from 'react';
import { useMensagemInicial } from '../../contexts/MensagemInicialContext';
import { View, Text, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Keyboard, useColorScheme, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Clipboard } from 'react-native';
import { AudioLines, Copy, BotMessageSquare} from 'lucide-react-native';
// import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatInput } from '@/components/ChatInput';
import { useFormContext } from '../../contexts/FormContext';
import { startChat, sendMessage, Usuario } from '@/lib/gemini';
import Markdown from 'react-native-markdown-display';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Text as UIText } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { useFont, Circle, Text as SkiaText } from '@shopify/react-native-skia';
import { useAuth } from '@/contexts/AuthContext';



import type { SharedValue } from "react-native-reanimated";



import { THEME } from '@/lib/theme';

interface Message {
	id: string;
	text: string;
	sender: 'user' | 'bot';
}



const ChatScreen: React.FC = () => {
    const { mensagemInicial, setMensagemInicial } = useMensagemInicial();
    const [messages, setMessages] = useState<any[]>([
        {
        userId: 'bot',
        text: 'Olá! Sou seu assistente financeiro. Como posso te ajudar hoje?'
        }
    ]);
    // Sempre que mensagemInicial mudar e não estiver vazia, envie automaticamente
    useEffect(() => {
        if (mensagemInicial && mensagemInicial.trim()) {
            handleSend(mensagemInicial);
            setMensagemInicial('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mensagemInicial]);

    const { user } = useAuth();
    const avatarUser = user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';



	const [loading, setLoading] = useState(false);
	const flatListRef = useRef<FlatList>(null);
	const insets = useSafeAreaInsets();
    const { formState, recuperarDados } = useFormContext();
    const [userId, setUserId] = useState<string | null>(null);
    const [chatStarted, setChatStarted] = useState(false);
    const colorScheme = useColorScheme();
    const theme = THEME[colorScheme ?? 'light'];

    const font = useFont(require('../../assets/fonts/Roboto.ttf'), 14); // 14 é o tamanho da fonte


        // Card para exibir dados financeiros

        // MOCK: dados reais de candles para o gráfico
        const DATAGRAFICOTESTE = [
            { day: 0, close: 31.53, date: "09/16" },
            { day: 1, close: 31.72, date: "09/17" },
            { day: 2, close: 31.41, date: "09/18" },
            { day: 3, close: 31.06, date: "09/19" },
            { day: 4, close: 31.37, date: "09/22" },
            { day: 5, close: 31.90, date: "09/23" },
            { day: 6, close: 32.62, date: "09/24" },
            { day: 7, close: 32.36, date: "09/25" },
            { day: 8, close: 32.25, date: "09/26" },
            { day: 9, close: 31.81, date: "09/29" },
            { day: 10, close: 31.40, date: "10/01" },
        ];

        


        function ToolTip({ x, y, date, value }: { x: number; y: number; date: string; value: number}) {
            return (
                <View>
                    <Circle cx={x} cy={y} r={8} color={"#262626"} />
                </View>
            );        }

        function FinancialDataCard({ data }: { data: any }) {
            // Cores para variação positiva/negativa
            const isPositive = typeof data.variacao_dia === 'string' && data.variacao_dia.trim().startsWith('+');
            const isNegative = typeof data.variacao_dia === 'string' && data.variacao_dia.trim().startsWith('-');
            // Corrigir tipagem para aceitar xKey/yKeys string
            const { state, isActive } = useChartPressState<{ x: string; y: Record<string, number> }>({ x: '', y: { close: 0 } });

            // Estado para manter o tooltip fixo
            const [fixedTooltip, setFixedTooltip] = useState<null | {
                x: number;
                y: number;
                date: string;
                value: number;
            }>(null);

            // Quando o usuário solta o dedo, fixa o tooltip
            useEffect(() => {
                if (!isActive && !fixedTooltip && !isNaN(state.y.close.value.value)) {
                    // Não faz nada se não tem valor
                    return;
                }
                if (!isActive && isNaN(state.y.close.value.value)) {
                    // Se não tem valor, não fixa
                    return;
                }
                if (!isActive && !fixedTooltip && !isNaN(state.y.close.value.value)) {
                    setFixedTooltip({
                        x: state.x.position.value,
                        y: state.y.close.position.value,
                        date: state.x.value.value,
                        value: state.y.close.value.value,
                    });
                }
            }, [isActive]);

            // Se o usuário pressionar novamente, atualiza o tooltip
            useEffect(() => {
                if (isActive && !isNaN(state.y.close.value.value)) {
                    setFixedTooltip({
                        x: state.x.position.value,
                        y: state.y.close.position.value,
                        date: state.x.value.value,
                        value: state.y.close.value.value,
                    });
                }
            }, [isActive, state.x.position.value, state.y.close.position.value, state.x.value.value, state.y.close.value.value]);

            // Função para limpar o tooltip fixo
            const clearTooltip = () => setFixedTooltip(null);


            // Novo: usar dados históricos reais se disponíveis (ajuste para formato { historico: { candles: [...] } })
            let candles: any[] | null = null;
            let historicoErro = false;
            if (data.historico && Array.isArray(data.historico)) {
                // Caso antigo: historico já é array
                candles = data.historico;
            } else if (data.historico && typeof data.historico === 'object' && data.historico !== null) {
                if (Array.isArray(data.historico.candles)) {
                    candles = data.historico.candles;
                } else if (data.historico.error) {
                    historicoErro = true;
                }
            }

            // Normaliza para o formato esperado pelo gráfico
            let historico = candles && candles.length > 0
                ? candles.map((item: any) => ({
                    date: item.date || item.data || '',
                    close: typeof item.close === 'number' ? item.close : Number(item.close)
                }))
                : null;

            // Fallback para dados mock se não houver histórico real
            type GraficoData = { date: string; close: number }[];
            // Só usa o mock se NÃO houver candles válidos E NÃO houver erro
            const graficoData: GraficoData = (!historicoErro && historico && historico.length > 0)
                ? historico
                : (!historicoErro ? DATAGRAFICOTESTE : []);

            // Define a cor da linha: preta no claro, branca no escuro
            const lineColor = colorScheme === 'dark' ? '#fff' : '#000';
            // Consistência visual: fundo, bordas, sombra, padding igual à mensagem do bot
            const botBgColor = colorScheme === 'light' ? 'hsl(0 0% 98%)' : 'hsl(0 0% 9%)';
            const botTextColor = colorScheme === 'dark' ? '#fff' : '#222';
            return (
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginVertical: 4 }}>
                    {/* Avatar do bot */}
                    <View style={{ marginHorizontal: 6 }}>
                        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
                            <BotMessageSquare color={'#fff'} size={20} />
                        </View>
                    </View>
                    {/* Card do gráfico */}
                    <View
                        style={{
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            borderBottomLeftRadius: 4,
                            borderBottomRightRadius: 24,
                            padding: 12,
                            maxWidth: '80%',
                            width: '80%',
                            height: historicoErro ? undefined : 300,
                            backgroundColor: botBgColor,
                            borderWidth: 0,
                            borderColor: 'transparent',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 4 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: botTextColor, flexShrink: 1 }}>{data.titulo}</Text>
                            <View style={{ marginLeft: 8 }}>
                                <Badge variant="secondary" className="px-2 py-1">
                                    <UIText className="text-xs font-mono tracking-wider">{data.codigo}</UIText>
                                </Badge>
                            </View>
                        </View>
                        <Separator />
                        {/* Só mostra o gráfico se não houver erro e houver candles reais OU mock */}
                        {(!historicoErro && graficoData.length > 0) && (
                            <View style={{ position: "relative", height: 160, marginBottom: 8 }}>
                                <View style={{ position: "absolute", bottom: 5, right: 0, zIndex: 1 }}>
                                    <Badge variant="secondary">
                                        <UIText>
                                            {(isActive || fixedTooltip)
                                                ? `${
                                                    isActive
                                                        ? `${state.x.value.value}  |  R$: ${!isNaN(state.y.close.value.value) ? state.y.close.value.value.toFixed(2) : ''}`
                                                        : `${fixedTooltip?.date}  |  R$: ${fixedTooltip?.value?.toFixed(2)}`
                                                }`
                                                : "Variação dos últimos 15 dias"}
                                        </UIText>
                                        {fixedTooltip && (
                                            <UIText onPress={clearTooltip} style={{ color: 'red', marginLeft: 8 }}>✕</UIText>
                                        )}
                                    </Badge>
                                </View>
                                <View  className="flex-1 mb-2"
                                    // Ao pressionar fora do gráfico, limpa o tooltip
                                    onStartShouldSetResponder={() => {
                                        clearTooltip();
                                        return false;
                                    }}
                                >
                                    <CartesianChart
                                        data={graficoData}
                                        xKey={"date"}
                                        yKeys={["close"]}
                                        chartPressState={state as any}
                                        yAxis={[{ lineColor: "#262626" }]}
                                    >
                                        {({ points }: any) => (
                                            <>
                                                {points.close && <Line points={points.close} color={lineColor} strokeWidth={3} />}
                                                {(isActive || fixedTooltip) && (
                                                    <ToolTip
                                                        x={isActive ? state.x.position.value : fixedTooltip!.x}
                                                        y={isActive ? state.y.close.position.value : fixedTooltip!.y}
                                                        date={isActive ? state.x.value.value : fixedTooltip!.date}
                                                        value={isActive ? state.y.close.value.value : fixedTooltip!.value}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </CartesianChart>
                                </View>
                                <Separator />
                            </View>
                        )}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 }}>
                            <View>
                                <UIText className="text-2xl font-bold leading-tight" style={{ color: botTextColor }}>{data.valor}</UIText>
                                <Badge variant="outline" className="mt-1 px-2 py-1">
                                    <UIText
                                        style={{
                                            color: isPositive
                                                ? '#16a34a' // verde
                                                : isNegative
                                                    ? '#dc2626' // vermelho
                                                    : botTextColor
                                        }}
                                    >
                                        {data.variacao_dia ?? '--'} Hoje
                                    </UIText>
                                </Badge>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <UIText className="text-[10px] text-muted-foreground" style={{ color: botTextColor }}>Fonte: {data.fonte}</UIText>
                                <UIText className="text-[10px] text-muted-foreground" style={{ color: botTextColor }}>{data.data}</UIText>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }


    // Componente para exibir a lista de mensagens (deve ser implementado separadamente)
    const MessageList = ({ messages, userId }: { messages: any[]; userId: string }) => {
        // Define a cor do fundo da mensagem do bot conforme o tema
        const botBgColor = colorScheme === 'light' ? 'hsl(0 0% 98%)' : 'hsl(0 0% 9%)';
        const botTextColor = colorScheme === 'dark' ? '#fff' : '#222';
        return (
            <View style={{ flex: 1 }}>
                {messages.map((msg, idx) => {
                    const isUser = msg.userId === userId;
                    // Se for mensagem do bot e tipo dado_financeiro, renderiza o card
                    if (msg.userId === 'bot' && msg.tipo === 'dado_financeiro') {
                        return (
                            <View key={idx} style={{ alignItems: 'flex-start', marginVertical: 4 }}>
                                <FinancialDataCard data={msg} />
                            </View>
                        );
                    }
                    // Mensagem comum
                    return (
                        <View key={idx} style={{ flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', marginVertical: 8 }}>
                            {/* Avatar */}
                            <View style={{ marginHorizontal: 6 }}>
                                {isUser ? (
                                    avatarUser ? (
                                        <Image
                                            source={{ uri: avatarUser }}
                                            style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2563eb' }}
                                        />
                                    ) : (
                                        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{userId?.charAt(0).toUpperCase() ?? 'U'}</Text>
                                        </View>
                                    )
                                ) : (
                                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
                                        <BotMessageSquare color={'#fff'} size={20} />
                                    </View>
                                )}
                            </View>
                            {/* Bolha de mensagem */}
                            {isUser ? (
                                <LinearGradient
                                    colors={["#2563eb", "#1e40af"]}
                                    start={[0, 0]}
                                    end={[1, 1]}
                                    style={{
                                        borderTopLeftRadius: 24,
                                        borderTopRightRadius: 24,
                                        borderBottomLeftRadius: 24,
                                        borderBottomRightRadius: 4,
                                        padding: 12,
                                        maxWidth: '80%',
                                        borderWidth: 1,
                                        borderColor: '#1d4ed8',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.15,
                                        shadowRadius: 4,
                                        elevation: 3,
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 16 }}>{msg.text}</Text>
                                </LinearGradient>
                            ) : (
                                <View
                                    style={{
                                        borderTopLeftRadius: 24,
                                        borderTopRightRadius: 24,
                                        borderBottomLeftRadius: 4,
                                        borderBottomRightRadius: 24,
                                        padding: 12,
                                        maxWidth: '80%',
                                        backgroundColor: botBgColor,
                                        borderWidth: 0,
                                        borderColor: 'transparent',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.15,
                                        shadowRadius: 4,
                                        elevation: 3,
                                    }}
                                >
                                    <Markdown style={{ body: { color: botTextColor, fontSize: 16 } }}>{msg.text}</Markdown>
                                    <View className='flex-col items-center mt-2'>
                                        <Separator />
                                        <View className='flex-row w-full mt-3 ml-3'>
                                            <Copy
                                                size={20}
                                                color={botTextColor}
                                                style={{ marginRight: 12 }}
                                                onPress={() => Clipboard.setString(msg.text)}
                                            />
                                            <AudioLines
                                                size={22}
                                                color={botTextColor}
                                                onPress={() => Speech.speak(msg.text, { language: 'pt-BR' })}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        );
    };
    function usuarioFromFormState(): Usuario {
        return {
        fullName: formState.fullName || 'Usuário',
        birthDate: formState.birthDate || '1990-01-01',
        knowledgeLevel: formState.knowledgeLevel || 'iniciante',
        riskTolerance: formState.riskTolerance || 'moderado',
        objectives: {
            realEstate: formState.objectives?.realEstate || false,
            retirement: formState.objectives?.retirement || false,
            shortTermProfit: formState.objectives?.shortTermProfit || false,
            emergencyReserve: formState.objectives?.emergencyReserve || false,
            other: formState.objectives?.other || false,           // <-- Adicione esta linha
            otherText: formState.objectives?.otherText || '',      // <-- Adicione esta linha
        },
        assetInterests: {
            crypto: formState.assetInterests?.crypto || false,
            stocks: formState.assetInterests?.stocks || false,
            fixedIncome: formState.assetInterests?.fixedIncome || false,
            realEstateFunds: formState.assetInterests?.realEstateFunds || false,
        },
        monthlyIncome: formState.monthlyIncome || '',
        investmentAmount: formState.investmentAmount || '',
        liquidityPreference: formState.liquidityPreference || '',
        monthlyContribution: {
            amount: formState.monthlyContribution?.amount || '',
            hasContribution: formState.monthlyContribution?.hasContribution || false,
        },
        };
    }

    const handleSend = async (text: string) => {
        if (!text.trim()) return;
        setLoading(true);
        try {
        const usuario = usuarioFromFormState();
        const localUserId = userId || usuario.fullName.replace(/\s+/g, "_").toLowerCase();
        const userMessage = { userId: localUserId, text };
        setMessages((msgs) => [...msgs, userMessage]);
        // Inicia o chat se ainda não foi iniciado
        if (!chatStarted) {
            const result = await startChat(usuario);
            setUserId(result.userId);
            setChatStarted(true);
        }
        // Envia a mensagem para o Gemini
        const resposta = await sendMessage(localUserId, text);
        // A resposta já chega formatada como objeto JSON ou array de objetos
        if (Array.isArray(resposta)) {
            resposta.forEach((item) => {
                if (item.tipo === 'dado_financeiro') {
                    setMessages((msgs) => [...msgs, { userId: 'bot', ...item }]);
                } else {
                    setMessages((msgs) => [...msgs, { userId: 'bot', text: item.resposta || item.text || 'Erro ao obter resposta.' }]);
                }
            });
        } else {
            const respostaObj = resposta;
            if (respostaObj.tipo === 'dado_financeiro') {
                setMessages((msgs) => [...msgs, { userId: 'bot', ...respostaObj }]);
            } else {
                // Garante que respostaObj.resposta seja string
                let texto = respostaObj.resposta || respostaObj.text || 'Erro ao obter resposta.';
                if (typeof texto !== 'string') {
                    try {
                        texto = JSON.stringify(texto, null, 2);
                    } catch {
                        texto = 'Erro ao processar resposta do assistente.';
                    }
                }
                // Remove aspas duplas extras e quebras de linha do início/fim, mesmo com espaços/quebras de linha
                if (typeof texto === 'string') {
                    texto = texto.trim();
                    texto = texto.replace(/^\["\s\n]+|["\s\n]+$/g, '');
                }
                setMessages((msgs) => [...msgs, { userId: 'bot', text: texto }]);
            }
        }
                } catch (e) {
                    let errorMsg = 'Erro ao conectar ao Gemini ou recuperar dados.';
                    if (e instanceof Error) {
                        errorMsg += `\n${e.message}`;
                        if (e.stack) errorMsg += `\n${e.stack}`;
                    } else if (typeof e === 'string') {
                        errorMsg += `\n${e}`;
                    } else {
                        try {
                            errorMsg += `\n${JSON.stringify(e)}`;
                        } catch {}
                    }
                    setMessages((msgs) => [...msgs, { userId: 'bot', text: errorMsg }]);
                } finally {
                    setLoading(false);
                }
    };

	useEffect(() => {
		if (flatListRef.current) {
			flatListRef.current.scrollToEnd({ animated: true });
		}
	}, [messages]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : insets.top + 45}
            >
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={flatListRef}
                        data={[]}
                        keyExtractor={() => ''}
                        renderItem={() => null}
                        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        ListHeaderComponent={<MessageList messages={messages} userId={userId ?? ''} />}
                    />
                    <View>
                        <ChatInput loading={loading} onSend={handleSend} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ChatScreen;
