
import React from 'react';
import { View, ScrollView, TouchableOpacity, Animated, useColorScheme } from 'react-native';
import { useFormContext } from '@/contexts/FormContext';
import { CreditCard as Edit2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Separator } from '@/components/ui/separator';
import { THEME } from '@/lib/theme';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SummaryScreen() {
  const { formState, salvarDados } = useFormContext();
  const [salvandoDados, setSalvandoDados] = React.useState(false);
  const colorAnim = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  // Funções helpers
  const formatCurrency = (value: string) => {
    if (!value) return 'Não informado';
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 'Não informado';
    return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  const getKnowledgeLevelText = () => {
    switch (formState.knowledgeLevel) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return 'Não informado';
    }
  };
  const getRiskToleranceText = () => {
    switch (formState.riskTolerance) {
      case 'conservative': return 'Conservador';
      case 'moderate': return 'Moderado';
      case 'aggressive': return 'Agressivo';
      default: return 'Não informado';
    }
  };
  const getInvestmentHorizonText = () => {
    switch (formState.investmentHorizon) {
      case 'short': return 'Curto prazo (até 2 anos)';
      case 'medium': return 'Médio prazo (2 a 5 anos)';
      case 'long': return 'Longo prazo (mais de 5 anos)';
      default: return 'Não informado';
    }
  };
  const getLiquidityPreferenceText = () => {
    switch (formState.liquidityPreference) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Não informado';
    }
  };
  const navigateToSection = (section: string) => {
    // @ts-ignore
    navigation.navigate(`${section}`, { origin: 'summary' });
  };
  const handleSalvar = () => {
    if (salvarDados) salvarDados();
    setSalvandoDados(true);
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }).start(() => setSalvandoDados(false));
      }, 1200);
    });
    setTimeout(() => {
      navigateToSection('Home');
    }, 2000);
  };
  const buttonBackgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.primary, '#86c772'],
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
      <View className="mb-2">
        <Text className="mb-0 text-2xl font-bold">Resumo do perfil</Text>
        <Text className="text-base text-muted-foreground mb-4">Confira abaixo todas as informações do seu perfil de investidor e faça ajustes, se necessário.</Text>
      </View>

      {/* Informações Pessoais */}
      <Card className="mb-4" style={{ backgroundColor: theme.primaryForeground }}>
        <CardHeader className="flex-row items-center justify-between">
          <Text className="font-semibold">Informações Pessoais</Text>
          <TouchableOpacity className="flex-row items-center px-2 py-1" onPress={() => navigateToSection('FormPersonal')}>
            <Edit2 size={16} color={theme.primary} />
            <Text className="ml-1 text-primary">Editar</Text>
          </TouchableOpacity>
        </CardHeader>
        <Separator />
        <View className="gap-2 px-4 pb-4">
          <Text><Text className="font-medium">Nome Completo:</Text> {formState.fullName || 'Não informado'}</Text>
          <Text><Text className="font-medium">E-mail:</Text> {formState.email || 'Não informado'}</Text>
          <Text><Text className="font-medium">CPF:</Text> {formState.documentId || 'Não informado'}</Text>
          <Text><Text className="font-medium">Data de Nascimento:</Text> {formState.birthDate || 'Não informado'}</Text>
          <Text><Text className="font-medium">Telefone:</Text> {formState.phone || 'Não informado'}</Text>
        </View>
      </Card>

      {/* Perfil Financeiro */}
      <Card className="mb-4" style={{ backgroundColor: theme.primaryForeground }}>
        <CardHeader className="flex-row items-center justify-between">
          <Text className="font-semibold">Perfil Financeiro</Text>
          <TouchableOpacity className="flex-row items-center px-2 py-1" onPress={() => navigateToSection('FormFinancial')}>
            <Edit2 size={16} color={theme.primary} />
            <Text className="ml-1 text-primary">Editar</Text>
          </TouchableOpacity>
        </CardHeader>
        <Separator />
        <View className="gap-2 px-4 pb-4">
          <Text><Text className="font-medium">Renda Mensal:</Text> {formatCurrency(formState.monthlyIncome)}</Text>
          <Text><Text className="font-medium">Patrimônio Total:</Text> {formatCurrency(formState.totalAssets)}</Text>
          <Text><Text className="font-medium">Valor para Investir:</Text> {formatCurrency(formState.investmentAmount)}</Text>
          <Text><Text className="font-medium">Aportes Mensais:</Text> {formState.monthlyContribution.hasContribution ? formatCurrency(formState.monthlyContribution.amount) : 'Não pretende fazer aportes'}</Text>
        </View>
      </Card>

      {/* Perfil de Investidor */}
      <Card className="mb-4" style={{ backgroundColor: theme.primaryForeground }}>
        <CardHeader className="flex-row items-center justify-between">
          <Text className="font-semibold">Perfil de Investidor</Text>
          <TouchableOpacity className="flex-row items-center px-2 py-1" onPress={() => navigateToSection('Forminvestor')}>
            <Edit2 size={16} color={theme.primary} />
            <Text className="ml-1 text-primary">Editar</Text>
          </TouchableOpacity>
        </CardHeader>
        <Separator />
        <View className="gap-2 px-4 pb-4">
          <Text><Text className="font-medium">Conhecimento:</Text> {getKnowledgeLevelText()}</Text>
          <Text><Text className="font-medium">Tolerância ao Risco:</Text> {getRiskToleranceText()}</Text>
          <Text className="font-medium">Objetivos:</Text>
          <View className="flex-row flex-wrap mt-1 mb-2 gap-2">
            {formState.objectives.emergencyReserve && (
              <Badge><Text className="font-medium">Reserva de emergência</Text></Badge>
            )}
            {formState.objectives.retirement && (
              <Badge><Text className="font-medium">Aposentadoria</Text></Badge>
            )}
            {formState.objectives.realEstate && (
              <Badge><Text className="font-medium">Compra de imóvel</Text></Badge>
            )}
            {formState.objectives.shortTermProfit && (
              <Badge><Text className="font-medium">Lucro no curto prazo</Text></Badge>
            )}
            {formState.objectives.other && (
              <Badge><Text className="font-medium">{formState.objectives.otherText}</Text></Badge>
            )}
          </View>
          <Text><Text className="font-medium">Horizonte:</Text> {getInvestmentHorizonText()}</Text>
        </View>
      </Card>

      {/* Preferências Pessoais */}
      <Card className="mb-4" style={{ backgroundColor: theme.primaryForeground }}>
        <CardHeader className="flex-row items-center justify-between">
          <Text className="font-semibold">Preferências Pessoais</Text>
          <TouchableOpacity className="flex-row items-center px-2 py-1" onPress={() => navigateToSection('FormPreferences')}>
            <Edit2 size={16} color={theme.primary} />
            <Text className="ml-1 text-primary">Editar</Text>
          </TouchableOpacity>
        </CardHeader>
        <Separator />
        <View className="gap-2 px-4 pb-4">
          <Text><Text className="font-medium">Liquidez:</Text> {getLiquidityPreferenceText()}</Text>
          <Text><Text className="font-medium">Interesse em ESG:</Text> {formState.esgInterest ? 'Sim' : 'Não'}</Text>
          <Text><Text className="font-medium">Experiência Prévia:</Text> {formState.previousInvestmentExperience ? 'Sim' : 'Não'}</Text>
          <Text className="font-medium">Ativos de Interesse:</Text>
          <View className="flex-row flex-wrap mt-1 mb-2 gap-2">
            {formState.assetInterests.fixedIncome && (
              <Badge ><Text className="font-medium">Renda Fixa</Text></Badge>
            )}
            {formState.assetInterests.stocks && (
              <Badge ><Text className="font-medium">Ações</Text></Badge>
            )}
            {formState.assetInterests.realEstateFunds && (
              <Badge ><Text className="font-medium">Fundos Imobiliários</Text></Badge>
            )}
            {formState.assetInterests.multiMarketFunds && (
              <Badge ><Text className="font-medium">Fundos Multimercado</Text></Badge>
            )}
            {formState.assetInterests.crypto && (
              <Badge ><Text className="font-medium">Criptoativos</Text></Badge>
            )}
            {formState.assetInterests.etfs && (
              <Badge ><Text className="font-medium">ETFs</Text></Badge>
            )}
            {formState.assetInterests.other && (
              <Badge ><Text className="font-medium">{formState.assetInterests.otherText}</Text></Badge>
            )}
          </View>
        </View>
      </Card>

      {/* Consentimentos */}
      <Card className="mb-4" style={{ backgroundColor: theme.primaryForeground }}>
        <CardHeader className="flex-row items-center justify-between">
          <Text className="font-semibold">Consentimentos</Text>
        </CardHeader>
        <Separator />
        <View className="gap-2 px-4 pb-4">
          <Text><Text className="font-medium">Termos de Uso:</Text> {formState.termsAccepted ? 'Aceito' : 'Não aceito'}</Text>
          <Text><Text className="font-medium">Uso de Dados:</Text> {formState.dataUseConsent ? 'Autorizado' : 'Não autorizado'}</Text>
        </View>
      </Card>

      {/* Botão de Salvar */}
      <View className="mb-6">
        <Animated.View style={{ borderRadius: 8, overflow: 'hidden', backgroundColor: buttonBackgroundColor }}>
          <Button
            onPress={handleSalvar}
            className="flex-row items-center justify-center bg-transparent"
            style={{ elevation: 0 }}
          >
            {salvandoDados && (
              <LottieView
                source={require('../../assets/icons/SalveIcon.json')}
                autoPlay
                loop={false}
                speed={0.5}
                style={{ width: 32, height: 32 }}
                colorFilters={[
                  { keypath: 'Stroke 1', color: '#fff' },
                  { keypath: 'Fill 1', color: '#fff' },
                ]}
              />
            )}
            {!salvandoDados && <Text className="font-semibold">Salvar</Text>}
          </Button>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
