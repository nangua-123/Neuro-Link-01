import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types to support various schema formats ---
export interface EngineSchema {
  scaleId?: string;
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  questions: any[] | Record<string, any>; // Array or Object format
}

interface AssessmentEngineProps {
  schema: EngineSchema;
  onSubmit: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}

export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({ schema, onSubmit, initialValues = {} }) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);

  const handleChange = useCallback((id: string, value: any) => {
    setValues(prev => {
      const newValues = { ...prev, [id]: value };
      // Note: A robust engine might also clear dependent fields here if the parent value changes,
      // but for simplicity and to avoid data loss on accidental clicks, we keep the values.
      return newValues;
    });
  }, []);

  const handleSubmit = () => {
    // Before submit, we could filter out values of questions that are hidden by skip logic.
    // For now, we submit the raw values.
    onSubmit(values);
  };

  const title = schema.title || schema.name || '评估问卷';

  return (
    <div className="w-full max-w-2xl mx-auto pb-32">
      <div className="mb-8 px-4 pt-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        {schema.description && (
          <p className="text-sm text-gray-500 leading-relaxed">{schema.description}</p>
        )}
      </div>

      <div className="space-y-6 px-4">
        {schema.questions && (Array.isArray(schema.questions) ? schema.questions : Object.values(schema.questions)).map((q: any) => (
          <QuestionRenderer 
            key={q.id} 
            question={q} 
            values={values} 
            onChange={handleChange} 
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
        <button
          onClick={handleSubmit}
          className="w-full max-w-2xl mx-auto block bg-blue-600 text-white rounded-2xl py-4 font-medium text-lg shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
        >
          提交评估
        </button>
      </div>
    </div>
  );
};

const QuestionRenderer: React.FC<{
  question: any;
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
  depth?: number;
}> = ({ question, values, onChange, depth = 0 }) => {
  // --- Skip Logic (dependsOn) ---
  let isMatch = true;
  if (question.dependsOn) {
    const dep = question.dependsOn;
    const depValue = values[dep.questionId];
    
    isMatch = false;
    if (depValue !== undefined && depValue !== null) {
      if (Array.isArray(depValue)) {
        isMatch = depValue.includes(dep.value);
      } else {
        isMatch = depValue === dep.value;
      }
    }
  }

  useEffect(() => {
    if (!isMatch && values[question.id] !== undefined) {
      onChange(question.id, undefined);
    }
  }, [isMatch, question.id, values, onChange]);

  if (!isMatch) {
    return null;
  }

  const value = values[question.id];
  const qType = (question.type || '').toLowerCase();
  const qTitle = question.title || question.text;

  const renderContent = () => {
    // 1. RADIO and its variants
    if (qType.includes('radio')) {
      return (
        <div className="space-y-3">
          {question.options?.map((opt: any) => {
            const isSelected = value === opt.value;
            
            return (
              <div key={opt.value} className="flex flex-col">
                <label 
                  className={`
                    flex items-start p-4 rounded-2xl border transition-all cursor-pointer
                    ${isSelected 
                      ? 'bg-blue-50/60 border-blue-200 shadow-[0_2px_10px_rgba(37,99,235,0.05)]' 
                      : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50/50'}
                  `}
                >
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 shrink-0 transition-colors
                    ${isSelected ? 'border-blue-500' : 'border-gray-300'}
                  `}>
                    {isSelected && <motion.div layoutId={`radio-${question.id}`} className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <span className={`text-base block leading-snug ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                  </div>
                  <input
                    type="radio"
                    className="hidden"
                    name={question.id}
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => {
                      onChange(question.id, opt.value);
                    }}
                  />
                </label>

                {/* Nested Input for RADIO_WITH_INPUT */}
                <AnimatePresence>
                  {isSelected && opt.requiresInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-12 pr-4 pb-2">
                        <input
                          type="text"
                          placeholder={opt.inputPlaceholder || '请输入详细信息...'}
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={values[`${question.id}_input`] || ''}
                          onChange={(e) => onChange(`${question.id}_input`, e.target.value)}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Complex Sub-questions for RADIO_WITH_COMPLEX_SUB */}
                <AnimatePresence>
                  {isSelected && opt.subQuestions && opt.subQuestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 ml-6 border-l-2 border-blue-100/50 space-y-6 pb-4">
                        {opt.subQuestions.map((subQ: any) => (
                          <QuestionRenderer
                            key={subQ.id}
                            question={subQ}
                            values={values}
                            onChange={onChange}
                            depth={depth + 1}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      );
    }

    // 2. CHECKBOX and its variants
    if (qType.includes('checkbox')) {
      return (
        <div className="space-y-3">
          {question.options?.map((opt: any) => {
            const selectedValues = Array.isArray(value) ? value : [];
            const isSelected = selectedValues.includes(opt.value);

            return (
              <div key={opt.value} className="flex flex-col">
                <label 
                  className={`
                    flex items-start p-4 rounded-2xl border transition-all cursor-pointer
                    ${isSelected 
                      ? 'bg-blue-50/60 border-blue-200 shadow-[0_2px_10px_rgba(37,99,235,0.05)]' 
                      : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50/50'}
                  `}
                >
                  <div className={`
                    w-5 h-5 rounded-md border-2 flex items-center justify-center mr-3 mt-0.5 shrink-0 transition-colors
                    ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}
                  `}>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={`text-base block leading-snug ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    name={question.id}
                    value={opt.value}
                    checked={isSelected}
                    onChange={(e) => {
                      let newValues = [...selectedValues];
                      if (e.target.checked) {
                        newValues.push(opt.value);
                      } else {
                        newValues = newValues.filter((v: any) => v !== opt.value);
                      }
                      onChange(question.id, newValues);
                    }}
                  />
                </label>

                {/* Nested Input for CHECKBOX_WITH_INPUT */}
                <AnimatePresence>
                  {isSelected && opt.requiresInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-12 pr-4 pb-2">
                        <input
                          type="text"
                          placeholder={opt.inputPlaceholder || '请输入详细信息...'}
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={values[`${question.id}_input`] || ''}
                          onChange={(e) => onChange(`${question.id}_input`, e.target.value)}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Complex Sub-questions for CHECKBOX */}
                <AnimatePresence>
                  {isSelected && opt.subQuestions && opt.subQuestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 ml-6 border-l-2 border-blue-100/50 space-y-6 pb-4">
                        {opt.subQuestions.map((subQ: any) => (
                          <QuestionRenderer
                            key={subQ.id}
                            question={subQ}
                            values={values}
                            onChange={onChange}
                            depth={depth + 1}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      );
    }

    // 3. INPUT_GROUP (Multiple inputs in one question)
    if (qType === 'input_group') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.fields?.map((field: any) => (
            <div key={field.id} className="flex flex-col">
              {field.label && <span className="block text-sm text-gray-600 mb-1.5 ml-1">{field.label}</span>}
              <div className="relative">
                <input
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={values[field.id] || ''}
                  onChange={(e) => onChange(field.id, e.target.value)}
                />
                {field.suffix && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    {field.suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 4. TEXTAREA
    if (qType === 'textarea') {
      return (
        <div className="w-full">
          <textarea
            rows={4}
            placeholder={question.placeholder || '请输入详细描述...'}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y min-h-[120px]"
            value={value || ''}
            onChange={(e) => onChange(question.id, e.target.value)}
          />
        </div>
      );
    }

    // 5. SINGLE INPUT
    if (qType === 'input' || qType === 'text' || qType === 'number' || qType === 'date') {
      return (
        <div className="w-full">
          <input
            type={qType === 'input' ? 'text' : qType}
            placeholder={question.placeholder || '请输入...'}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={value || ''}
            onChange={(e) => onChange(question.id, e.target.value)}
          />
        </div>
      );
    }

    return <div className="text-sm text-gray-400 p-4 bg-gray-50 rounded-xl">不支持的题型: {qType}</div>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative
        ${depth === 0 ? 'bg-white rounded-3xl p-6 shadow-sm border border-gray-100' : ''}
      `}
    >
      <div className="mb-5">
        <h3 className={`font-medium text-gray-900 leading-relaxed ${depth > 0 ? 'text-base' : 'text-lg'}`}>
          {qTitle}
          {question.required && <span className="text-red-500 ml-1.5">*</span>}
        </h3>
        {question.description && (
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{question.description}</p>
        )}
      </div>
      {renderContent()}
    </motion.div>
  );
};

