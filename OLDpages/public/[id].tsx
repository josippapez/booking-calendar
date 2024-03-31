import { FirebaseService } from '@/store/FirebaseService';
import { PageLoader } from '@modules/Shared/Loader/PageLoader';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const firebase = FirebaseService.getInstance();

const DynamicPublicCalendar = dynamic(
  () =>
    import('@modules/PublicCalendar/PublicCalendar').then(
      mod => mod.PublicCalendar
    ),
  {
    suspense: true,
  }
);

type Props = {};

const PublicCalendar: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader isLoading />}>
      <DynamicPublicCalendar {...props} />
    </Suspense>
  );
};

// const getEventsById = async (id: string): Promise<EventsByYear> => {
//   const document = await getDoc(
//     doc(firebase.getFirestore(), "events", `${id}/data/public`)
//   );

//   if (!document.exists()) {
//     return {};
//   }
//   const event = document.data();

//   return event as EventsByYear;
// };

const getApartmentEmail = async (
  id: string
): Promise<
  | {
      apartmentLogo: string;
      apartmentEmail: string;
      apartmentName: string;
    }
  | undefined
> => {
  const document = await getDoc(
    doc(firebase.getFirestore(), 'events', `${id}`)
  );
  if (!document.exists()) {
    return {
      apartmentEmail: '',
      apartmentLogo: '',
      apartmentName: '',
    };
  }
  const eventsUserId = document.data();

  if (eventsUserId) {
    const apartmentData = await getDoc(
      doc(firebase.getFirestore(), 'apartments', `${eventsUserId.userId}`)
    );
    if (!apartmentData.exists()) {
      return {
        apartmentLogo: '',
        apartmentEmail: '',
        apartmentName: '',
      };
    }
    const apartment = apartmentData.data();

    return {
      apartmentLogo: apartment[id].image,
      apartmentEmail: apartment[id].email,
      apartmentName: apartment[id].name,
    };
  }
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const navigate = context.params;
  if (navigate && navigate.id && typeof navigate.id === 'string') {
    // const events = await getEventsById(navigate.id);
    const apartmentData = await getApartmentEmail(navigate.id);

    if (apartmentData === undefined) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    return {
      props: {
        // events,
        apartmentName: apartmentData.apartmentName,
        apartmentEmail: apartmentData.apartmentEmail,
        apartmentLogo: apartmentData.apartmentLogo,
      },
    };
  }
  return {
    props: {
      events: {},
      apartmentEmail: null,
      apartmentLogo: null,
      apartmentName: null,
    },
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default PublicCalendar;
