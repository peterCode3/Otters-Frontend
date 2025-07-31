import React, { useState } from "react";
import StepUpload from "./StepUpload";
import StepColumns from "./StepColumns";
import StepParameters from "./StepParameters";
import { useRouter } from 'next/router';
import {
  mapCsvRowsToLeads,
  processLeadsApi,
  resetWizard
} from "@/utils/csvWizardUtils";
import { toast } from "react-toastify";

export default function CsvWizard() {
  const [step, setStep] = useState(1);
  const [csvFile, setCsvFile] = useState(null);
  const [csvRows, setCsvRows] = useState([]);
  const [csvColumns, setCsvColumns] = useState([]);
  const [selectedType, setSelectedType] = useState("urls");
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [urlColumn, setUrlColumn] = useState("");
  const [parameters, setParameters] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [useCustomParams, setUseCustomParams] = useState(false);

  const router = useRouter();

  // Step navigation
  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  // On CSV parsed
  const onCsvParsed = (rows, columns) => {
    setCsvRows(rows);
    setCsvColumns(columns);
  };


  // Process list (send to backend)
  const handleProcess = async () => {
    setProcessing(true);
    const leads = mapCsvRowsToLeads(csvRows, selectedType === "all" ? selectedColumns : [urlColumn]);

    const res = await processLeadsApi({
      leads,
      parameters: useCustomParams ? parameters : [],
      use_custom_criteria: useCustomParams,
      form_version: 'formVersion',
      scoring_profile_id: 'scoringProfileId'
    });

    setProcessing(false);
    if (res.status === 200) {
      toast.success("Leads processed successfully!");
      setTimeout(() => router.push('/leads-vault'), 3000);
      resetWizard({ setStep, setCsvFile, setCsvRows, setCsvColumns, setSelectedColumns, setUrlColumn, setParameters });
    } else {
      toast.error("Error processing leads.");
    }
  };



  return (
    <div className="w-full max-w-xl mx-auto my-10 bg-white rounded-2xl shadow-soft p-8">
      <div className="flex mb-8">
        {["Upload CSV", "Select Columns", "Set Parameters"].map((label, idx) => (
          <div key={label} className="flex-1 flex flex-col items-center">
            <div className={`h-1 w-full ${step > idx ? "bg-primary" : "bg-gray-200"}`}></div>
            <span className={`mt-2 text-sm ${step === idx + 1 ? "text-primary font-semibold" : "text-gray-400"}`}>{label}</span>
          </div>
        ))}
      </div>
      {step === 1 && (
        <StepUpload
          csvFile={csvFile}
          setCsvFile={setCsvFile}
          onCsvParsed={onCsvParsed}
          onNext={next}
        />
      )}
      {step === 2 && (
        <StepColumns
          columns={csvColumns}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          useCustomParams={useCustomParams}
          setUseCustomParams={setUseCustomParams}
          onPrev={prev}
          onNext={() => {
            if (useCustomParams) {
              next(); // Step 3
            } else {
              handleProcess(); // Immediate processing
            }
          }}
          processing={processing}
        />
      )}
      {step === 3 && (
        <StepParameters
          parameters={parameters}
          setParameters={setParameters}
          onPrev={prev}
          onProcess={handleProcess}
          processing={processing}
        />
      )}
    </div>
  );
}