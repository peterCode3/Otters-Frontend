import React, { useState } from "react";
import { generateAIParameters } from "@/utils/csvWizardUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";

const defaultOptions = [
  {
    name: "Fintech",
    condition: "Company operates in the fintech sector."
  },
  {
    name: "Home Improvement Focus",
    condition: "Company focuses on home improvement."
  },
  {
    name: "Online Presence",
    condition: "Company has a strong online presence."
  },
  {
    name: "Payments",
    condition: "Company offers online payment options."
  }
];

export default function StepParameters({
  parameters,
  setParameters,
  onPrev,
  onProcess,
  processing
}) {
  const [showAI, setShowAI] = useState(false);
  const [aiDesc, setAIDesc] = useState("");
  const [showFull, setShowFull] = useState({});
  const [genreating, setGenreating] = useState(false);
  // Always show at least one parameter field
  React.useEffect(() => {
    if (parameters.length === 0) {
      setParameters([{ name: "", condition: "" }]);
    }
  }, []);

  const addParameter = () => {
    setParameters([...parameters, { name: "", condition: "" }]);
  };

  const removeParameter = (idx) => {
    if (parameters.length > 1) {
      setParameters(parameters.filter((_, i) => i !== idx));
      setShowFull(prev => {
        const copy = { ...prev };
        delete copy[idx];
        return copy;
      });
    }
  };

  const updateParameter = (idx, param) => {
    setParameters(parameters.map((p, i) => (i === idx ? param : p)));
  };

  const handleSelect = (idx, val) => {
    const found = defaultOptions.find(opt => opt.name === val);
    if (found) {
      updateParameter(idx, { ...found });
    } else {
      updateParameter(idx, { name: val, condition: "" });
    }
  };

  const handleAIGenerate = async () => {
    setGenreating(true);
    try{
        const params = await generateAIParameters(aiDesc);
        setParameters(params && params.length > 0 ? params : [{ name: "", condition: "" }]);
        setShowAI(false);
        setAIDesc("");
        toast.success("Generate Parameters Success")
    }catch{
      setGenreating(false);
      toast.error("Generate Parameters Errors")
    }
  };

  // Helper to get preview of condition (first two words)
  const getPreview = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= 12) return text;
    return words.slice(0, 12).join(" ") + " ...more";
  };


  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Set Filtering Parameters</h2>
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary/10 text-primary font-medium"
          onClick={() => setShowAI(true)}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />

          AI parameter assistant
        </button>
      </div>
      <p className="mb-4 text-secondary">Set up to three parameters for qualification.</p>
      {parameters.map((param, idx) => (
        <div key={idx} className="flex flex-col md:flex-row gap-4 mb-3 items-start">
          <div className="flex-1">
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={param.name}
              onChange={e => handleSelect(idx, e.target.value)}
            >
              <option value="">Select or enter parameter</option>
              {[...defaultOptions, ...parameters]
                .filter((opt, index, self) =>
                  index === self.findIndex(o => o.name === opt.name)
                )
                .map(opt => (
                  <option key={opt.name} value={opt.name}>{opt.name}</option>
                ))}

            </select>
          </div>
          <div className="flex-1">
            <div className="relative">
              <textarea
                className="w-full border rounded-lg px-3 py-2"
                rows={showFull[idx] ? 3 : 2}
                value={
                  showFull[idx]
                    ? param.condition
                    : getPreview(param.condition)
                }
                onChange={e =>
                  updateParameter(idx, {
                    ...param,
                    condition: e.target.value
                  })
                }
              />
              {param.condition && param.condition.split(" ").length > 2 && (
                <button
                  className="absolute right-2 bottom-2 text-primary text-xs"
                  onClick={e => {
                    e.preventDefault();
                    setShowFull(f => ({ ...f, [idx]: !f[idx] }));
                  }}
                >
                  {showFull[idx] ? "Hide" : "Show full"}
                </button>
              )}
            </div>
          </div>
          <button
            className="cursor-pointer text-danger mt-7"
            onClick={() => removeParameter(idx)}
            disabled={parameters.length === 1}
            title={parameters.length === 1 ? "At least one parameter required" : "Delete parameter"}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      ))}

      <button
        className="cursor-pointer mt-2 mb-6 px-4 py-2 rounded border border-primary text-primary font-medium"
        disabled={parameters.length >= 3}
        onClick={addParameter}
      >
        + Add Parameter
      </button>
      <div className="w-full flex justify-between gap-3 mt-8">
        <button className="rounded-lg px-6 py-3 font-semibold bg-gray-100 text-secondary hover:bg-gray-200 transition" onClick={onPrev}>Back</button>
        <button
          className="cursor-pointer rounded-lg px-6 py-3 font-semibold text-white bg-primary hover:bg-primary/90 transition"
          onClick={onProcess}
          disabled={processing}
        >
          {processing ? "Processing..." : "Process List"}
        </button>
      </div>
      {/* AI Parameter Modal */}
      {showAI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow p-8 w-full max-w-lg relative">
            <button
              className="cursor-pointer absolute top-4 right-4 text-secondary"
              onClick={() => setShowAI(false)}
            >
              <span className="text-xl">✕</span>
            </button>
            <h3 className="text-xl font-bold mb-2">AI Parameter Assistant</h3>
            <p className="mb-4 text-secondary">
              Describe your ideal company to generate qualification parameters.
            </p>
            <textarea
              className="w-full border rounded-lg px-3 py-2 mb-4"
              rows={4}
              placeholder="e.g. B2B SaaS companies in Germany..."
              value={aiDesc}
              onChange={e => setAIDesc(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button className="rounded-lg px-6 py-3 font-semibold bg-gray-100 text-secondary hover:bg-gray-200 transition" onClick={() => setShowAI(false)}>Cancel</button>
              <button
                className="cursor-pointer rounded-lg px-6 py-3 font-semibold text-white bg-primary hover:bg-primary/90 transition disabled:opacity-50"
                disabled={!aiDesc}
                onClick={handleAIGenerate}
              >
              {genreating ? "Genreating..." : "Generate Parameters"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}