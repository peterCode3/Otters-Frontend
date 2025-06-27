import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

// Parse CSV and return { rows, columns }
export function parseCsvFile(file, onComplete, onError) {
  import('papaparse').then(Papa => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onComplete({
          rows: results.data,
          columns: results.meta.fields || []
        });
      },
      error: onError
    });
  });
}

export function mapCsvRowsToLeads(csvRows, selectedColumns) {
  return csvRows.map(row => {
    const lead = {};

    selectedColumns.forEach(col => {
      lead[col] = row[col] || "";
    });

    const nameAliases = ["name", "full name", "company name", "business", "company"];
    const emailAliases = ["email", "Email", "e-mail", "contact_email"];

    const fallbackName = nameAliases.find(k => row[k]) || "Unknown";
    const fallbackEmail = emailAliases.find(k => row[k]) || "";

    lead.name = row[fallbackName] || "Unknown";
    lead.email = row[fallbackEmail] || "";

    return lead;
  });
}


// API call to process leads
export async function processLeadsApi({ leads, parameters }) {
  const res = await axios.post(`${API}/leads/process-leads`, {
    leads,
    parameters
  }, { withCredentials: true });
  return res;
}

// Reset wizard state
export function resetWizard(setters) {
  setters.setStep(1);
  setters.setCsvFile(null);
  setters.setCsvRows([]);
  setters.setCsvColumns([]);
  setters.setSelectedColumns([]);
  setters.setUrlColumn("");
  setters.setParameters([]);
}




export async function generateAIParameters(description) {
  try {
    const response = await axios.post(`${API}/leads/generate-parameters`, { context: description }, { withCredentials: true });
    return response.data.parameters || [];
  } catch (error) {
    console.error('Failed to generate parameters:', error);
    return [];
  }
}

