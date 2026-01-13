"use client"

import SpecialHeader from "@/components/SpecialHeader";
import { useTranslation } from "react-i18next";
import {
  BadgeCheck,
  Globe,
  Layers,
  Loader,
  ScanEye,
  UserCheck,
} from "lucide-react";

export default function WhyUs() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Layers,
      title: t("whyus.features.structuredLearning.title"),
      description: t("whyus.features.structuredLearning.description"),
    },
    {
      icon: UserCheck,
      title: t("whyus.features.expertInstructors.title"),
      description: t("whyus.features.expertInstructors.description"),
    },
    {
      icon: ScanEye,
      title: t("whyus.features.learnAtYourPace.title"),
      description: t("whyus.features.learnAtYourPace.description"),
    },
    {
      icon: Globe,
      title: t("whyus.features.multilingualExperience.title"),
      description: t("whyus.features.multilingualExperience.description"),
    },
    {
      icon: Loader,
      title: t("whyus.features.trackYourProgress.title"),
      description: t("whyus.features.trackYourProgress.description"),
    },
    {
      icon: BadgeCheck,
      title: t("whyus.features.verifiedContent.title"),
      description: t("whyus.features.verifiedContent.description"),
    }
  ];

  return (
    <div className="from-gray-50 to-white">
      <div className="container">
        <div className="mb-16">
          <SpecialHeader size="big" name={t("whyus.header")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl p-6 duration-300 border"
              >
                <div>
                  <div className={`inline-flex items-center bg-orange-50 justify-center w-14 h-14 rounded-xl mb-4 shadow-lg`}>
                    <Icon className="text-(--main-color)" size={26} />
                  </div>

                  <h6 className="font-bold text-xl text-gray-900 mb-3">
                    {feature.title}
                  </h6>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="absolute top-0 right-0 w-20 h-20 from-blue-100/50 to-purple-100/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}