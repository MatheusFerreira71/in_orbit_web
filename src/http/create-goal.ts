import type { CreateGoalForm } from '../components/create-goal';

export async function createGoal(data: CreateGoalForm) {
  await fetch('http://localhost:3333/goals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
