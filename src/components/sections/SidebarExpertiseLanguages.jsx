import React from "react";

const Pills = ({ items }) =>
  !items || items.length === 0 ? null : (
    <div className="flex flex-wrap gap-2">
      {items.map((x) => (
        <span key={x} className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-gray-100">
          {x}
        </span>
      ))}
    </div>
  );

export default function SidebarExpertiseLanguages({ expertiseAreas = [], languages = [] }) {
  if ((!expertiseAreas || expertiseAreas.length === 0) && (!languages || languages.length === 0)) {
    return null;
  }

  return (
    <aside className="card p-5 space-y-4">
      <h3 className="text-xl font-semibold">Expertise & Languages</h3>

      <div className="space-y-2">
        {expertiseAreas?.length > 0 && (
          <>
            <div className="text-sm font-medium text-gray-600">Expertise Areas</div>
            <Pills items={expertiseAreas} />
          </>
        )}
        {languages?.length > 0 && (
          <>
            <div className="text-sm font-medium text-gray-600">Languages</div>
            <Pills items={languages} />
          </>
        )}
      </div>
    </aside>
  );
}

