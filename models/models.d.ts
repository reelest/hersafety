type ForeignKey<T> = String;
interface UserData extends CountedItem {
  firstName: String;
  lastName: String;
  otherNames: String;
  email: String;
  emailVerified: Boolean;
  phoneNumber: String;
  dateCreated: Date;
  lastUpdated: Date;
  photoURL: FileURL;
  lastLogin: Date;
  profileCompleted: Boolean;
}

interface Drug {
  name: String;
  price: Number;
  currentStock: Number;
}

interface Prescription {
  user: ForeignKey<UserData>;
  date: Datetime;
  drugs: Array<ForeignKey<DrugDetail>>;
}

interface DrugDetail {
  prescriptionId: ForeignKey<Prescription>;
  drug: ForeignKey<Drug>;
  amount: Number;
}

class Transaction {
  amount: Number;
  prescription: ForeignKey<Prescription>;
}
