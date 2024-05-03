export type Assessment = {
  name: string;
  jobDescription?: string;
  duration?: string;
  id?: string;
  status?: "Draft" | "Active" | "Paused" | "Closed";
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  createdDate?: string;
};
