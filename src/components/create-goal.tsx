import { X } from 'lucide-react';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from './ui/radio-group';
import { Button } from './ui/button';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGoal } from '../http/create-goal';
import { useQueryClient } from '@tanstack/react-query';

const createGoalForm = z.object({
  title: z.string().min(1, 'Informe a atividade que deseja realizar'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
});

type VezesNaSemana = {
  value: number;
  emoti: string;
};

export type CreateGoalForm = z.infer<typeof createGoalForm>;

const vezesNaSemana: VezesNaSemana[] = [
  { value: 1, emoti: '🥱' },
  { value: 2, emoti: '🙂' },
  { value: 3, emoti: '😎' },
  { value: 4, emoti: '😜' },
  { value: 5, emoti: '🤨' },
  { value: 6, emoti: '🤯' },
  { value: 7, emoti: '🔥' },
];

export function CreateGoal() {
  const queryClient = useQueryClient();

  const { register, control, handleSubmit, formState, reset } =
    useForm<CreateGoalForm>({
      resolver: zodResolver(createGoalForm),
    });

  async function handleCreateGoal(data: CreateGoalForm) {
    await createGoal(data);

    queryClient.invalidateQueries({ queryKey: ['summary'] });
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] });

    reset();
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Cadastrar Meta</DialogTitle>
            <DialogClose>
              <X className="size-5 text-zinc-600" />
            </DialogClose>
          </div>

          <DialogDescription>
            Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora
            mesmo?
          </DialogDescription>
        </div>

        <form
          onSubmit={handleSubmit(handleCreateGoal)}
          className="flex flex-col justify-between flex-1"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Qual a atividade</Label>
              <Input
                autoFocus
                id="title"
                placeholder="Praticar exercícios, meditar, etc..."
                {...register('title')}
              />

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
                defaultValue={1}
                render={({ field }) => {
                  return (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      {vezesNaSemana.map(item => {
                        return (
                          <RadioGroupItem
                            key={item.value}
                            value={String(item.value)}
                          >
                            <RadioGroupIndicator />
                            <span className="text-zinc-300 text-sm font-medium leading-none">
                              {item.value === 7
                                ? 'Todos os dias da semana'
                                : `${item.value}x na semana`}
                            </span>
                            <span className="text-lg leading-none">
                              {item.emoti}
                            </span>
                          </RadioGroupItem>
                        );
                      })}
                    </RadioGroup>
                  );
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button type="button" className="flex-1" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
            <Button className="flex-1">Salvar</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
