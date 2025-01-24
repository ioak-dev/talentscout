export type Assessment = {
  name: string;
  jobDescription?: string;
  duration?: number;
  _id?: string;
  status?: "Draft" | "Active" | "Paused" | "Closed";
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  createdDate?: string;
  skillSet?:any;
};
