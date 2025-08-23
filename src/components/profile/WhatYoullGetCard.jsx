import React from 'react'

const Row = ({ label, value }) => {
  if (!value) return null
  return (
    <div className="wyg-row">
      <div className="wyg-label">{label}</div>
      <div className="wyg-value">{value}</div>
    </div>
  )
}

export default function WhatYoullGetCard({ wyg }) {
  if (!wyg) return null

  const {
    deliveryStyle,
    whyThisSpeaker,
    willAddress,
    willLearn,
    takeHome,
    benefitsIndividual,
    benefitsOrganisation,
  } = wyg

  const hasAny =
    deliveryStyle ||
    whyThisSpeaker ||
    willAddress ||
    willLearn ||
    takeHome ||
    benefitsIndividual ||
    benefitsOrganisation

  if (!hasAny) return null

  return (
    <section className="card">
      <h2 className="card-title">What You’ll Get</h2>

      <Row label="Delivery Style" value={deliveryStyle} />
      <Row label="Why This Speaker" value={whyThisSpeaker} />
      <Row label="What the speeches will address" value={willAddress} />
      <Row label="What participants will learn" value={willLearn} />
      <Row label="What the audience will take home" value={takeHome} />
      <Row label="Benefits: Individual" value={benefitsIndividual} />
      <Row label="Benefits: Organisation" value={benefitsOrganisation} />
    </section>
  )
}

