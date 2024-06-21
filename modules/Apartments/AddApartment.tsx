import { CreateApartmentDto, useApartmentsControllerCreate } from '@/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ImageInput } from '@modules/Shared/Inputs/ImageInput';
import { queryClient } from '@modules/Shared/Providers/TanstackQueryProvider';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type Props = {
  customTrigger?: React.ReactNode;
};

export const AddApartment: React.FC<Props> = ({ customTrigger }) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('Apartments');

  const [progress, setProgress] = useState<number>();

  const { mutate: createApartment, isPending: createApartmentIsPending } =
    useApartmentsControllerCreate({
      mutation: {
        mutationKey: ['apartments-create'],
        onSuccess: data => {
          toast.success(t('apartment_created'));
          queryClient.invalidateQueries({
            queryKey: ['apartments'],
          });
          setOpen(false);
        },
        onError: error => {
          setProgress(0);
          toast.error(error.response?.data.message);
        },
      },
    });

  const form = useForm<CreateApartmentDto>({
    defaultValues: {
      address: '',
      email: '',
      iban: '',
      image: '',
      name: '',
      owner: '',
      pid: '',
      pricePerNight: 0,
    },
    mode: 'all',
    reValidateMode: 'onBlur',
    shouldFocusError: true,
  });

  const { handleSubmit, watch, reset, setValue } = form;

  const onSubmit = handleSubmit(
    async data => {
      return createApartment({
        data,
      });
    },
    errors => {
      console.log(errors);
    }
  );

  return (
    <Sheet
      open={open}
      onOpenChange={open => {
        if (!open) {
          reset();
        }
        setOpen(open);
      }}
    >
      <SheetTrigger asChild onClick={e => e.stopPropagation()}>
        {customTrigger ?? (
          <Button className='w-fit px-4' size={'sm'}>
            {t('add_apartment')}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side={'right'} className='w-full !max-w-none md:w-[600px]'>
        <SheetHeader>
          <SheetTitle>{t('add_apartment')}</SheetTitle>
          <Form {...form}>
            <form onSubmit={onSubmit} className='space-y-8'>
              <FormField
                control={form.control}
                name='name'
                rules={{
                  required: t('required_name'),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apartment_name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('apartment_name_description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                rules={{
                  required: t('required_email'),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apartment_email')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('apartment_email_description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                rules={{
                  required: t('required_address'),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apartment_address')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='owner'
                rules={{
                  required: t('required_owner'),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apartment_owner')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='iban'
                rules={{
                  required: t('required_iban'),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apartment_IBAN')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pricePerNight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apartment_price_per_night')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pid'
                rules={{
                  required: t('required_pid'),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('apartment_pid')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>{t('apartment_image')}</FormLabel>
                <FormControl>
                  <ImageInput
                    image={watch('image') as string}
                    setImage={image => {
                      setValue('image', image);
                    }}
                    clearImage={() => {
                      setValue('image', '');
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <div className='flex justify-end'>
                <Button
                  type='submit'
                  disabled={createApartmentIsPending}
                  leftIcon={
                    createApartmentIsPending ? (
                      <Loader2Icon className='animate-spin' />
                    ) : null
                  }
                  size={'lg'}
                >
                  {t('save')}
                </Button>
              </div>
            </form>
          </Form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
