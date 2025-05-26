'use client';

import { createContext, useContext, useState } from 'react';
import { Document, Question } from '@/services/types';

type QCReturnType = ReturnType<typeof useState<Document<Question>>>;

export const QuestionContext = createContext<QCReturnType>([] as never as QCReturnType);

export const useQuestionContext = () => useContext(QuestionContext);

export const QuestionContextProvider = QuestionContext.Provider;
