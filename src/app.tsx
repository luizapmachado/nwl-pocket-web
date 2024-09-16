import { Dialog } from './components/ui/dialog'
import { CreateGoal } from './components/create-goal'
import { Summary } from './components/summary'
import { EmptyGoals } from './components/empty-goal'
import { useQuery } from '@tanstack/react-query'
import { getSummary } from './http/get-summary'

export function App() {
  //retorna um data do tipo SummaryResponse que foi definido dentro do getSummary
  const { data } = useQuery({
    //precisa passar duas propriedades obrigatorias
    //propriedade query key sempre sera um array, passa uma identifcação unica para a requisição toda
    queryKey: ['summary'],
    //query function que é qual função sera executada para trazer os dados
    queryFn: getSummary,
    //conseguimos colocar um cache interno em ms para considerar por quanto tempo o dado é válido
    staleTime: 1000 * 60, //60 seconds
  })

  return (
    <Dialog>
      {/* funcao if dentro do react se total > 0 entao mostra o summary, senao mostra empty goals */}
      {data?.total && data.total > 0 ? <Summary /> : <EmptyGoals />}
      <CreateGoal />
    </Dialog>
  )
}
