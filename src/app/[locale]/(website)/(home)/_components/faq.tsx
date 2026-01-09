"use client"

import SpecialHeader from '@/components/SpecialHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const AcademixFAQ = () => {
  const { t } = useTranslation();

  const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q8'];

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-12">
            <SpecialHeader name={t('faq.title')} size='big' />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqKeys.map((key, index) => (
            <AccordionItem 
              key={key} 
              value={`item-${index + 1}`}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="cursor-pointer px-6 text-left font-semibold text-gray-900 hover:text-(--main-darker-color) py-5">
                {t(`faq.questions.${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 px-6 leading-relaxed pb-5">
                {t(`faq.questions.${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center p-6 bg-orange-50 rounded-lg border border-orange-100">
          <p className="text-gray-700 mb-3">
            {t('faq.contact.stillHaveQuestions')}
          </p>
          <p className="text-gray-600">
            {t('faq.contact.description')}{' '}
            <Link href="mailto:support@academix.com" className="text-(--main-color) font-medium hover:underline">
              {t('faq.contact.email')}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AcademixFAQ;