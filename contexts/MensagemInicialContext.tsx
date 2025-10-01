import React, { createContext, useContext, useState } from 'react';

interface MensagemInicialContextType {
  mensagemInicial: string;
  setMensagemInicial: (msg: string) => void;
}

const MensagemInicialContext = createContext<MensagemInicialContextType | undefined>(undefined);

export const MensagemInicialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mensagemInicial, setMensagemInicial] = useState('');
  return (
    <MensagemInicialContext.Provider value={{ mensagemInicial, setMensagemInicial }}>
      {children}
    </MensagemInicialContext.Provider>
  );
};

export function useMensagemInicial() {
  const ctx = useContext(MensagemInicialContext);
  if (!ctx) throw new Error('useMensagemInicial deve ser usado dentro do MensagemInicialProvider');
  return ctx;
}
