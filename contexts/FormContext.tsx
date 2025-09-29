import React, { createContext, useContext, useReducer } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the form state interface
export interface FormState {
  // Personal Information
  fullName: string;
  email: string;
  documentId: string; // CPF
  birthDate: string;
  phone: string;

  // Financial Profile
  monthlyIncome: string;
  totalAssets: string;
  investmentAmount: string;
  monthlyContribution: {
    hasContribution: boolean;
    amount: string;
  };

  // Investor Profile (Suitability)
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced' | '';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive' | '';
  objectives: {
    emergencyReserve: boolean;
    retirement: boolean;
    realEstate: boolean;
    shortTermProfit: boolean;
    other: boolean;
    otherText: string;
  };
  investmentHorizon: 'short' | 'medium' | 'long' | '';

  // Personal Preferences
  liquidityPreference: 'high' | 'medium' | 'low' | '';
  esgInterest: boolean;
  previousInvestmentExperience: boolean;
  assetInterests: {
    fixedIncome: boolean;
    stocks: boolean;
    realEstateFunds: boolean;
    multiMarketFunds: boolean;
    crypto: boolean;
    etfs: boolean;
    other: boolean;
    otherText: string;
  };

  // Terms and Consents
  termsAccepted: boolean;
  dataUseConsent: boolean;
}

// Initial state
const initialState: FormState = {
  // Personal Information
  fullName: '',
  email: '',
  documentId: '',
  birthDate: '',
  phone: '',

  // Financial Profile
  monthlyIncome: '',
  totalAssets: '',
  investmentAmount: '',
  monthlyContribution: {
    hasContribution: false,
    amount: '',
  },

  // Investor Profile
  knowledgeLevel: '',
  riskTolerance: '',
  objectives: {
    emergencyReserve: false,
    retirement: false,
    realEstate: false,
    shortTermProfit: false,
    other: false,
    otherText: '',
  },
  investmentHorizon: '',

  // Personal Preferences
  liquidityPreference: '',
  esgInterest: false,
  previousInvestmentExperience: false,
  assetInterests: {
    fixedIncome: false,
    stocks: false,
    realEstateFunds: false,
    multiMarketFunds: false,
    crypto: false,
    etfs: false,
    other: false,
    otherText: '',
  },

  // Terms and Consents
  termsAccepted: false,
  dataUseConsent: false,
};

// Define action types
type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof FormState; value: any }
  | { type: 'UPDATE_NESTED_FIELD'; parent: keyof FormState; field: string; value: any }
  | { type: 'RESET_FORM' };

