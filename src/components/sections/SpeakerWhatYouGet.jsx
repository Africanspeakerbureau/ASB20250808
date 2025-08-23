import React from "react";
import DOMPurify from "dompurify";

const Block = ({ label, html }) => {
  if (!html) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{label}</h3>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html).replace(/\n/g, "<br/>") }}
      />
    </div>
  );
};

export default function SpeakerWhatYouGet({ s }) {
  const hasAny =
    s?.keyMessages ||
    s?.deliveryStyle ||
    s?.whyListen ||
    s?.willAddress ||
    s?.willLearn ||
    s?.takeHome ||
    s?.benefitsIndividual ||
    s?.benefitsOrganisation;

  if (!hasAny) return null;

  return (
    <section aria-labelledby="what-you-get" className="card p-6 space-y-6">
      <h2 id="what-you-get" className="text-2xl font-bold">What You’ll Get</h2>

      <Block label="Key Messages" html={s.keyMessages} />
      <Block label="Speaker’s Delivery Style" html={s.deliveryStyle} />
      <Block label="Why This Speaker" html={s.whyListen} />
      <Block label="What the speeches will address" html={s.willAddress} />
      <Block label="What participants will learn" html={s.willLearn} />
      <Block label="What the audience will take home" html={s.takeHome} />
      <Block label="Benefits for the individual" html={s.benefitsIndividual} />
      <Block label="Benefits for the organisation" html={s.benefitsOrganisation} />
    </section>
  );
}

