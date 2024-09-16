import { X } from 'lucide-react'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from './ui/radio-group'
import { Button } from './ui/button'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGoal } from '../http/create-goal'
import { useQueryClient } from '@tanstack/react-query'

//criar um schema
const createGoalForm = z.object({
  title: z.string().min(1, 'Informe a atividade que deseja realizar'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7), //coerce, nao importa se vier string, vai converter para numero
})

//criando o tipo de objeto que sera enviado pelo formulario
type CreateGoalForm = z.infer<typeof createGoalForm>

export function CreateGoal() {
  const queryClient = useQueryClient()

  //register: vai indicar quais campos fazem parte do formulario
  //control: é um objeto que tem várias funções que podem acessar do formulário
  const { register, control, handleSubmit, formState, reset } =
    useForm<CreateGoalForm>({
      resolver: zodResolver(createGoalForm),
    })

  //funcao que faz a chamada para o endpoint que cria uma nova meta
  async function handleCreateGoal(data: CreateGoalForm) {
    await createGoal({
      title: data.title,
      desiredWeeklyFrequency: data.desiredWeeklyFrequency,
    })

    //quando uma nova meta for incluida ele vai atualizar a pagina summary e pending goals
    queryClient.invalidateQueries({
      queryKey: ['summary'],
    })
    queryClient.invalidateQueries({
      queryKey: ['pending-goals'],
    })

    reset()
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Cadastrar meta</DialogTitle>
            <DialogClose>
              <X className="size-5 text-zinc-600" />
            </DialogClose>
          </div>

          <DialogDescription>
            Adicione atividades que te fazem bem e que você quer continuar
            praticando toda semana.
          </DialogDescription>
        </div>
        <form
          onSubmit={handleSubmit(handleCreateGoal)}
          className="flex-1 flex flex-col justify-between"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Qual a atividade?</Label>
              <Input
                id="title"
                autoFocus
                placeholder="Praticar exercícios, meditar, etc"
                //usado dessa forma quando é um input nativo do html
                {...register('title')}
              />
              {/* if sem o else utiliza && para validar se for true */}
              {formState.errors.title && (
                <p className="text-red-400 text-sm">
                  {formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Quantas vezes na semana?</Label>
              <Controller
                control={control}
                name="desiredWeeklyFrequency"
                defaultValue={3}
                render={({ field }) => {
                  return (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <RadioGroupItem value="1">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          1x na semana
                        </span>
                        <span className="text-lg leading-none">🥱</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="2">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          2x na semana
                        </span>
                        <span className="text-lg leading-none">🙂</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="3">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          3x na semana
                        </span>
                        <span className="text-lg leading-none">😎</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="4">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          4x na semana
                        </span>
                        <span className="text-lg leading-none">😜</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="5">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          5x na semana
                        </span>
                        <span className="text-lg leading-none">🤨</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="6">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          6x na semana
                        </span>
                        <span className="text-lg leading-none">🤯</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="7">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          Todos os dias da semana
                        </span>
                        <span className="text-lg leading-none">🔥</span>
                      </RadioGroupItem>
                    </RadioGroup>
                  )
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button className="flex-1" variant="secondary">
                Fechar
              </Button>
            </DialogClose>

            <Button className="flex-1">Salvar</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
