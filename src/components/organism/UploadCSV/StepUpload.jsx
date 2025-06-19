import React, { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload
} from '@fortawesome/free-solid-svg-icons';

export default function StepUpload({ csvFile, setCsvFile, onCsvParsed, onNext }) {
  const fileInputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    import("@/utils/csvWizardUtils").then(utils => {
      utils.parseCsvFile(
        file,
        ({ rows, columns }) => {
          setCsvFile(file);
          onCsvParsed(rows, columns);
        },
        () => alert("Failed to parse CSV")
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[350px]">
      <div
        className="w-full border-2 border-dashed rounded-xl bg-gray-50 flex flex-col items-center justify-center py-12 px-6 transition hover:border-primary cursor-pointer relative"
        onClick={() => fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={e => handleFile(e.target.files[0])}
        />
        <div className="flex flex-col items-center">
          <span className="text-primary text-4xl mb-4">
            <FontAwesomeIcon icon={faUpload} />
          </span>
          <p className="text-lg font-semibold mb-1">
            Drag &amp; drop your CSV here<br />
            <span className="font-normal text-secondary">or <span className="underline text-primary cursor-pointer">browse to upload</span></span>
          </p>
          <p className="text-xs text-secondary mt-1">Only .CSV files accepted. Max size: 5MB</p>
        </div>
      </div>
      {csvFile && (
        <div className="mt-4 text-green-600">{csvFile.name} uploaded</div>
      )}
      <button
        className="mt-8 w-full bg-blue-200 text-blue-900 font-semibold py-3 rounded-lg disabled:opacity-50"
        disabled={!csvFile}
        onClick={onNext}
      >
        Next: Map Columns &rarr;
      </button>
    </div>
  );
}