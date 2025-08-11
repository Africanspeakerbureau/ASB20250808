import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import SingleSelect from "./fields/SingleSelect.jsx";
import MultiSelect from "./fields/MultiSelect.jsx";
import UploadWidget from "../components/UploadWidget.jsx";

export default function EditDialog({ open, onClose, record }) {
  const [activeTab, setActiveTab] = useState("About");
  const [model, setModel] = useState(record || {});
  const [_dirty, setDirty] = useState(false);

  useEffect(() => {
    setModel(record || {});
    setDirty(false);
  }, [record]);

  const setVal = (field, value) => {
    setModel((m) => ({ ...m, [field]: value }));
    setDirty(true);
    // quick toast
    const el = document.getElementById("asb-toast");
    if (el) {
      el.textContent = "Changes not saved yet";
      el.classList.remove("opacity-0");
      el.classList.add("opacity-100");
      clearTimeout(el._t);
      el._t = setTimeout(() => {
        el.classList.add("opacity-0");
        el.classList.remove("opacity-100");
      }, 1200);
    }
  };

  // Airtable option sets (exact labels)
  const OPTIONS = useMemo(
    () => ({
      Industry: [
        "Technology","Finance & Banking","Healthcare & Medical","Education",
        "Government & Public Policy","Non Profit and NGO","Energy and Mining",
        "Agriculture & Food","Manufacturing","Telecommunications","Transport & Logistics",
        "Real Estate & Construction","Media & Entertainment","Tourism & Hospitality",
        "Retail and Consumer Goods","Legal Services","Consulting",
        "Research and Development","Arts and Cultures","IT & AI","Others"
      ],
      YearsExperience: [
        "1-3 years","4-5 years","5-10 years","10-15 years","15-20 years","20-25 years","25 years +"
      ],
      SpeakingExperience: ["Beginner","Intermediate","Advanced","Expert"],
      NumberOfEvents: ["1-5 events","6-10 events","11-20 events","21-50 events","51-100 events","100+ events"],
      LargestAudience: ["1-50","51-200","201-500","500+"],
      VirtualExperience: ["None","Limited","Moderate","Extensive"],
      ExpertiseAreas: [
        "Business / Management","Art / Culture","Cities / Environment","Economic  / Finance",
        "Facilitator / Moderator","Future / Technology","Government / Politics","Innovation / Creativity",
        "Leadership / Motivation","Society / Education","Celebrity","IT / AI"
      ],
      SpokenLanguages: [
        "English","French","German","Dutch","Spanish","Portuguese","Russian","Chinese",
        "Hindi","Arabic","Swahili","Amharic","Yoruba","Zulu","Afrikaans","Others"
      ],
      TravelWillingness: ["Virtual Only","Local Only","Domestic","International"],
      FeeRange: [
        "$500-$1 000","$1 001-$2 500","$2 501-$5 000","$5 0001- $10 000",
        "$10 001 - $25 000","$25 001 - $50 000","$50 001 - $100 000","$100 000+"
      ],
      Status: ["Pending","Under Review","Approved","Rejected","Featured","Published on Site"],
      Featured: ["Yes","No","On review"],
      Country: [/* long list handled by your existing control, keep current select if present */]
    }),
    []
  );

  if (!open) return null;

  const TabBtn = ({ id, children }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-3 py-2 rounded-lg text-sm ${activeTab===id?'bg-neutral-900 text-white':'bg-neutral-100 hover:bg-neutral-200'}`}
    >
      {children}
    </button>
  );

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[1000] flex items-start justify-center"
      onKeyDown={(e)=>{ if(e.key==='Escape') onClose(); }}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative mt-14 w-[min(960px,94vw)] rounded-2xl bg-white shadow-xl">
        <header className="flex items-center justify-between px-5 py-4 border-b">
          <div className="font-semibold text-lg">Edit</div>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded hover:bg-neutral-100">
            <X size={18}/>
          </button>
        </header>

        <div className="px-5 py-3 flex gap-2 sticky top-0 bg-white z-10 border-b">
          <TabBtn id="About">About</TabBtn>
          <TabBtn id="Media">Media</TabBtn>
          <TabBtn id="Logistics">Logistics</TabBtn>
          <TabBtn id="Links">Links & Social</TabBtn>
          <TabBtn id="Internal">Internal</TabBtn>
        </div>

        <section className="px-5 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {activeTab==="About" && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input className="asb-input" value={model["First Name"]||""}
                  onChange={(e)=>setVal("First Name", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input className="asb-input" value={model["Last Name"]||""}
                  onChange={(e)=>setVal("Last Name", e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium">Professional Title</label>
                <input className="asb-input" value={model["Professional Title"]||""}
                  onChange={(e)=>setVal("Professional Title", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium">Company</label>
                <input className="asb-input" value={model["Company"]||""}
                  onChange={(e)=>setVal("Company", e.target.value)} />
              </div>

              <SingleSelect
                label="Industry"
                value={model["Industry"]||""}
                options={OPTIONS.Industry}
                onChange={(v)=>setVal("Industry", v)}
              />

              <MultiSelect
                label="Expertise Areas"
                values={model["Expertise Areas"]||[]}
                options={OPTIONS.ExpertiseAreas}
                onChange={(arr)=>setVal("Expertise Areas", arr)}
              />

              <MultiSelect
                label="Spoken Languages"
                values={model["Spoken Languages"]||[]}
                options={OPTIONS.SpokenLanguages}
                onChange={(arr)=>setVal("Spoken Languages", arr)}
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Key Messages</label>
                <textarea className="asb-textarea" rows={3}
                  value={model["Key Messages"]||""}
                  onChange={(e)=>setVal("Key Messages", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Professional Bio</label>
                <textarea className="asb-textarea" rows={6}
                  value={model["Professional Bio"]||""}
                  onChange={(e)=>setVal("Professional Bio", e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Profile Image</label>
                <UploadWidget
                  value={model["Profile Image"]||null}
                  onChange={(file)=>setVal("Profile Image", file)}
                  note="JPG/PNG, max 5MB"
                />
              </div>
            </div>
          )}

          {activeTab==="Media" && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Header Image</label>
                <UploadWidget
                  value={model["Header Image"]||null}
                  onChange={(file)=>setVal("Header Image", file)}
                  note="Wide aspect recommended; JPG/PNG"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Video Link 1</label>
                <input className="asb-input" placeholder="https://..."
                  value={model["Video Link 1"]||""}
                  onChange={(e)=>setVal("Video Link 1", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium">Video Link 2</label>
                <input className="asb-input" placeholder="https://..."
                  value={model["Video Link 2"]||""}
                  onChange={(e)=>setVal("Video Link 2", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Video Link 3</label>
                <input className="asb-input" placeholder="https://..."
                  value={model["Video Link 3"]||""}
                  onChange={(e)=>setVal("Video Link 3", e.target.value)} />
              </div>
            </div>
          )}

          {activeTab==="Logistics" && (
            <div className="grid md:grid-cols-2 gap-4">
              <SingleSelect label="Years Experience" value={model["Years Experience"]||""}
                options={OPTIONS.YearsExperience} onChange={(v)=>setVal("Years Experience", v)} />
              <SingleSelect label="Speaking Experience" value={model["Speaking Experience"]||""}
                options={OPTIONS.SpeakingExperience} onChange={(v)=>setVal("Speaking Experience", v)} />
              <SingleSelect label="Number of Events" value={model["Number of Events"]||""}
                options={OPTIONS.NumberOfEvents} onChange={(v)=>setVal("Number of Events", v)} />
              <SingleSelect label="Largest Audience" value={model["Largest Audience"]||""}
                options={OPTIONS.LargestAudience} onChange={(v)=>setVal("Largest Audience", v)} />
              <SingleSelect label="Virtual Experience" value={model["Virtual Experience"]||""}
                options={OPTIONS.VirtualExperience} onChange={(v)=>setVal("Virtual Experience", v)} />
              <SingleSelect label="Travel Willingness" value={model["Travel Willingness"]||""}
                options={OPTIONS.TravelWillingness} onChange={(v)=>setVal("Travel Willingness", v)} />
              <SingleSelect label="Fee Range" value={model["Fee Range"]||""}
                options={OPTIONS.FeeRange} onChange={(v)=>setVal("Fee Range", v)} />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Travel Requirements</label>
                <textarea className="asb-textarea" rows={3}
                  value={model["Travel Requirements"]||""}
                  onChange={(e)=>setVal("Travel Requirements", e.target.value)} />
              </div>
            </div>
          )}

          {activeTab==="Links" && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Website</label>
                <input className="asb-input" value={model["Website"]||""}
                  onChange={(e)=>setVal("Website", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium">LinkedIn</label>
                <input className="asb-input" value={model["LinkedIn"]||model["LinkedIn Profile"]||""}
                  onChange={(e)=>setVal("LinkedIn", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Twitter/X</label>
                <input className="asb-input" value={model["Twitter"]||model["Twitter Profile"]||""}
                  onChange={(e)=>setVal("Twitter", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">References</label>
                <textarea className="asb-textarea" rows={3}
                  value={model["References"]||""}
                  onChange={(e)=>setVal("References", e.target.value)} />
              </div>
            </div>
          )}

          {activeTab==="Internal" && (
            <div className="grid md:grid-cols-2 gap-4">
              <MultiSelect
                label="Status"
                values={model["Status"]||[]}
                options={OPTIONS.Status}
                onChange={(arr)=>setVal("Status", arr)}
              />
              <SingleSelect
                label="Featured"
                value={model["Featured"]||""}
                options={OPTIONS.Featured}
                onChange={(v)=>setVal("Featured", v)}
              />

              <div>
                <label className="block text-sm font-medium">Created Date</label>
                <input className="asb-input" value={model["Created Date"]||""} readOnly />
              </div>

              <div>
                <label className="block text-sm font-medium">Client Inquiries</label>
                <input className="asb-input" value={
                  Array.isArray(model["Client Inquiries"]) ? model["Client Inquiries"].length : (model["Client Inquiries"]||0)
                } readOnly />
              </div>

              <div className="md:col-span-2 flex gap-2 flex-wrap">
                {["Experience Score","Total Events","Potential Revenue"].map((f)=>(
                  <span key={f} className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-sm">
                    {f}: <b>{model[f]??"—"}</b>
                  </span>
                ))}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Header Image</label>
                <UploadWidget
                  value={model["Header Image"]||null}
                  onChange={(file)=>setVal("Header Image", file)}
                  note="This is the wide banner image"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Internal Notes</label>
                <textarea className="asb-textarea" rows={4}
                  value={model["Internal Notes"]||""}
                  onChange={(e)=>setVal("Internal Notes", e.target.value)} />
              </div>
            </div>
          )}
        </section>

        <footer className="flex items-center justify-between px-5 py-4 border-t">
          <div id="asb-toast" className="text-sm text-neutral-600 transition-opacity opacity-0"> </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200" onClick={onClose}>Close</button>
            <button className="px-3 py-2 rounded-lg bg-neutral-900 text-white opacity-60 cursor-not-allowed" title="Saving in next patch">
              Save (next patch)
            </button>
          </div>
        </footer>
      </div>
      <style>{`
        .asb-input { width:100%; border:1px solid #e5e7eb; border-radius:12px; padding:.6rem .8rem; }
        .asb-textarea { width:100%; border:1px solid #e5e7eb; border-radius:12px; padding:.6rem .8rem; }
      `}</style>
    </div>,
    document.body
  );
}

