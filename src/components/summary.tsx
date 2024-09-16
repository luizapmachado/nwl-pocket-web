import { CheckCircle2, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { InOrbitIcon } from './ui/in-orbit-icon'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import { OutlineButton } from './ui/outline-button'
import { useQuery } from '@tanstack/react-query'
import { getSummary } from '../http/get-summary'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br.js'
import { PendingGoals } from './pending-goals'

//para datas no formato brasileiro
dayjs.locale(ptBR)

export function Summary() {
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

  //para nao dar erro em valores futuros caso ainda não tenha caregado os dados, vamos fazer o if abaixo e caso seja nulo ele nao vai executar os próximos métodos
  if (!data) {
    return null
  }

  //para formatos olhar a documentação do dayjs
  const firstDayOfWeek = dayjs().startOf('week').format('D MMM')
  const lastDayOfWeek = dayjs().endOf('week').format('D MMM')

  //calcular o progresso
  //round para arredondar o número
  const completedPercentage = Math.round((data.completed * 100) / data.total)

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold capitalize">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar Meta
          </Button>
        </DialogTrigger>
      </div>
      <div className="flex flex-col gap-3">
        <Progress value={8} max={15}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{data?.completed}</span> de{' '}
            <span className="text-zinc-100">{data?.total}</span> metas nessa
            semana
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>
      <Separator />

      <PendingGoals />
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>
        {/* converter o objeto goalsPerDay para array  
        sempre usar o map pois conseguimos fazer o return, ao inves do foreach para iterar 
        a chave do map é o date e o valor é o goals[] 
        */}
        {Object.entries(data.goalsPerDay).map(([date, goals]) => {
          const weekDay = dayjs(date).format('dddd')
          const formattedDate = dayjs(date).format('D[ de ]MMMM')

          return (
            // quando utuilizamos o react precisamos passar primeiro uma key indicando qual o valor único de cada item da iteração
            <div key={date} className="flex flex-col gap-4">
              <h3 className="font-medium">
                <span className="capitalize">{weekDay}</span>{' '}
                <span className="text-zinc-400 text-xs">({formattedDate})</span>
              </h3>
              <ul className="flex flex-col gap-3">
                {goals.map(goal => {
                  const time = dayjs(goal.completedAt).format('HH:mm')

                  return (
                    <li key={goal.id} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-pink-500" />
                      <span className="text-sm text-zinc-400">
                        Você completou "
                        <span className="text-zinc-100">{goal.title}</span>" às{' '}
                        <span className="text-zinc-100">{time}h</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
