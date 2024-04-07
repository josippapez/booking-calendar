import { SingleApartmentDto, useApartmentsControllerUpdate } from '@/api';
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
import { Modify } from '@/lib/utils';
import { ImageInput } from '@modules/Shared/Inputs/ImageInput';
import { queryClient } from '@modules/Shared/Providers/TanstackQueryProvider';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type Props = {
  apartment: SingleApartmentDto;
  customTrigger?: React.ReactNode;
};

export const EditApartment: React.FC<Props> = ({
  apartment,
  customTrigger,
}) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('Apartments');

  const [progress, setProgress] = useState<number>();

  const { mutate: updateApartment, isPending: updateApartmentIsPending } =
    useApartmentsControllerUpdate({
      mutation: {
        mutationKey: ['apartments-update'],
        onSuccess: data => {
          toast.success(t('apartment_updated'));
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
      request: {
        onUploadProgress(progressEvent) {
          setProgress(progressEvent.progress);
        },
      },
    });

  const form = useForm<Modify<SingleApartmentDto, { image?: Blob | string }>>({
    values: apartment,
    mode: 'all',
    reValidateMode: 'onBlur',
  });

  const { handleSubmit, watch, reset, setValue } = form;

  const onSubmit = handleSubmit(
    async data => {
      return updateApartment({
        apartmentId: data.id,
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
            {t('edit')}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side={'right'} className='w-full !max-w-none md:w-[600px]'>
        <SheetHeader>
          <SheetTitle>Edit apartment</SheetTitle>
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
                  disabled={updateApartmentIsPending}
                  leftIcon={
                    updateApartmentIsPending ? (
                      <Loader2Icon className='animate-spin' />
                    ) : null
                  }
                  size={'lg'}
                >
                  {t('edit')}
                </Button>
              </div>
            </form>
          </Form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