// Reducer function
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'UPDATE_NESTED_FIELD':
      return {
        ...state,
        [action.parent]: 
          typeof state[action.parent] === 'object' && state[action.parent] !== null
            ? {
                ...state[action.parent] as object,
                [action.field]: action.value,
              }
            : state[action.parent],
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

// Create context
interface FormContextType {
  formState: FormState;
  updateField: (field: keyof FormState, value: any) => void;
  updateNestedField: (parent: keyof FormState, field: string, value: any) => void;
  resetForm: () => void;
  salvarDados?: () => void; // <-- Adicione aqui
  recuperarDados?: () => void; // <-- Adicione aqui
  validaDuplicidadeCPF?: (cpf: string) => Promise<boolean>; // Placeholder for duplicate CPF validation

}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider component
export function FormProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth(); // Use the auth context to get user data
  if (user) {
    initialState.email = user.email || '';
    initialState.documentId = user.user_metadata.documentId || '';
  }

  const [formState, dispatch] = useReducer(formReducer, initialState);

  const updateField = (field: keyof FormState, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const updateNestedField = (parent: keyof FormState, field: string, value: any) => {
    dispatch({ type: 'UPDATE_NESTED_FIELD', parent, field, value });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  // Function to save data (placeholder)
  const salvarDados = async () => {
    // Implement your save logic here
    console.log('Dados salvos:', formState);
    formState.email = user?.email || '';
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user?.id,               // ID do auth.user
        email: user?.email,
        cpf: formState.documentId,
        dados: formState
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      throw error;
    }

    // Salvar dados no AsyncStorage
    try {
      await AsyncStorage.setItem('user_form_data', JSON.stringify(formState));
    } catch (e) {
      console.error('Erro ao salvar dados no AsyncStorage:', e);
    }
  };

  const validaDuplicidadeCPF = async (cpf: string): Promise<boolean> => {
    console.log('Validando CPF:', cpf);

    const { data, error } = await supabase
      .from('user_profiles')
      .select('dados, id')
      .filter('dados->>documentId', 'eq', cpf);

    if (error) {
      console.error('Erro ao verificar CPF:', error);
      return false; // Assume no duplicates if there's an error
    }

    // Verifica se o CPF encontrado pertence ao próprio usuário
    const isOwnCPF = data.some((record) => record.id === user?.id);

    return data.length === 0 || isOwnCPF; // Retorna true se não houver duplicatas ou se for o próprio usuário
  };

  const recuperarDados = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('dados')
      .eq('id', user?.id)
      .single();

    if (error) {
      console.log('Erro ao recuperar dados do usuário:', error);
      resetForm(); // Limpa os campos caso ocorra erro
    }

    if (data) {
      dispatch({ type: 'UPDATE_FIELD', field: 'fullName', value: data.dados.fullName });
      dispatch({ type: 'UPDATE_FIELD', field: 'email', value: data.dados.email });
      dispatch({ type: 'UPDATE_FIELD', field: 'documentId', value: data.dados.documentId });
      dispatch({ type: 'UPDATE_FIELD', field: 'birthDate', value: data.dados.birthDate });
      dispatch({ type: 'UPDATE_FIELD', field: 'phone', value: data.dados.phone });
      dispatch({ type: 'UPDATE_FIELD', field: 'monthlyIncome', value: data.dados.monthlyIncome });
      dispatch({ type: 'UPDATE_FIELD', field: 'totalAssets', value: data.dados.totalAssets });
      dispatch({ type: 'UPDATE_FIELD', field: 'investmentAmount', value: data.dados.investmentAmount });
      dispatch({ type: 'UPDATE_FIELD', field: 'monthlyContribution', value: data.dados.monthlyContribution });
      dispatch({ type: 'UPDATE_FIELD', field: 'knowledgeLevel', value: data.dados.knowledgeLevel });
      dispatch({ type: 'UPDATE_FIELD', field: 'riskTolerance', value: data.dados.riskTolerance });
      dispatch({ type: 'UPDATE_FIELD', field: 'objectives', value: data.dados.objectives });
      dispatch({ type: 'UPDATE_FIELD', field: 'investmentHorizon', value: data.dados.investmentHorizon });
      dispatch({ type: 'UPDATE_FIELD', field: 'liquidityPreference', value: data.dados.liquidityPreference });
      dispatch({ type: 'UPDATE_FIELD', field: 'esgInterest', value: data.dados.esgInterest });
      dispatch({ type: 'UPDATE_FIELD', field: 'previousInvestmentExperience', value: data.dados.previousInvestmentExperience });
      dispatch({ type: 'UPDATE_FIELD', field: 'assetInterests', value: data.dados.assetInterests });
      dispatch({ type: 'UPDATE_FIELD', field: 'termsAccepted', value: data.dados.termsAccepted });
      dispatch({ type: 'UPDATE_FIELD', field: 'dataUseConsent', value: data.dados.dataUseConsent });
      console.log('Dados recuperados:', data.dados);
          // Salvar dados no AsyncStorage
    try {
      await AsyncStorage.setItem('user_form_data', JSON.stringify(formState));
    } catch (e) {
      console.error('Erro ao salvar dados no AsyncStorage:', e);
    }
    } else {
      resetForm(); // Limpa os campos caso nenhum dado seja recuperado
    }
  };

  return (
    <FormContext.Provider value={{ formState, updateField, updateNestedField, resetForm, salvarDados, recuperarDados, validaDuplicidadeCPF }}>
      {children}
    </FormContext.Provider>
  );
}

// Custom hook to use the form context
export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

