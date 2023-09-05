import {
  Box,
  Typography,
  Button,
  Modal,
  Paper,
  IconButton,
} from "@mui/material";
import PageHeader from "../PageHeader";
import { Add, CloseCircle } from "iconsax-react";
import SessionSelect from "../SessionSelect";
import { usePagedQuery, useQuery } from "@/models/lib/query";
import Registrations from "@/models/registration";
import ThemedTable from "../ThemedTable";
import Table, {
  TableButton,
  addClassToColumns,
  addHeaderClass,
  supplyValue,
} from "../Table";
import { useEffect, useState } from "react";
import RegistrationsForm from "./RegistrationsForm";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import Payments from "@/models/payment";
import { noop } from "@/utils/none";
import SuccessDialog from "../SuccessDialog";
import ModelForm from "../ModelForm";
import ModelFormDialog from "../ModelFormDialog";
import { formatDate, formatNumber, formatTime } from "@/utils/formatNumber";
import Card1 from "../Card1";

const HEADERS = ["Title", "Description", "Amount", "Date", "Time"];
const select = (item, i) => {
  switch (i) {
    case 0:
      return item.title;
    case 1:
      return item.description;
    case 2:
      return "\u20A6" + formatNumber(item.amount);
    case 3:
      return formatDate(item.timestamp);
    case 4:
      return formatTime(item.timestamp);
  }
};
export default function TransactionsPage() {
  const { data: payments, pager } = useQuery(() => Payments.all().pageSize(10));
  const [formVisible, setFormVisible] = useState(false);
  const [formCreateVisible, setFormCreateVisible] = useState(false);
  const [item, setItem] = useState(null);
  useEffect(() => {
    if (!formVisible && !formCreateVisible) {
      setItem(null);
    }
  }, [formVisible, formCreateVisible]);
  const showModal = (row) => {
    setItem(payments[row]);
    setFormVisible(true);
  };
  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <PaymentModal
        payment={item}
        isOpen={formVisible}
        onClose={() => setFormVisible(false)}
      />
      <ModelFormDialog
        edit={item}
        isOpen={formCreateVisible}
        onClose={() => setFormCreateVisible(false)}
        model={Payments}
      />
      <PageHeader title="User Dashboard" />
      <Box className="px-4 sm:px-8 py-8">
        <div className="flex flex-wrap justify-between">
          <Typography variant="h6" as="h2">
            Transactions
          </Typography>
        </div>
        <div className="flex flex-wrap pt-6 -mx-2 justify-center">
          <Button
            variant="contained"
            size="large"
            onClick={() => setFormCreateVisible(true)}
          >
            Record Transaction <Add size={32} className="ml-2" />
          </Button>
        </div>
        <ThemedTable
          title="Payments"
          headers={HEADERS}
          results={payments}
          pager={pager}
          onClickRow={(_, row) => showModal(row)}
          renderHooks={[supplyValue((row, col) => select(payments[row], col))]}
        />
      </Box>
    </Box>
  );
}

function PaymentModal({ isOpen, payment, onClose }) {
  // const canDelete = payment.
  return (
    <Modal onClose={onClose} open={isOpen} className="p-4 flex items-center">
      <Card1
        sx={{
          flexGrow: 0,
          width: "20rem",
          maxWidth: "90%",
          minWidth: "45vw",
          mx: "auto",
          px: 4,
          py: 8,
        }}
      >
        <Table
          cols={2}
          rows={HEADERS.length}
          loading={!payment}
          headers={["", ""]}
          data={payment}
          className="w-full"
          renderHooks={[
            addClassToColumns(
              "border border-solid align-middle px-4 leading-loose"
            ),
            addClassToColumns("w-0", [0]),
            supplyValue((row, col, data) =>
              col === 0 ? (
                <Typography variant="body2" color="gray.dark">
                  {" "}
                  {HEADERS[row]}
                </Typography>
              ) : (
                select(data, row)
              )
            ),
          ]}
        />
      </Card1>
    </Modal>
  );
}
