import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { TFunction } from "react-i18next";
import { Apartment } from "../../../../../store/reducers/apartments";

type Props = {
  translate: TFunction;
  apartmentData: Apartment | null;
  receiptData: {
    receiptName: string;
    apartmentOwner: string;
    recepient: string;
    recepientAddress: string;
    recepientPID: string;
  };
};

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "/Styles/Assets/Fonts/Inter-VariableFont.ttf",
      fontWeight: "normal",
    },
    // {
    //   src: "/Styles/Assets/Fonts/Inter-VariableFont.ttf",
    //   fontWeight: "bold",
    // },
    // { src: "/Styles/Assets/Fonts/Inter-VariableFont.ttf", fontWeight: "light" },
    // {
    //   src: "/Styles/Assets/Fonts/Inter-VariableFont.ttf",
    //   fontWeight: "semibold",
    // },
    // {
    //   src: "/Styles/Assets/Fonts/Inter-VariableFont.ttf",
    //   fontWeight: "medium",
    // },
    // {
    //   src: "/Styles/Assets/Fonts/Inter-VariableFont.ttf",
    //   fontWeight: "extrabold",
    // },
    // { src: "/Styles/Assets/Fonts/Inter-VariableFont.ttf", fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 20,
    fontSize: 12,
    // fontFamily: "Opensans",
  },
  column: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  horizontalCenter: {
    alignItems: "center",
  },
  verticalCenter: {
    justifyContent: "center",
  },
  lightGrayText: {
    color: "#818181",
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
  personalInfo: {
    maxHeight: 400,
    height: "auto",
    minHeight: 150,
  },
  topBar: {
    height: "auto",
    flexDirection: "column",
    backgroundColor: "#183042",
    color: "white",
  },
  topBarName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  topBarPosition: {
    marginTop: 10,
    fontSize: 14,
  },
  topBarText: {
    marginTop: 10,
    fontSize: 11,
  },
  additionalInfoBar: {
    maxHeight: 150,
    height: "auto",
    backgroundColor: "#0C1829",
    color: "white",
  },
  additionalInfoBarText: {
    fontSize: 11,
    marginLeft: 20,
  },
  companyName: {
    fontSize: 13,
    fontWeight: "bold",
  },
  companyPosition: {
    fontSize: 11,
    fontWeight: "medium",
  },
  companyDescription: {
    fontSize: 11,
    marginTop: 10,
  },
  customTimeline: {
    backgroundColor: "#183042",
    width: 4,
    borderRadius: 5,
    marginRight: 40,
  },
  companyLocation: {
    fontSize: 11,
    marginTop: 0,
  },
  companyDuration: {
    fontSize: 11,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 20,
  },
  languageCard: {
    width: "auto",
    height: "auto",
    margin: "0 10px 10px 0",
    backgroundColor: "#DFF0FC",
    borderRadius: 3,
    color: "#3B93D5",
    padding: "5px 15px",
  },
});

const TransactionReceipt = (props: Props): JSX.Element => {
  const { translate, apartmentData, receiptData } = props;

  const data = {
    apartmentData: {
      name: "Apartmani Dunav",
      address: "Trg Dženije Trg 1, 1000 Ljubljana",
      apartmentOwner: "Dario Čeč",
      pid: "123456789",
      iban: "SI56 0234 0234 0234 0234",
    },
    recepientData: {
      recepientName: "Fika Eco d.o.o",
      recepientAddress: "Trg Dženije Trg 1, 1000 Ljubljana",
      recepientPID: "123456789",
    },
    receiptData: {
      receiptName: "Receipt",
      date: "25.03.2021",
      VAT: false,
      note: "Odgovorna osoba za idvanje računa: Dario Čeč",
      contact: "+3861 123 456 789",
      email: "doracec13@gmail.com",
      services: [
        {
          name: "Service 1",
          price: "100",
          ammount: "1",
        },
        {
          name: "Service 2",
          price: "200",
          ammount: "2",
        },
      ],
    },
  };
  return (
    <Document>
      <Page size="A4" style={[styles.page]}>
        <View style={[styles.row, { justifyContent: "space-around" }]}>
          {apartmentData?.image && (
            <Image
              src={apartmentData.image}
              style={[
                styles.padding20,
                { width: "50%", height: 100, objectFit: "contain" },
              ]}
            />
          )}
          <View style={[styles.column, styles.padding20, { width: "40%" }]}>
            <Text>{data.apartmentData?.name}</Text>
            <Text>{data.apartmentData?.address}</Text>
            <Text>{data.apartmentData?.apartmentOwner}</Text>
            <Text>{data.apartmentData?.pid}</Text>
            <Text>{data.apartmentData?.iban}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TransactionReceipt;
