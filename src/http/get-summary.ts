//objeto como iremos receber o backend
type SummaryResponse = {
  completed: number
  total: number
  goalsPerDay: Record<
    string,
    {
      id: string
      title: string
      completedAt: string
    }[]
  >
}

//toda funcao assincrona no javascript retorna uma Promisse
// função sera executada para trazer os dados
export async function getSummary(): Promise<SummaryResponse> {
  const response = await fetch('http://localhost:3333/summary ')
  const data = await response.json()

  return data.summary
}
