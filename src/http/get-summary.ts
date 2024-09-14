interface GoalsPerDay {
  id: string;
  title: string;
  completedAt: Date;
}

export interface SummaryResponse {
  completed: number;
  total: number;
  goalsPerDay: Record<string, GoalsPerDay[]>;
}

export async function getSummary(): Promise<SummaryResponse> {
  const response = await fetch('http://localhost:3333/summary');
  const data = await response.json();
  return data;
}
