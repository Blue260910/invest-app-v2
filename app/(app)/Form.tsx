import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import { useFormContext } from '@/contexts/FormContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { Switch } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function MultiStepForm() {
  // Multi-step state
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const { formState, updateField, updateNestedField } = useFormContext();
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    documentId: '',
    birthDate: '',
    phone: '',
    monthlyIncome: '',
    totalAssets: '',
    investmentAmount: '',
    monthlyContributionAmount: '',
    knowledgeLevel: '',
    riskTolerance: '',
    objectives: '',
    investmentHorizon: '',
    otherObjective: '',
    liquidityPreference: '',
    assetInterests: '',
    otherAsset: '',
    terms: '',
  });

  // Validação etapa 4
  const validateStep4 = () => {
    const newErrors = { ...errors, liquidityPreference: '', assetInterests: '', otherAsset: '' };
    let isValid = true;
    if (!formState.liquidityPreference) {
      newErrors.liquidityPreference = 'Selecione sua preferência por liquidez';
      isValid = false;
    }
    const hasAnyAssetInterest =
      formState.assetInterests?.fixedIncome ||
      formState.assetInterests?.stocks ||
      formState.assetInterests?.realEstateFunds ||
      formState.assetInterests?.multiMarketFunds ||
      formState.assetInterests?.crypto ||
      formState.assetInterests?.etfs ||
      formState.assetInterests?.other;
    if (!hasAnyAssetInterest) {
      newErrors.assetInterests = 'Selecione pelo menos um tipo de ativo';
      isValid = false;
    }
    if (formState.assetInterests?.other && !formState.assetInterests.otherText?.trim()) {
      newErrors.otherAsset = 'Especifique o outro tipo de ativo';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  // Validação etapa 5
  const validateStep5 = () => {
    const newErrors = { ...errors, terms: '' };
    let isValid = true;
    if (!formState.termsAccepted || !formState.dataUseConsent) {
      newErrors.terms = 'É necessário aceitar os termos e consentimentos para continuar';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };


  // Validação etapa 1
  const validateStep1 = () => {
    const newErrors = { ...errors, fullName: '', email: '', documentId: '', birthDate: '', phone: '' };
    let isValid = true;
    if (!formState.fullName?.trim()) {
      newErrors.fullName = 'O nome completo é obrigatório';
      isValid = false;
    }
    if (!formState.email?.trim()) {
      newErrors.email = 'O e-mail é obrigatório';
      isValid = false;
    }
    if (!formState.documentId?.trim()) {
      newErrors.documentId = 'O CPF é obrigatório';
      isValid = false;
    }
    if (!formState.birthDate?.trim()) {
      newErrors.birthDate = 'A data de nascimento é obrigatória';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  // Validação etapa 2
  const validateStep2 = () => {
    const newErrors = { ...errors, monthlyIncome: '', totalAssets: '', investmentAmount: '', monthlyContributionAmount: '' };
    let isValid = true;
    if (!formState.monthlyIncome?.trim()) {
      newErrors.monthlyIncome = 'A renda mensal é obrigatória';
      isValid = false;
    }
    if (!formState.totalAssets?.trim()) {
      newErrors.totalAssets = 'O patrimônio total é obrigatório';
      isValid = false;
    }
    if (!formState.investmentAmount?.trim()) {
      newErrors.investmentAmount = 'O valor disponível para investir é obrigatório';
      isValid = false;
    }
    if (formState.monthlyContribution?.hasContribution && !formState.monthlyContribution.amount?.trim()) {
      newErrors.monthlyContributionAmount = 'O valor do aporte mensal é obrigatório';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  // Validação etapa 3
  const validateStep3 = () => {
    const newErrors = { ...errors, knowledgeLevel: '', riskTolerance: '', objectives: '', investmentHorizon: '', otherObjective: '' };
    let isValid = true;
    if (!formState.knowledgeLevel) {
      newErrors.knowledgeLevel = 'Selecione seu nível de conhecimento';
      isValid = false;
    }
    if (!formState.riskTolerance) {
      newErrors.riskTolerance = 'Selecione sua tolerância ao risco';
      isValid = false;
    }
    const hasAnyObjective =
      formState.objectives?.emergencyReserve ||
      formState.objectives?.retirement ||
      formState.objectives?.realEstate ||
      formState.objectives?.shortTermProfit ||
      formState.objectives?.other;
    if (!hasAnyObjective) {
      newErrors.objectives = 'Selecione pelo menos um objetivo';
      isValid = false;
    }
    if (formState.objectives?.other && !formState.objectives.otherText?.trim()) {
      newErrors.otherObjective = 'Descreva seu outro objetivo';
      isValid = false;
    }
    if (!formState.investmentHorizon) {
      newErrors.investmentHorizon = 'Selecione seu horizonte de investimento';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    } else if (step === 3) {
      if (validateStep3()) setStep(4);
    } else if (step === 4) {
      if (validateStep4()) setStep(5);
    } else if (step === 5) {
      if (validateStep5()) {
        setStep(6);
      }
    }
  };

    useEffect(() => {
      const onBackPress = () => {
        if (step > 1) {
          setStep((prev) => prev - 1);
          return true; // impede o comportamento padrão
        }
        return false; // permite voltar para tela anterior se estiver no primeiro step
      };
  
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () => subscription.remove();
    }, [step]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      className='flex-1 justify-start'
    >
      <View className="flex justify-center px-2 py-6">
        <Progress value={(step / totalSteps) * 100} className="h-2 rounded-full mb-2" />
        <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
          <CardHeader>
            {step === 1 &&(<CardTitle className="text-center text-xl">Informações Pessoais</CardTitle>)}
            {step === 2 &&(<CardTitle className="text-center text-xl">Perfil Financeiro</CardTitle>)}
            {step === 3 &&(<CardTitle className="text-center text-xl">Perfil de Investidor</CardTitle>)}
            {step === 4 &&(<CardTitle className="text-center text-xl">Preferências de Investimento</CardTitle>)}
            {step === 5 &&(<CardTitle className="text-center text-xl">Termos e Consentimentos</CardTitle>)}
            {step === 6 &&(<CardTitle className="text-center text-xl">Resumo e Confirmação</CardTitle>)}
          </CardHeader>
          <CardContent className="gap-6 bg-fuchsia-500 flex">
            {step !== 6 ? (
              <ScrollView showsVerticalScrollIndicator={false} className="flex" contentContainerStyle={{paddingBottom: 24}}>
                {step === 1 && (
                  <View className="gap-6">
                    <View>
                      <Label htmlFor="fullName">Nome Completo</Label>
                      <Input
                        value={formState.fullName}
                        onChangeText={text => updateField('fullName', text)}
                        placeholder="Digite seu nome completo"
                        autoCapitalize="words"
                      />
                      {errors.fullName ? <Text className="mt-1 text-xs text-red-500">{errors.fullName}</Text> : null}
                    </View>
                    <View>
                      <Label htmlFor="email">E-mail cadastrado</Label>
                      <Input
                        value={formState.email}
                        onChangeText={text => updateField('email', text)}
                        placeholder="Seu email cadastrado"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                      {errors.email ? <Text className="mt-1 text-xs text-red-500">{errors.email}</Text> : null}
                    </View>
                    <View>
                      <Label htmlFor="documentId">CPF</Label>
                      <Input
                        value={formState.documentId}
                        onChangeText={text => updateField('documentId', text)}
                        placeholder="000.000.000-00"
                        keyboardType="numeric"
                      />
                      {errors.documentId ? <Text className="mt-1 text-xs text-red-500">{errors.documentId}</Text> : null}
                    </View>
                    <View>
                      <Label htmlFor="birthDate">Data de Nascimento</Label>
                      <Input
                        value={formState.birthDate}
                        onChangeText={text => updateField('birthDate', text)}
                        placeholder="DD/MM/AAAA"
                        keyboardType="numeric"
                      />
                      {errors.birthDate ? <Text className="mt-1 text-xs text-red-500">{errors.birthDate}</Text> : null}
                    </View>
                    <View>
                      <Label htmlFor="phone">Telefone (opcional)</Label>
                      <Input
                        value={formState.phone}
                        onChangeText={text => updateField('phone', text)}
                        placeholder="(00) 00000-0000"
                        keyboardType="phone-pad"
                      />
                    </View>
                    <Button className="w-full mt-2" onPress={handleNext}>
                      <Text>Próximo</Text>
                    </Button>
                  </View>
                )}
                {step === 2 && (
                  <View>
                    <View className="mb-4">
                      <Label htmlFor="monthlyIncome">Renda Mensal Aproximada</Label>
                      <Input
                        value={formState.monthlyIncome}
                        onChangeText={text => updateField('monthlyIncome', text)}
                        placeholder="R$ 0,00"
                        keyboardType="numeric"
                      />
                      {errors.monthlyIncome ? <Text className="mt-1 text-xs text-red-500">{errors.monthlyIncome}</Text> : null}
                    </View>
                    <View className="mb-4">
                      <Label htmlFor="totalAssets">Patrimônio Total Estimado</Label>
                      <Input
                        value={formState.totalAssets}
                        onChangeText={text => updateField('totalAssets', text)}
                        placeholder="R$ 0,00"
                        keyboardType="numeric"
                      />
                      {errors.totalAssets ? <Text className="mt-1 text-xs text-red-500">{errors.totalAssets}</Text> : null}
                    </View>
                    <View className="mb-4">
                      <Label htmlFor="investmentAmount">Valor Disponível para Investir</Label>
                      <Input
                        value={formState.investmentAmount}
                        onChangeText={text => updateField('investmentAmount', text)}
                        placeholder="R$ 0,00"
                        keyboardType="numeric"
                      />
                      {errors.investmentAmount ? <Text className="mt-1 text-xs text-red-500">{errors.investmentAmount}</Text> : null}
                    </View>
                    <View className="flex-row items-center justify-between mb-4">
                      <Text className="font-medium">Pretende fazer aportes mensais?</Text>
                      <Switch
                        value={!!formState.monthlyContribution?.hasContribution}
                        onValueChange={value => updateNestedField('monthlyContribution', 'hasContribution', value)}
                        trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                        thumbColor={formState.monthlyContribution?.hasContribution ? '#2563EB' : '#CBD5E1'}
                      />
                    </View>
                    {formState.monthlyContribution?.hasContribution && (
                      <View className="mb-4">
                        <Label htmlFor="monthlyContributionAmount">Valor Estimado do Aporte Mensal</Label>
                        <Input
                          value={formState.monthlyContribution.amount}
                          onChangeText={text => updateNestedField('monthlyContribution', 'amount', text)}
                          placeholder="R$ 0,00"
                          keyboardType="numeric"
                        />
                        {errors.monthlyContributionAmount ? <Text className="mt-1 text-xs text-red-500">{errors.monthlyContributionAmount}</Text> : null}
                      </View>
                    )}
                    <View className="bg-blue-50 rounded-xl p-4 mt-2 mb-2">
                      <Text className="text-sm text-blue-900">
                        Essas informações são importantes para conhecer seu perfil financeiro e oferecer recomendações adequadas à sua situação atual.
                      </Text>
                    </View>
                    <Button className="w-full mt-2" onPress={handleNext}>
                      <Text>Próximo</Text>
                    </Button>
                  </View>
                )}
                {step === 3 && (
                  <View className="gap-3">
                    <Text className="font-semibold mb-1 text-base">Nível de conhecimento</Text>
                    <RadioGroup value={formState.knowledgeLevel} onValueChange={v => updateField('knowledgeLevel', v)}>
                      <View className="flex-row items-center gap-2 mb-1">
                        <RadioGroupItem value="beginner" id="kn1" />
                        <Label htmlFor="kn1" className="text-sm">Iniciante</Label>
                      </View>
                      <View className="flex-row items-center gap-2 mb-1">
                        <RadioGroupItem value="intermediate" id="kn2" />
                        <Label htmlFor="kn2" className="text-sm">Intermediário</Label>
                      </View>
                      <View className="flex-row items-center gap-2 mb-1">
                        <RadioGroupItem value="advanced" id="kn3" />
                        <Label htmlFor="kn3" className="text-sm">Avançado</Label>
                      </View>
                    </RadioGroup>
                    {errors.knowledgeLevel ? <Text className="mt-1 text-xs text-red-500">{errors.knowledgeLevel}</Text> : null}
                    <View className="mt-2">
                      <Text className="font-semibold mb-1 text-base">Tolerância ao risco</Text>
                      <RadioGroup value={formState.riskTolerance} onValueChange={v => updateField('riskTolerance', v)}>
                        <View className="flex-row items-center gap-2 mb-1">
                          <RadioGroupItem value="conservative" id="rt1" />
                          <Label htmlFor="rt1" className="text-sm">Conservador</Label>
                        </View>
                        <View className="flex-row items-center gap-2 mb-1">
                          <RadioGroupItem value="moderate" id="rt2" />
                          <Label htmlFor="rt2" className="text-sm">Moderado</Label>
                        </View>
                        <View className="flex-row items-center gap-2 mb-1">
                          <RadioGroupItem value="aggressive" id="rt3" />
                          <Label htmlFor="rt3" className="text-sm">Agressivo</Label>
                        </View>
                      </RadioGroup>
                      {errors.riskTolerance ? <Text className="mt-1 text-xs text-red-500">{errors.riskTolerance}</Text> : null}
                    </View>
                    <View className="mt-2">
                      <Text className="font-semibold mb-1 text-base">Objetivos principais</Text>
                      <Text className="text-xs text-gray-500 mb-1">Selecione as opções</Text>
                      {([
                        {label:'Reserva de emergência',field:'emergencyReserve'},
                        {label:'Aposentadoria',field:'retirement'},
                        {label:'Compra de imóvel',field:'realEstate'},
                        {label:'Lucro no curto prazo',field:'shortTermProfit'},
                        {label:'Outros',field:'other'}
                      ] as const).map(opt => (
                        <TouchableOpacity
                          key={opt.field}
                          className="flex-row items-center mb-1"
                          onPress={() => updateNestedField('objectives', opt.field, !(formState.objectives?.[opt.field as keyof typeof formState.objectives]))}
                        >
                          <View className={`h-4 w-4 rounded border-2 mr-2 ${formState.objectives?.[opt.field as keyof typeof formState.objectives] ? 'border-primary bg-primary' : 'border-gray-400 bg-white'}`}/>
                          <Text className="text-sm">{opt.label}</Text>
                        </TouchableOpacity>
                      ))}
                      {formState.objectives?.other && (
                        <View className="mt-1">
                          <Label htmlFor="otherObjective" className="text-xs">Especifique</Label>
                          <Input
                            value={formState.objectives.otherText}
                            onChangeText={text => updateNestedField('objectives', 'otherText', text)}
                            placeholder="Descreva seu objetivo"
                            className="text-xs"
                          />
                          {errors.otherObjective ? <Text className="mt-1 text-xs text-red-500">{errors.otherObjective}</Text> : null}
                        </View>
                      )}
                      {errors.objectives ? <Text className="mt-1 text-xs text-red-500">{errors.objectives}</Text> : null}
                    </View>
                    <View className="mt-2">
                      <Text className="font-semibold mb-1 text-base">Horizonte de investimento</Text>
                      <RadioGroup value={formState.investmentHorizon} onValueChange={v => updateField('investmentHorizon', v)}>
                        <View className="flex-row items-center gap-2 mb-1">
                          <RadioGroupItem value="short" id="hz1" />
                          <Label htmlFor="hz1" className="text-sm">Curto (até 2 anos)</Label>
                        </View>
                        <View className="flex-row items-center gap-2 mb-1">
                          <RadioGroupItem value="medium" id="hz2" />
                          <Label htmlFor="hz2" className="text-sm">Médio (2 a 5 anos)</Label>
                        </View>
                        <View className="flex-row items-center gap-2 mb-1">
                          <RadioGroupItem value="long" id="hz3" />
                          <Label htmlFor="hz3" className="text-sm">Longo (5+ anos)</Label>
                        </View>
                      </RadioGroup>
                      {errors.investmentHorizon ? <Text className="mt-1 text-xs text-red-500">{errors.investmentHorizon}</Text> : null}
                    </View>
                    <Button className="w-full mt-3" onPress={handleNext}>
                      <Text>Próximo</Text>
                    </Button>
                  </View>
                )}
                {step === 4 && (
                  <View className="gap-6">
                    {/* Preferência por liquidez */}
                    <View>
                      <Text className="font-semibold mb-2">Preferência por liquidez</Text>
                      <RadioGroup value={formState.liquidityPreference} onValueChange={v => updateField('liquidityPreference', v)}>
                        <View className="flex flex-row items-center gap-3 mb-2">
                          <RadioGroupItem value="high" id="liq1" />
                          <Label htmlFor="liq1">Alta</Label>
                          <Text className="text-xs text-gray-500 ml-2">Preciso ter acesso rápido aos recursos quando necessário</Text>
                        </View>
                        <View className="flex flex-row items-center gap-3 mb-2">
                          <RadioGroupItem value="medium" id="liq2" />
                          <Label htmlFor="liq2">Média</Label>
                          <Text className="text-xs text-gray-500 ml-2">Posso aguardar alguns dias para acessar parte dos recursos</Text>
                        </View>
                        <View className="flex flex-row items-center gap-3 mb-2">
                          <RadioGroupItem value="low" id="liq3" />
                          <Label htmlFor="liq3">Baixa</Label>
                          <Text className="text-xs text-gray-500 ml-2">Posso deixar os recursos investidos por longos períodos</Text>
                        </View>
                      </RadioGroup>
                      {errors.liquidityPreference ? <Text className="mt-1 text-xs text-red-500">{errors.liquidityPreference}</Text> : null}
                    </View>
                    {/* Interesse em ESG */}
                    <View className="flex-row items-center justify-between bg-white rounded-xl border border-gray-300 px-4 py-3">
                      <Text className="font-medium flex-1 mr-2">Interesse em investimentos sustentáveis / ESG</Text>
                      <Switch
                        value={!!formState.esgInterest}
                        onValueChange={value => updateField('esgInterest', value)}
                        trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                        thumbColor={formState.esgInterest ? '#2563EB' : '#CBD5E1'}
                      />
                    </View>
                    {/* Já investiu antes? */}
                    <View className="flex-row items-center justify-between bg-white rounded-xl border border-gray-300 px-4 py-3">
                      <Text className="font-medium flex-1 mr-2">Já investiu antes?</Text>
                      <Switch
                        value={!!formState.previousInvestmentExperience}
                        onValueChange={value => updateField('previousInvestmentExperience', value)}
                        trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                        thumbColor={formState.previousInvestmentExperience ? '#2563EB' : '#CBD5E1'}
                      />
                    </View>
                    {/* Tipos de ativos de interesse */}
                    <View>
                      <Text className="font-semibold mb-2">Tipos de ativos de interesse</Text>
                      <Text className="text-xs text-gray-500 mb-2">Selecione todas as opções aplicáveis</Text>
                      {([
                        {label:'Renda Fixa',field:'fixedIncome'},
                        {label:'Ações',field:'stocks'},
                        {label:'Fundos Imobiliários',field:'realEstateFunds'},
                        {label:'Fundos Multimercado',field:'multiMarketFunds'},
                        {label:'Criptoativos',field:'crypto'},
                        {label:'ETFs',field:'etfs'},
                        {label:'Outros',field:'other'}
                      ] as const).map(opt => (
                        <TouchableOpacity
                          key={opt.field}
                          className="flex-row items-center mb-2"
                          onPress={() => updateNestedField('assetInterests', opt.field, !(formState.assetInterests?.[opt.field as keyof typeof formState.assetInterests]))}
                        >
                          <View className={`h-5 w-5 rounded border-2 mr-2 ${formState.assetInterests?.[opt.field as keyof typeof formState.assetInterests] ? 'border-primary bg-primary' : 'border-gray-400 bg-white'}`}/>
                          <Text>{opt.label}</Text>
                        </TouchableOpacity>
                      ))}
                      {formState.assetInterests?.other && (
                        <View className="mt-2">
                          <Label htmlFor="otherAsset">Especifique</Label>
                          <Input
                            value={formState.assetInterests.otherText}
                            onChangeText={text => updateNestedField('assetInterests', 'otherText', text)}
                            placeholder="Outros tipos de ativos"
                          />
                          {errors.otherAsset ? <Text className="mt-1 text-xs text-red-500">{errors.otherAsset}</Text> : null}
                        </View>
                      )}
                      {errors.assetInterests ? <Text className="mt-1 text-xs text-red-500">{errors.assetInterests}</Text> : null}
                    </View>
                    <View className="bg-blue-50 rounded-xl p-4 mt-2 mb-2">
                      <Text className="text-sm text-blue-900">
                        Suas preferências pessoais nos ajudam a refinar as recomendações e oferecer produtos mais alinhados com seus interesses e necessidades.
                      </Text>
                    </View>
                    <Button className="w-full mt-2" onPress={handleNext}>
                      <Text>Próximo</Text>
                    </Button>
                  </View>
                )}
                {step === 5 && (
                  <View className="gap-6">
                    <View className="bg-blue-50 rounded-xl p-4">
                      <Text className="text-lg font-semibold text-blue-900 mb-1">Finalização do Questionário</Text>
                      <Text className="text-sm text-blue-900">
                        Estamos quase lá! Para finalizar seu perfil de investidor, precisamos do seu consentimento para processamento dos dados.
                      </Text>
                    </View>
                    <View className="bg-white rounded-xl border border-gray-200 p-4">
                      <Text className="font-semibold text-base mb-4 text-gray-800">Termos e Consentimentos</Text>
                      {/* Termos de uso */}
                      <TouchableOpacity
                        className="flex-row items-start mb-4"
                        onPress={() => updateField('termsAccepted', !formState.termsAccepted)}
                      >
                        <View className={`w-6 h-6 rounded-md border-2 mr-3 ${formState.termsAccepted ? 'bg-primary border-primary justify-center items-center' : 'border-gray-300'}`}
                          style={{ justifyContent: 'center', alignItems: 'center' }}
                        >
                          {formState.termsAccepted && (
                            <Text className="text-white text-center" style={{fontWeight:'bold'}}>&#10003;</Text>
                          )}
                        </View>
                        <Text className="flex-1 text-gray-700">
                          Aceito os <Text className="underline text-primary" onPress={() => {}}>termos de uso</Text> e <Text className="underline text-primary" onPress={() => {}}>política de privacidade</Text>
                        </Text>
                      </TouchableOpacity>
                      {/* Consentimento de uso de dados */}
                      <TouchableOpacity
                        className="flex-row items-start"
                        onPress={() => updateField('dataUseConsent', !formState.dataUseConsent)}
                      >
                        <View className={`w-6 h-6 rounded-md border-2 mr-3 ${formState.dataUseConsent ? 'bg-primary border-primary justify-center items-center' : 'border-gray-300'}`}
                          style={{ justifyContent: 'center', alignItems: 'center' }}
                        >
                          {formState.dataUseConsent && (
                            <Text className="text-white text-center" style={{fontWeight:'bold'}}>&#10003;</Text>
                          )}
                        </View>
                        <Text className="flex-1 text-gray-700">
                          Autorizo o uso dos meus dados para fins de recomendação de investimentos com base em IA
                        </Text>
                      </TouchableOpacity>
                      {errors.terms ? <Text className="mt-2 text-xs text-red-500">{errors.terms}</Text> : null}
                    </View>
                    <View className="bg-white rounded-xl border border-gray-200 p-4">
                      <Text className="font-semibold text-base mb-2 text-gray-800">Proteção de Dados</Text>
                      <Text className="text-sm text-gray-600 mb-2">
                        Conforme previsto na Lei Geral de Proteção de Dados (LGPD), seus dados serão utilizados exclusivamente para as finalidades informadas e estarão protegidos por medidas de segurança técnicas e administrativas.
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento através dos nossos canais de atendimento.
                      </Text>
                    </View>
                    <Button className="w-full mt-2" onPress={handleNext}>
                      <Text>Finalizar Questionário</Text>
                    </Button>
                  </View>
                )}
              </ScrollView>
            ) : (
              <View className="gap-6 items-center justify-center py-8">
                <View className="items-center mb-4">
                  <Text style={{fontSize: 64, color: '#10B981'}}>✔️</Text>
                </View>
                <Text className="text-2xl font-bold text-center text-primary mb-2">Questionário Concluído!</Text>
                <Text className="text-base text-center text-gray-600 mb-4">Obrigado por completar o questionário de perfil de investidor.</Text>
                <View className="bg-white rounded-2xl p-6 shadow-sm w-full mb-4">
                  <Text className="text-lg font-semibold text-gray-800 mb-1">Seu Perfil de Investidor</Text>
                  <Text className="text-3xl font-bold text-primary mb-2 text-center">
                    {formState.riskTolerance === 'conservative' ? 'Conservador' : formState.riskTolerance === 'moderate' ? 'Moderado' : formState.riskTolerance === 'aggressive' ? 'Arrojado' : ''}
                  </Text>
                  <Text className="text-sm text-gray-500 text-center">
                    Com base nas suas respostas, identificamos seu perfil de investidor. Isso nos ajudará a oferecer recomendações mais adequadas ao seu perfil.
                  </Text>
                </View>
                <View className="bg-blue-50 rounded-xl w-full p-4 mb-4">
                  <Text className="text-base font-semibold text-blue-900 mb-2">Próximos Passos</Text>
                  <View className="flex-row items-start mb-2">
                    <View className="w-8 h-8 rounded-full bg-blue-100 justify-center items-center mr-3"><Text className="text-primary font-bold">1</Text></View>
                    <View className="flex-1"><Text className="font-semibold text-gray-700">Revisar Perfil</Text><Text className="text-xs text-gray-500">Você pode verificar o resumo das suas respostas a qualquer momento</Text></View>
                  </View>
                  <View className="flex-row items-start mb-2">
                    <View className="w-8 h-8 rounded-full bg-blue-100 justify-center items-center mr-3"><Text className="text-primary font-bold">2</Text></View>
                    <View className="flex-1"><Text className="font-semibold text-gray-700">Receber Recomendações</Text><Text className="text-xs text-gray-500">Com base no seu perfil, mostraremos investimentos adequados para você</Text></View>
                  </View>
                  <View className="flex-row items-start">
                    <View className="w-8 h-8 rounded-full bg-blue-100 justify-center items-center mr-3"><Text className="text-primary font-bold">3</Text></View>
                    <View className="flex-1"><Text className="font-semibold text-gray-700">Iniciar sua Jornada</Text><Text className="text-xs text-gray-500">Comece a investir de acordo com seu perfil e objetivos</Text></View>
                  </View>
                </View>
                <Button className="w-full mt-2" onPress={() => router.push('/(app)/summary')}>
                  <Text>Ver Resumo do Perfil</Text>
                </Button>
              </View>
            )}
          </CardContent>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}
