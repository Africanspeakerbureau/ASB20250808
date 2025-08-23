import React from "react";

function Block({ title, text }) {
  if (!text) return null;
  return (
    <div className="space-y-1">
      <h4 className="text-base font-semibold">{title}</h4>
      <div className="text-[15px] leading-relaxed whitespace-pre-line text-slate-700">
        {text}
      </div>
    </div>
  );
}

export default function WhatYoullGetCard({ speaker }) {
  if (!speaker) return null;

  const {
    keyMessages,
    deliveryStyle,
    whyThisSpeaker,
    willAddress,
    participantsWillLearn,
    audienceTakeaways,
    benefitsIndividual,
    benefitsOrganisation,
  } = speaker;

  const hasAny =
    keyMessages ||
    deliveryStyle ||
    whyThisSpeaker ||
    willAddress ||
    participantsWillLearn ||
    audienceTakeaways ||
    benefitsIndividual ||
    benefitsOrganisation;

  if (!hasAny) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
      <h3 className="text-xl md:text-2xl font-bold mb-4">What You’ll Get</h3>

      <div className="space-y-5">
        <Block title="Key Messages" text={keyMessages} />
        <Block title="Delivery Style" text={deliveryStyle} />
        <Block title="Why This Speaker" text={whyThisSpeaker} />
        <Block title="What the speeches will address" text={willAddress} />
        <Block title="What participants will learn" text={participantsWillLearn} />
        <Block title="What the audience will take home" text={audienceTakeaways} />
        <Block title="Benefits: Individual" text={benefitsIndividual} />
        <Block title="Benefits: Organisation" text={benefitsOrganisation} />
      </div>
    </section>
  );
}

