import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { EventsByYear } from "../src/components/Calendar/CalendarTypes";
import PageLoader from "../src/components/Shared/Loader/PageLoader";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BE_API_URL;

const DynamicPublicCalendar = dynamic(
  () => import("../src/components/Home/LandingPage/PublicCalendar"),
  {
    suspense: true,
  }
);

type Props = {};

const PublicCalendar: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <DynamicPublicCalendar {...props} />
    </Suspense>
  );
};

const getEventsById = async (id: string): Promise<EventsByYear> => {
  const event = await axios
    .get(`/publicEvents/${id}`)
    .then(res => {
      if (res.data) {
        return res.data.data;
      }
      return {};
    })
    .catch(err => {
      return {};
    });

  return event as EventsByYear;
};

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
  const apartment = await axios
    .get(`/apartments/${id}`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return undefined;
    });

  if (!apartment || apartment.length === 0) {
    return {
      apartmentEmail: "",
      apartmentLogo: "",
      apartmentName: "",
    };
  }

  return {
    apartmentEmail: apartment.email,
    apartmentLogo: apartment.image,
    apartmentName: apartment.name,
  };
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const navigate = context.params;
  if (navigate && navigate.id && typeof navigate.id === "string") {
    const events: EventsByYear | {} = await getEventsById(navigate.id);
    const apartmentData = await getApartmentEmail(navigate.id);

    if (apartmentData === undefined) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        events,
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
      destination: "/",
      permanent: false,
    },
  };
};

export default PublicCalendar;
