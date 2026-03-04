import React, { useState, useCallback } from 'react';
import { ScaleSchema, ScaleQuestion, QuestionType } from '../../interfaces/scale';
import { motion, AnimatePresence } from 'motion/react';

interface AssessmentEngineProps {
  schema: ScaleSchema;
  onSubmit: (values: Record<string, any>) => void;
}

export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({ schema, onSubmit }) => {
  const [values, setValues] = useState<Record<string, any>>({});

  const handleChange = useCallback((id: string, value: any) => {
    setValues(prev => ({ ...prev, [id]: value }));
  }, []);

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-24">
      <div className="mb-8 px-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{schema.name || (schema as any).title}</h2>
        {schema.description && (
          <p className="text-sm text-gray-500">{schema.description}</p>
        )}
      </div>

      <div className="space-y-6 px-4">
        {schema.questions.map(q => (
          <QuestionRenderer 
            key={q.id} 
            question={q} 
            values={values} 
            onChange={handleChange} 
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <button
          onClick={handleSubmit}
          className="w-full max-w-2xl mx-auto block bg-blue-600 text-white rounded-full py-4 font-medium text-lg shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
        >
          提交评估
        </button>
      </div>
    </div>
  );
};

const QuestionRenderer: React.FC<{
  question: ScaleQuestion;
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
  depth?: number;
}> = ({ question, values, onChange, depth = 0 }) => {
  // Check dependency
  if (question.dependsOn) {
    const depValue = values[question.dependsOn.questionId];
    if (depValue !== question.dependsOn.value) {
      return null;
    }
  }

  const value = values[question.id];

  const renderContent = () => {
    switch (question.type) {
      case QuestionType.RADIO:
      case QuestionType.RADIO_WITH_COMPLEX_SUB:
      case QuestionType.RADIO_WITH_INPUT:
        return (
          <div className="space-y-3">
            {question.options?.map(opt => {
              const isSelected = value?.selected === opt.value || value === opt.value;
              return (
                <div key={opt.value} className="flex flex-col space-y-3">
                  <label 
                    className={`
                      flex items-center p-4 rounded-2xl border transition-all cursor-pointer
                      ${isSelected 
                        ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                        : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50/50'}
                    `}
                  >
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
                      ${isSelected ? 'border-blue-500' : 'border-gray-300'}
                    `}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                    </div>
                    <span className={`text-base ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                    <input
                      type="radio"
                      className="hidden"
                      name={question.id}
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => {
                        if (question.type === QuestionType.RADIO) {
                          onChange(question.id, opt.value);
                        } else {
                          onChange(question.id, { selected: opt.value });
                        }
                      }}
                    />
                  </label>

                  <AnimatePresence>
                    {isSelected && opt.requiresInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-8 overflow-hidden"
                      >
                        <input
                          type="text"
                          placeholder={opt.inputPlaceholder || '请输入...'}
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={value?.input || ''}
                          onChange={(e) => onChange(question.id, { ...value, input: e.target.value })}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isSelected && opt.subQuestions && opt.subQuestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 border-l-2 border-blue-100 ml-2 mt-2 space-y-4 overflow-hidden"
                      >
                        {opt.subQuestions.map(subQ => (
                          <QuestionRenderer
                            key={subQ.id}
                            question={subQ}
                            values={values}
                            onChange={onChange}
                            depth={depth + 1}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        );

      case QuestionType.CHECKBOX:
      case QuestionType.CHECKBOX_WITH_INPUT:
        return (
          <div className="space-y-3">
            {question.options?.map(opt => {
              const selectedValues = Array.isArray(value) ? value : [];
              const isSelected = selectedValues.some((v: any) => v.selected === opt.value || v === opt.value);
              const currentValue = selectedValues.find((v: any) => v.selected === opt.value || v === opt.value);

              return (
                <div key={opt.value} className="flex flex-col space-y-3">
                  <label 
                    className={`
                      flex items-center p-4 rounded-2xl border transition-all cursor-pointer
                      ${isSelected 
                        ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                        : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50/50'}
                    `}
                  >
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-colors
                      ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}
                    `}>
                      {isSelected && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-base ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      name={question.id}
                      value={opt.value}
                      checked={isSelected}
                      onChange={(e) => {
                        let newValues = [...selectedValues];
                        if (e.target.checked) {
                          newValues.push(question.type === QuestionType.CHECKBOX ? opt.value : { selected: opt.value });
                        } else {
                          newValues = newValues.filter((v: any) => v.selected !== opt.value && v !== opt.value);
                        }
                        onChange(question.id, newValues);
                      }}
                    />
                  </label>

                  <AnimatePresence>
                    {isSelected && opt.requiresInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-8 overflow-hidden"
                      >
                        <input
                          type="text"
                          placeholder={opt.inputPlaceholder || '请输入...'}
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={currentValue?.input || ''}
                          onChange={(e) => {
                            const newValues = selectedValues.map((v: any) => {
                              if (v.selected === opt.value) {
                                return { ...v, input: e.target.value };
                              }
                              return v;
                            });
                            onChange(question.id, newValues);
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isSelected && opt.subQuestions && opt.subQuestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 border-l-2 border-blue-100 ml-2 mt-2 space-y-4 overflow-hidden"
                      >
                        {opt.subQuestions.map(subQ => (
                          <QuestionRenderer
                            key={subQ.id}
                            question={subQ}
                            values={values}
                            onChange={onChange}
                            depth={depth + 1}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        );

      case QuestionType.INPUT_GROUP:
        return (
          <div className="flex flex-wrap gap-3">
            {question.fields?.map(field => (
              <div key={field.id} className="flex-1 min-w-[120px]">
                {field.label && <span className="block text-xs text-gray-500 mb-1 ml-1">{field.label}</span>}
                <div className="relative">
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={value?.[field.id] || ''}
                    onChange={(e) => onChange(question.id, { ...value, [field.id]: e.target.value })}
                  />
                  {field.unit && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      {field.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <div className="text-sm text-gray-400">Unsupported question type: {question.type}</div>;
    }
  };

  return (
    <div className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-50 ${depth > 0 ? 'bg-transparent shadow-none border-none p-0' : ''}`}>
      <div className="mb-4">
        <h3 className={`font-medium text-gray-900 ${depth > 0 ? 'text-sm' : 'text-base'}`}>
          {question.title || (question as any).text}
          {question.required && <span className="text-red-400 ml-1">*</span>}
        </h3>
        {question.description && (
          <p className="text-sm text-gray-500 mt-1">{question.description}</p>
        )}
      </div>
      {renderContent()}
    </div>
  );
};
