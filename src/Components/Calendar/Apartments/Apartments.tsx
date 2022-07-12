import isEqual from 'lodash/fp/isEqual';
import { useEffect, useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import { Link, useNavigate } from 'react-router-dom';
import isMobileView from '../../../checkForMobileView';
import {
  editApartment,
  removeApartment,
  saveApartment,
} from '../../../store/firebaseActions/apartmentActions';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectApartment,
  setApartments,
} from '../../../store/reducers/apartments';
import { setEvents } from '../../../store/reducers/events';

type Props = {};

const Apartments = (props: Props) => {
  const dispatch = useAppDispatch();
  const firestore = useFirestore();
  const mobileView = isMobileView();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.user.user);
  const apartments = useAppSelector(state => state.apartments);
  const [newApartment, setNewApartment] = useState({
    id: '',
    name: '',
    address: '',
  });

  const getApartmentsForuser = async (id: string) => {
    const apartmentsData = await (
      await firestore.collection('apartments').doc(id).get()
    ).data();

    if (!isEqual(apartmentsData, apartments.apartments)) {
      dispatch(
        setApartments(
          apartmentsData as {
            [key: string]: {
              id: string;
              name: string;
              address: string;
            };
          }
        )
      );
    }
  };

  useEffect(() => {
    getApartmentsForuser(user.id);
  }, []);

  return (
    <div className={`${isMobileView() ? 'py-10 px-4' : 'page-container p-10'}`}>
      <div className='flex justify-between'>
        <div className='font-bold text-xl'>Apartments</div>
      </div>
      <div className='w-full max-w-xs'>
        <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 relative'>
          {newApartment.id && (
            <div
              className='absolute right-0 top-0 w-8 h-8 font-black text-3xl rounded-full cursor-pointer text-center bg-white'
              onClick={() => {
                setNewApartment({
                  id: '',
                  name: '',
                  address: '',
                });
              }}
            >
              x
            </div>
          )}
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='apartmentName'
            >
              Apartment Name
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='apartmentName'
              type='text'
              placeholder='Apartment Name'
              value={newApartment.name}
              onChange={e => {
                setNewApartment({ ...newApartment, name: e.target.value });
              }}
            />
          </div>
          <div className='mb-6'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='apartmentAddress'
            >
              Apartment Address
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
              id='apartmentAddress'
              type='text'
              placeholder='Apartment Address'
              value={newApartment.address}
              onChange={e => {
                setNewApartment({
                  ...newApartment,
                  address: e.target.value,
                });
              }}
            />
          </div>
          <div className='flex items-center justify-between'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='button'
              onClick={() => {
                if (newApartment.address && newApartment.name) {
                  if (newApartment.id) {
                    dispatch(editApartment(newApartment));
                    setNewApartment({
                      id: '',
                      name: '',
                      address: '',
                    });
                    return;
                  }
                  dispatch(
                    saveApartment({
                      ...newApartment,
                      id: crypto.getRandomValues(new Uint8Array(16)).join(''),
                    })
                  );
                  setNewApartment({
                    id: '',
                    name: '',
                    address: '',
                  });
                }
              }}
            >
              {newApartment && newApartment.id
                ? 'Edit Apartment'
                : 'Add Apartment'}
            </button>
          </div>
        </form>
      </div>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-left text-gray-500 dark:text-gray-400 text-base'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-6 py-3 text-md'>
                Name
              </th>
              <th scope='col' className='px-6 py-3 text-md'>
                Address
              </th>
              <th scope='col' className='px-6 py-3'>
                <span className='sr-only'>Edit</span>
                <span className='sr-only'>Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {apartments &&
              apartments?.apartments &&
              Object.keys(apartments.apartments).map(apartment => (
                <tr
                  className='bg-white border-b cursor-pointer hover:bg-gray-100 hover:transition-colors duration-150'
                  key={apartments.apartments[apartment].id}
                  onClick={() => {
                    if (
                      apartments.selectedApartment?.id !==
                      apartments.apartments[apartment].id
                    ) {
                      dispatch(setEvents({}));
                    }
                    dispatch(selectApartment(apartments.apartments[apartment]));
                    navigate(
                      `/apartments/${apartments.apartments[apartment].id}`
                    );
                  }}
                >
                  <th
                    scope='row'
                    className='font-bold px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap'
                  >
                    {apartments.apartments[apartment].name}
                  </th>
                  <td className='font-bold px-6 py-4'>
                    {apartments.apartments[apartment].address}
                  </td>
                  <td
                    className={`px-6 py-4 text-right ${
                      mobileView ? 'flex' : ''
                    }`}
                  >
                    <button
                      className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                      onClick={e => {
                        e.stopPropagation();
                        dispatch(
                          removeApartment(apartments.apartments[apartment].id)
                        );
                      }}
                    >
                      Remove
                    </button>
                    <button
                      className='font-medium text-blue-600 dark:text-blue-500 hover:underline ml-4'
                      onClick={e => {
                        e.stopPropagation();
                        setNewApartment(apartments.apartments[apartment]);
                      }}
                    >
                      Edit
                    </button>
                    {!mobileView && (
                      <Link
                        key={apartments.apartments[apartment].id}
                        to={`/apartments/${apartments.apartments[apartment].id}`}
                        className='font-medium text-blue-600 dark:text-blue-500 hover:underline ml-4'
                        onClick={() => {
                          if (
                            apartments.selectedApartment?.id !==
                            apartments.apartments[apartment].id
                          ) {
                            dispatch(setEvents({}));
                          }
                          dispatch(
                            selectApartment(apartments.apartments[apartment])
                          );
                        }}
                      >
                        Select
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Apartments;
