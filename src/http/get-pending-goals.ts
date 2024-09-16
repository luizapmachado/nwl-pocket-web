//objeto como iremos receber o backend
type PendingGoalsResponse = {
  id: string
  title: string
  desiredWeeklyFrequency: number
  completionCount: number
}[]

//toda funcao assincrona no javascript retorna uma Promisse
// função sera executada para trazer os dados
export async function getPendingGoals(): Promise<PendingGoalsResponse> {
  const response = await fetch('http://localhost:3333/pending-goals')
  const data = await response.json()

  return data.pendingGoals
}
