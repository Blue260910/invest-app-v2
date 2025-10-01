
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Keyboard } from 'react-native';
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
import type { SharedValue } from "react-native-reanimated";



import { THEME } from '@/lib/theme';

interface Message {
	id: string;
	text: string;
	sender: 'user' | 'bot';
}



const ChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([
        {
        userId: 'bot',
        text: 'Olá! Sou seu assistente financeiro. Como posso te ajudar hoje?'
        }
    ]); 

	const [loading, setLoading] = useState(false);
	const flatListRef = useRef<FlatList>(null);
	const insets = useSafeAreaInsets();
    const { formState, recuperarDados } = useFormContext();
    const [userId, setUserId] = useState<string | null>(null);
    const [chatStarted, setChatStarted] = useState(false);

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

        

        function ToolTip({ x, y, date, value }: { x: SharedValue<number>; y: SharedValue<number>; date: string; value: number}) {
        return (
            <View>
                <Circle cx={x} cy={y} r={12} color="#fff" opacity={0.9} />
                <Circle cx={x} cy={y} r={8} color="black" />
                <SkiaText
                    x={x}
                    y={y.value + 24}
                    font={font!}
                    color="black"
                    text={`${date} - ${value}`}
                />
            </View>
        );
    }

        function FinancialDataCard({ data }: { data: any }) {
            // Cores para variação positiva/negativa
            const isPositive = typeof data.variacao_dia === 'string' && data.variacao_dia.trim().startsWith('+');
            const isNegative = typeof data.variacao_dia === 'string' && data.variacao_dia.trim().startsWith('-');
            const { state, isActive } = useChartPressState<{ x: string; y: Record<"close", number> }>({ x: "", y: { close: 0 } });

            return (
                <Card className="w-4/5">
                    <CardHeader className="flex-row justify-between items-center">
                        <CardTitle style={{ marginBottom: 0, flexShrink: 1 }}>{data.titulo}</CardTitle>
                        <Badge variant="secondary" className="ml-2 px-2 py-1">
                            <UIText className="text-xs font-mono tracking-wider">{data.codigo}</UIText>
                        </Badge>
                    </CardHeader>
                    <Separator />
                    <CardContent className="h-40">
                        <CartesianChart
                            data={DATAGRAFICOTESTE}
                            xKey="date" yKeys={["close"]}
                            chartPressState={state} // 👈 and pass it to our chart.
                        >
                            {({ points }) => (
                                <>
                                    <Line points={points.close} color="red" strokeWidth={3} />
                                    {isActive ? (
                                        <ToolTip x={state.x.position} y={state.y.close.position} date={state.x.value.value} value={state.y.close.value.value} />
                                    ) : null}
                                </>
                            )}
                        </CartesianChart>
                    </CardContent>
                    <CardFooter className="flex-row items-end justify-between">
                        <View>
                            <UIText className="text-2xl font-bold leading-tight">{data.valor}</UIText>
                            <Badge variant="outline" className="mt-1 px-2 py-1">
                                <UIText >{data.variacao_dia ?? '--'} Hoje</UIText>
                            </Badge>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <UIText className="text-[10px] text-muted-foreground">Fonte: {data.fonte}</UIText>
                            <UIText className="text-[10px] text-muted-foreground">{data.data}</UIText>
                        </View>

                    </CardFooter>
                </Card>
            );
        }


    // Componente para exibir a lista de mensagens (deve ser implementado separadamente)
    const MessageList = ({ messages, userId }: { messages: any[]; userId: string }) => {
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
                        <View key={idx} style={{ alignItems: isUser ? 'flex-end' : 'flex-start', marginVertical: 8 }}>
                            <View
                                style={{
                                    borderRadius: 16,
                                    padding: 10,
                                    maxWidth: '90%',
                                    backgroundColor: isUser ? '#2563eb' : '#f3f4f6', // azul para user, cinza claro para bot
                                    borderWidth: isUser ? 1 : 0,
                                    borderColor: isUser ? '#1d4ed8' : 'transparent',
                                }}
                            >
                                {msg.userId === 'bot' ? (
                                    <Markdown style={{ body: { color: '#222', fontSize: 16 } }}>{msg.text}</Markdown>
                                ) : (
                                    <Text style={{ color: '#fff', fontSize: 16 }}>{msg.text}</Text>
                                )}
                            </View>
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
                texto = texto.replace(/^["\s\n]+|["\s\n]+$/g, '');
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
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : insets.top + 45}
		>
			<View style={{ flex: 1}}>
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
				<View style={{ paddingBottom: insets.bottom, backgroundColor: THEME.light.background }}>
					<ChatInput loading={loading} onSend={handleSend} />
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default ChatScreen;
