import {
  Document,
  Image,
  Page,
  Text,
  View,
} from '@/components/Shared/Invoice/Templates/custom/Components';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import InterBold from '@public/Styles/Assets/Fonts/Inter-Bold.ttf';
import InterLight from '@public/Styles/Assets/Fonts/Inter-Light.ttf';
import InterRegular from '@public/Styles/Assets/Fonts/Inter-Regular.ttf';
import { TransactionInvoiceData } from '../Invoice';
import { Font, StyleSheet } from '@react-pdf/renderer';

type Props = {
  translate: TFunction;
  locale: string;
  apartmentData: TransactionInvoiceData['apartmentData'];
  recepientData: TransactionInvoiceData['recepientData'];
  invoiceData: TransactionInvoiceData['invoiceData'];
};

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: InterRegular,
      fontWeight: 'normal',
    },
    {
      src: InterBold,
      fontWeight: 'bold',
    },
    { src: InterLight, fontWeight: 'light' },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 40,
    fontSize: 10,
    fontFamily: 'Inter',
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  horizontalCenter: {
    alignItems: 'center',
  },
  verticalCenter: {
    justifyContent: 'center',
  },
  lightGrayText: {
    color: '#818181',
  },
  marginTop10: {
    marginTop: 10,
  },
  padding20: {
    padding: 20,
  },
  paddingX20: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  paddingY20: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  paddingY10: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  paddingX10: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  semibold: {
    fontWeight: 'semibold',
  },
});

const TransactionInvoice = (props: Props): JSX.Element => {
  const { translate, locale, apartmentData, invoiceData, recepientData } =
    props;

  return (
    <Document>
      <Page size='A4' style={[styles.page]}>
        <View
          style={[
            styles.row,
            { justifyContent: 'space-between', height: '20%' },
          ]}
        >
          {apartmentData?.image && (
            <Image
              src={apartmentData.image}
              style={[
                {
                  width: '40%',
                  height: 100,
                  objectFit: 'contain',
                  padding: 10,
                },
              ]}
            />
          )}
          <View style={[styles.column, styles.padding20, { width: '40%' }]}>
            <Text>{apartmentData?.name}</Text>
            <Text>{apartmentData?.address}</Text>
            <Text>{apartmentData?.owner}</Text>
            <Text>
              {apartmentData?.pid
                ? `${translate('pid')}: ${apartmentData?.pid}`
                : ''}
            </Text>
            <Text>
              {apartmentData?.iban
                ? `${translate('iban')}: ${apartmentData?.iban}`
                : ''}
            </Text>
          </View>
        </View>
        <View style={[styles.column, { marginBottom: 40 }]}>
          <Text>{recepientData.recepientName}</Text>
          <Text>{recepientData.recepientAddress}</Text>
          <Text>{recepientData.recepientPID}</Text>
        </View>
        <View style={[styles.row, { marginBottom: 40 }]}>
          <View style={[styles.column, { left: 40 }]}>
            <Text
              style={[
                {
                  fontSize: 20,
                  fontFamily: 'Inter',
                  fontWeight: 'bold',
                  lineHeight: 1.5,
                },
              ]}
            >
              {invoiceData?.invoiceName}
            </Text>
            <Text>
              {translate('date_of_invoice')}:{' '}
              {invoiceData.date
                ? DateTime.fromISO(invoiceData.date)
                    .setLocale(locale)
                    .toLocaleString({
                      month: 'long',
                      day: '2-digit',
                      year: 'numeric',
                    })
                : ''}
            </Text>
          </View>
        </View>
        <View style={[styles.column]}>
          <View style={[styles.column]}>
            <View
              style={[
                styles.row,
                {
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  paddingBottom: 10,
                  borderBottom: '1px solid #818181',
                },
              ]}
            >
              <Text style={[{ width: '40%', textAlign: 'left' }]}>
                {translate('service_name')}
              </Text>
              <Text style={[{ width: '20%' }]}>{translate('amount')}</Text>
              <Text style={[{ width: '20%' }]}>{translate('price')}</Text>
              <Text style={[{ width: '20%' }]}>{translate('total')}</Text>
            </View>
            {invoiceData?.services.map((service, index) => (
              <View
                key={index}
                style={[
                  styles.row,
                  {
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    margin: '5 0',
                  },
                ]}
              >
                <Text style={[{ width: '40%', textAlign: 'left' }]}>
                  {service.name}
                </Text>
                <Text style={[{ width: '20%' }]}>
                  {Number(service.amount).toLocaleString(locale)}
                </Text>
                <Text style={[{ width: '20%' }]}>
                  {Number(service.price).toLocaleString(locale, {
                    minimumFractionDigits: 2,
                  })}
                </Text>
                <Text style={[{ width: '20%' }]}>
                  {Number(service.total).toLocaleString(locale, {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View
          style={[
            styles.row,
            { marginTop: 40, display: 'flex', justifyContent: 'flex-end' },
          ]}
        >
          <View
            style={[
              styles.row,
              { width: '40%', justifyContent: 'space-around' },
            ]}
          >
            <Text>{translate('total_price')}</Text>
            <Text>
              {invoiceData?.services
                .reduce((a, b) => a + Number(b.total), 0)
                .toLocaleString(locale, {
                  minimumFractionDigits: 2,
                })}{' '}
              {invoiceData?.totalCurrency}
            </Text>
          </View>
        </View>
        <View style={[styles.row, { marginTop: 40, marginBottom: 40 }]}>
          <View style={[styles.column, { left: 40 }]}>
            <Text style={[{ fontSize: 10 }]}>
              {translate('user_is_free_of_vat')}
            </Text>
            <View style={[{ left: 20, marginBottom: 20 }]}>
              <Text>{translate(`free_of_vat_true`)}</Text>
            </View>
            <Text style={[{ fontSize: 10 }]}>
              {translate('fiscalisation_invoice')}
            </Text>
            <View style={[{ left: 20, marginBottom: 20 }]}>
              <Text>
                {translate('transaction_invoice')}{' '}
                {invoiceData.dateOfFiscalization !== ''
                  ? DateTime.fromISO(invoiceData.dateOfFiscalization)
                      .setLocale(locale)
                      .toLocaleString({
                        month: 'long',
                        day: '2-digit',
                        year: 'numeric',
                      })
                  : ''}
              </Text>
            </View>
            <Text style={[{ fontSize: 10 }]}>{translate('note')}:</Text>
            <View style={[{ left: 20, marginBottom: 20 }]}>
              <Text>{invoiceData?.note}</Text>
            </View>
          </View>
        </View>
        <View
          fixed
          style={[
            styles.column,
            {
              position: 'absolute',
              bottom: 10,
              left: 0,
              right: 0,
              textAlign: 'center',
              color: 'gray',
              alignItems: 'center',
            },
          ]}
        >
          {invoiceData?.contact_name && (
            <Text style={[{ fontSize: 10 }]}>
              {translate('contact')}: {invoiceData?.contact}{' '}
              {`(${invoiceData?.contact_name})`}
            </Text>
          )}
          <Text style={[{ fontSize: 10 }]}>{invoiceData?.email}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TransactionInvoice;
