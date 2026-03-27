export interface CareDiaryRecord {
  id: string;
  timestamp: number;
  date: string;
  patientId?: string;
  recorderId?: string;
  basicStatus: {
    sleepQuality: string;
    appetite: string;
    mood: string;
  };
  bpsdSymptoms: string[];
  bpsdOtherDetail?: string;
  adlStatus: string[];
  notes: string;
  hasSevereIncident: boolean;
}
